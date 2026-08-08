# AI开发考核_余铿_JSONL记录校验工具

一个基于 Node.js 的命令行工具，用于校验 AI 开发考核的 JSONL 记录文件。

## 选题说明

AI 开发考核过程中，每轮任务的结果以 JSONL 格式记录。随着记录增多，手动检查每条记录的 JSON 合法性、字段完整性、格式规范性变得不可行。这个工具用于自动化校验 JSONL 文件，确保考核记录的质量。

## 功能说明

- 逐行读取 JSONL 文件并校验 JSON 语法
- 校验必填字段是否存在
- 校验字段格式（round_id 递增、时间格式、枚举值等）
- 输出校验结果，支持 CI/脚本集成

## 运行环境

- Node.js（仅使用标准库，无第三方依赖）

## 使用方法

```bash
node validate-jsonl.js <文件路径>
```

## 示例命令

校验通过：
```bash
$ node validate-jsonl.js sample.valid.jsonl
文件: sample.valid.jsonl
总轮数: 2
校验通过
```

校验失败：
```bash
$ node validate-jsonl.js sample.invalid.jsonl
文件: sample.invalid.jsonl
总行数: 7
错误数量: 5
第 3 行: Unexpected token 'o', "not a valid"... is not valid JSON
第 4 行: round_id 跳号: 上一行是 2，当前是 4
第 5 行: modify_time 格式错误，应为 YYYY-MM-DD HH:MM:SS
第 6 行: agent_type 只能是 Kilo Code、PI、Cine 之一
第 7 行: 缺少字段 commit_hash
```

## 校验规则

| 字段 | 规则 |
|------|------|
| round_id | 必须为 ≥1 的整数（支持数字字符串），且从 1 开始连续递增，不能跳号或重复 |
| prompt_content | 必须是非空字符串 |
| modify_diff | 必须是非空字符串 |
| commit_hash | 必须是非空字符串 |
| modify_time | 必须符合 YYYY-MM-DD HH:MM:SS 格式 |
| agent_type | 只能是 Kilo Code、PI、Cine 之一 |
| dev_language | 只能是 C/C++、Java、JavaScript、TypeScript、Rust、Go、PHP、Ruby 之一 |

## 开发过程说明

这个项目使用编程智能体（Kilo Code）分 5 轮完成开发。每轮先确定一个小目标，然后让智能体实现代码，最后验证结果并生成记录。

### 各轮任务

- **第 1 轮**：基础 JSONL 校验。实现命令行参数读取、文件存在检查、逐行 JSON.parse、统计总行数和错误行数。
- **第 2 轮**：字段校验。检查每行是否包含 7 个必填字段（round_id、prompt_content、modify_diff、commit_hash、modify_time、agent_type、dev_language），缺少则报告。
- **第 3 轮**：字段格式校验。增加 round_id 连续性检查、modify_time 格式检查、agent_type 和 dev_language 枚举检查、字符串非空检查。
- **第 4 轮**：优化命令行输出。将输出格式改为简洁风格，区分校验通过和失败两种状态，失败时进程退出码为 1，通过时为 0。
- **第 5 轮**：补充示例文件。添加 sample.valid.jsonl 和 sample.invalid.jsonl 两个示例文件，方便演示和测试。

## 提示词产生方法

每轮开发前，先明确当前轮次要解决的具体问题，拆成一个独立的小需求，然后编写提示词让智能体实现。例如：

- 第 1 轮："使用 JavaScript 编写一个命令行工具 validate-jsonl.js，用于校验 AI 开发考核 JSONL 文件。第一版只实现最基础功能..."
- 第 2 轮："在现有 validate-jsonl.js 基础上增加字段校验。每一行 JSON 必须包含..."
- 第 3 轮："继续完善 validate-jsonl.js，增加字段格式校验。规则：..."

每轮只加一个维度的新功能，避免需求过大导致实现偏离。

## JSONL 文件生成方法

每轮完成开发后，使用 `make-record.js` 脚本生成一行 JSONL 记录。脚本会：

1. 读取当前 git 提交的 diff（`git show --unified=999`）
2. 获取当前 commit hash（`git rev-parse HEAD`）
3. 获取当前提交时间（`git show --format=%cd`）
4. 将上述信息与当轮的 prompt 组装成一行 JSON
5. 追加到 `AI开发考核_余铿_JSONL记录校验工具.jsonl` 文件末尾

## 遇到的问题和解决方法

- **round_id 连续性检查问题**：第 3 轮实现连续性检查时，如果某一行因为缺少字段或格式错误而失败，`lastRoundId` 不会更新，导致后续所有行都可能错误地报告跳号。解决方法是将 round_id 的连续性检查与字段完整性检查分离：只要当前行的 round_id 存在且格式合法，就更新 `lastRoundId`，无论其他字段是否错误。
