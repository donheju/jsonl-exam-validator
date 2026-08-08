const fs = require('fs');
const { execFileSync } = require('child_process');

const file = 'AI开发考核_余铿_JSONL记录校验工具.jsonl';

const record = {
  round_id: 4,
  prompt_content: '优化 validate-jsonl.js 的命令行输出。要求：校验通过时输出文件名、总轮数、校验通过；校验失败时输出文件名、总行数、错误数量、每个错误的行号和原因；如果有错误，进程退出码为 1；如果没有错误，进程退出码为 0；输出内容要简洁，适合 README 展示。不要增加依赖。',
  modify_diff: execFileSync('git', ['show', '--format=', '--unified=999', 'HEAD'], { encoding: 'utf8' }),
  commit_hash: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  modify_time: execFileSync('git', ['show', '-s', '--format=%cd', '--date=format:%Y-%m-%d %H:%M:%S', 'HEAD'], { encoding: 'utf8' }).trim(),
  agent_type: 'Kilo Code',
  dev_language: 'JavaScript'
};

fs.appendFileSync(file, JSON.stringify(record) + '\n', 'utf8');
console.log('已追加第 4 轮记录:', file);