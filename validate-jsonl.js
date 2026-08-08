const fs = require('fs');

const REQUIRED_FIELDS = [
  'round_id', 
  'prompt_content',
  'modify_diff',
  'commit_hash',
  'modify_time',
  'agent_type',
  'dev_language'
];

const ALLOWED_AGENT_TYPES = new Set(['Kilo Code', 'PI', 'Cine']);
const ALLOWED_DEV_LANGUAGES = new Set(['C/C++', 'Java', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'PHP', 'Ruby']);

function validateModifyTime(value) {
  if (typeof value !== 'string') {
    return 'modify_time 必须是字符串';
  }
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
    return 'modify_time 格式错误，应为 YYYY-MM-DD HH:MM:SS';
  }
  const [datePart, timePart] = value.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  if (month < 1 || month > 12) return 'modify_time 月份无效';
  if (day < 1 || day > 31) return 'modify_time 日期无效';
  if (hour < 0 || hour > 23) return 'modify_time 小时无效';
  if (minute < 0 || minute > 59) return 'modify_time 分钟无效';
  if (second < 0 || second > 59) return 'modify_time 秒无效';
  return null;
}

function validateAgentType(value) {
  if (!ALLOWED_AGENT_TYPES.has(value)) {
    return `agent_type 只能是 ${[...ALLOWED_AGENT_TYPES].join('、')} 之一`;
  }
  return null;
}

function validateDevLanguage(value) {
  if (!ALLOWED_DEV_LANGUAGES.has(value)) {
    return `dev_language 只能是 ${[...ALLOWED_DEV_LANGUAGES].join('、')} 之一`;
  }
  return null;
}

function validateString(value, fieldName) {
  if (typeof value !== 'string' || value.length === 0) {
    return `${fieldName} 必须是非空字符串`;
  }
  return null;
}

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

  const errors = [];
  let totalLines = 0;
  let validCount = 0;
  let lastRoundId = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    totalLines++;
    let obj;

    try {
      obj = JSON.parse(line);
    } catch (e) {
      errors.push({ line: i + 1, reason: e.message });
      continue;
    }

    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      errors.push({ line: i + 1, reason: 'JSON顶层必须是对象' });
      continue;
    }

    const lineErrors = [];

    const currentRoundId = Number(obj.round_id);
    if (Number.isInteger(currentRoundId) && currentRoundId >= 1) {
      if (currentRoundId !== lastRoundId + 1) {
        if (currentRoundId <= lastRoundId) {
          lineErrors.push(`round_id ${currentRoundId} 重复或小于上一行 ${lastRoundId}`);
        } else {
          lineErrors.push(`round_id 跳号: 上一行是 ${lastRoundId}，当前是 ${currentRoundId}`);
        }
      }
      lastRoundId = currentRoundId;
    }

    const missing = REQUIRED_FIELDS.filter(f => !(f in obj));
    if (missing.length > 0) {
      errors.push({ line: i + 1, reason: `缺少字段 ${missing.join(', ')}` });
      continue;
    }

    const timeErr = validateModifyTime(obj.modify_time);
    if (timeErr) lineErrors.push(timeErr);

    const agentErr = validateAgentType(obj.agent_type);
    if (agentErr) lineErrors.push(agentErr);

    const langErr = validateDevLanguage(obj.dev_language);
    if (langErr) lineErrors.push(langErr);

    const hashErr = validateString(obj.commit_hash, 'commit_hash');
    if (hashErr) lineErrors.push(hashErr);

    const promptErr = validateString(obj.prompt_content, 'prompt_content');
    if (promptErr) lineErrors.push(promptErr);

    const diffErr = validateString(obj.modify_diff, 'modify_diff');
    if (diffErr) lineErrors.push(diffErr);

    if (lineErrors.length > 0) {
      lineErrors.forEach(reason => errors.push({ line: i + 1, reason }));
    } else {
      validCount++;
    }
  }

  const errorCount = errors.length;

  if (errorCount === 0) {
    console.log(`文件: ${filePath}`);
    console.log(`总轮数: ${validCount}`);
    console.log('校验通过');
    process.exit(0);
  } else {
    console.log(`文件: ${filePath}`);
    console.log(`总行数: ${totalLines}`);
    console.log(`错误数量: ${errorCount}`);
    errors.forEach(e => console.log(`第 ${e.line} 行: ${e.reason}`));
    process.exit(1);
  }
}

main();
