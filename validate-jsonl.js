const fs = require('fs');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('用法: node validate-jsonl.js <文件路径>');
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`文件错误: ${filePath} 不存在`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const REQUIRED_FIELDS = [
    'round_id',
    'prompt_content',
    'modify_diff',
    'commit_hash',
    'modify_time',
    'agent_type',
    'dev_language'
  ];

  let totalLines = 0;
  let validCount = 0;
  let jsonErrorCount = 0;
  let fieldErrorCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    totalLines++;

    let obj;
    try {
      obj = JSON.parse(line);
    } catch (e) {
      jsonErrorCount++;
      console.log(`第 ${i + 1} 行: ${e.message}`);
      continue;
    }

    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      fieldErrorCount++;
      console.log(`第 ${i + 1} 行: JSON顶层必须是对象`);
      continue;
    }

    const missing = REQUIRED_FIELDS.filter(f => !(f in obj));
    if (missing.length > 0) {
      fieldErrorCount++;
      console.log(`第 ${i + 1} 行: 缺少字段 ${missing.join(', ')}`);
      continue;
    }

    validCount++;
  }

  const errorCount = jsonErrorCount + fieldErrorCount;

  console.log(`\n总计: ${totalLines} 行`);
  console.log(`合法JSON: ${validCount} 行`);
  console.log(`错误JSON: ${errorCount} 行`);
}

main();
