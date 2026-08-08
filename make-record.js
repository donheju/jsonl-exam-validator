const fs = require('fs');
const { execFileSync } = require('child_process');

const file = 'AI开发考核_余铿_JSONL记录校验工具.jsonl';

const prompts = [
  '使用 JavaScript 编写一个命令行工具 validate-jsonl.js，用于校验 AI 开发考核 JSONL 文件。第一版只实现最基础功能：从命令行读取文件路径参数；没有传路径时输出用法；文件不存在时输出错误；逐行读取并 JSON.parse；输出总行数、合法 JSON 行数、错误行数；非法 JSON 输出行号和错误原因。只使用 Node.js 标准库。',
  '在现有 validate-jsonl.js 基础上增加字段校验。每一行 JSON 必须包含 round_id、prompt_content、modify_diff、commit_hash、modify_time、agent_type、dev_language。如果缺少字段，要输出行号和缺少的字段名。要求保留第一版已有功能，不引入 npm 依赖，代码保持简单。',
  '继续完善 validate-jsonl.js，增加字段格式校验。规则：round_id 必须是数字或数字字符串；round_id 必须从 1 开始递增，不能跳号，不能重复；modify_time 必须符合格式 YYYY-MM-DD HH:MM:SS；agent_type 只能是 Kilo Code、PI、Cine 之一；dev_language 只能是 C/C++、Java、JavaScript、TypeScript、Rust、Go、PHP、Ruby 之一；commit_hash 必须是非空字符串；prompt_content 和 modify_diff 必须是字符串。要求输出清晰的行号和错误原因，保留已有功能，只用 Node.js 标准库。'
];

const commits = execFileSync('git', ['log', '--reverse', '--format=%H'], {
  encoding: 'utf8'
}).trim().split(/\r?\n/).slice(0, 3);

const records = commits.map((hash, i) => ({
  round_id: i + 1,
  prompt_content: prompts[i],
  modify_diff: execFileSync('git', ['show', '--format=', '--unified=999', hash], {
    encoding: 'utf8'
  }),
  commit_hash: hash,
  modify_time: execFileSync('git', ['show', '-s', '--format=%cd', '--date=format:%Y-%m-%d %H:%M:%S', hash], {
    encoding: 'utf8'
  }).trim(),
  agent_type: 'Kilo Code',
  dev_language: 'JavaScript'
}));

fs.writeFileSync(file, records.map(r => JSON.stringify(r)).join('\n') + '\n', 'utf8');
console.log(`已重新生成 ${records.length} 条记录：${file}`);