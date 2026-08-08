const fs = require('fs');
const { execFileSync } = require('child_process');

const file = 'AI开发考核_余铿_JSONL记录校验工具.jsonl';

const record = {
  round_id: 5,
  prompt_content: '请为这个项目补充两个示例文件：1. sample.valid.jsonl，包含 2 行合法记录，字段完整，格式正确；2. sample.invalid.jsonl，包含几种常见错误：非法 JSON、缺少字段、round_id 不连续、modify_time 格式错误、agent_type 不在允许范围内。要求示例内容贴近 AI 开发考核场景，不修改核心逻辑，除非发现必要的小问题。',
  modify_diff: execFileSync('git', ['show', '--format=', '--unified=999', 'HEAD'], { encoding: 'utf8' }),
  commit_hash: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  modify_time: execFileSync('git', ['show', '-s', '--format=%cd', '--date=format:%Y-%m-%d %H:%M:%S', 'HEAD'], { encoding: 'utf8' }).trim(),
  agent_type: 'Kilo Code',
  dev_language: 'JavaScript'
};

fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8');
console.log('已追加第 5 轮记录:', file);