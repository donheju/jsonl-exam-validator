const fs = require('fs');
const { execFileSync } = require('child_process');

const file = 'AI开发考核_余铿_JSONL记录校验工具.jsonl';

const record = {
  round_id: 3,
  prompt_content: '继续完善 validate-jsonl.js，增加字段格式校验。规则：round_id 必须是数字或数字字符串；round_id 必须从 1 开始递增，不能跳号，不能重复；modify_time 必须符合格式 YYYY-MM-DD HH:MM:SS；agent_type 只能是 Kilo Code、PI、Cine 之一；dev_language 只能是 C/C++、Java、JavaScript、TypeScript、Rust、Go、PHP、Ruby 之一；commit_hash 必须是非空字符串；prompt_content 和 modify_diff 必须是字符串。要求输出清晰的行号和错误原因，保留已有功能，只用 Node.js 标准库。',
  modify_diff: execFileSync('git', ['show', '--format=', '--unified=999', 'HEAD'], { encoding: 'utf8' }),
  commit_hash: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  modify_time: '2026-08-08 11:23:00',
  agent_type: 'Kilo Code',
  dev_language: 'JavaScript'
};

fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8');
console.log('已追加第 3 轮记录:', file);