const fs = require('fs');
const { execFileSync } = require('child_process');

const file = 'AI开发考核_余铿_JSONL记录校验工具.jsonl';

const record = {
  round_id: 7,
  prompt_content: '请对整个项目做最终检查。检查 validate-jsonl.js 是否能正常运行，sample.valid.jsonl 是否能通过校验，sample.invalid.jsonl 是否能输出错误，README.md 的命令是否和实际代码一致，是否存在明显的代码问题或说明不一致。如果发现问题，请做最小修改；如果没有问题，请说明无需修改。',
  modify_diff: execFileSync('git', ['show', '--format=', '--unified=999', 'HEAD'], { encoding: 'utf8' }),
  commit_hash: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  modify_time: execFileSync('git', ['show', '-s', '--format=%cd', '--date=format:%Y-%m-%d %H:%M:%S', 'HEAD'], { encoding: 'utf8' }).trim(),
  agent_type: 'Kilo Code',
  dev_language: 'JavaScript'
};

fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8');
console.log('已追加第 7 轮记录:', file);