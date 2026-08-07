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

  let totalLines = 0;
  let validCount = 0;
  let errorCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    totalLines++;

    try {
      JSON.parse(line);
      validCount++;
    } catch (e) {
      errorCount++;
      console.log(`第 ${i + 1} 行: ${e.message}`);
    }
  }

  console.log(`\n总计: ${totalLines} 行`);
  console.log(`合法JSON: ${validCount} 行`);
  console.log(`错误JSON: ${errorCount} 行`);
}

main();
