const fs = require('fs');
const { execFileSync } = require('child_process');

const file = 'AI开发考核_余铿_JSONL记录校验工具.jsonl';

const record = {
  round_id: 6,
  prompt_content: '请为这个项目编写 README.md。README 需要包含：项目名称、选题说明、功能说明、运行环境、使用方法、示例命令、校验规则说明、开发过程说明、提示词产生方法、JSONL 文件生成方法、遇到的问题和解决方法。要求用中文，直白清楚，不要写得太夸张，符合招聘考核提交要求。',
  modify_diff: execFileSync('git', ['show', '--format=', '--unified=999', 'HEAD'], { encoding: 'utf8' }),
  commit_hash: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  modify_time: execFileSync('git', ['show', '-s', '--format=%cd', '--date=format:%Y-%m-%d %H:%M:%S', 'HEAD'], { encoding: 'utf8' }).trim(),
  agent_type: 'Kilo Code',
  dev_language: 'JavaScript'
};

fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8');
console.log('已追加第 6 轮记录:', file);