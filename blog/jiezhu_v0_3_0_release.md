---
title: "Jiezhu DevBlog #3：v0.3.0 来袭"
author: "Not A DevStudio Team"
date: "2026-06-23"
tags: ["v0.3.0", "documentation"]
desc: "Jiezhu v0.3.0 发布，立即查看详细更新日志吧"
---

# v0.3.0 开发日志：当"稳稳接住"成为工程实践

距离 v0.2.0 发布已经过去一段时间。这次 v0.3.0 发布的主题很明确：**让"稳稳接住"不再只是一个有趣的 Prompt，而是一个有完整工程支撑的 SDK**。

## 核心亮点：OpenAI Responses API 支持

这是 v0.3.0 最重要的功能更新。OpenAI 的 Responses API（`/v1/responses`）是一种比 Chat Completions 更灵活的接口范式。我们在 C++ SDK 中完整实现了这一支持，包括阻塞调用、流式调用以及对应的 jiezhu "加持"模式。

### 新增类型

三个新的数据结构构成了 Responses API 的请求/响应骨架：

- **`response_request`** — 支持 `input_text`（纯文本）和 `input_messages`（消息数组）两种输入模式，以及顶层的 `instructions` 字段（相当于 Chat Completions 的 system message）。`to_json()` 方法会根据输入内容自动选择合适的序列化格式。
- **`response_response`** — 封装了 Responses API 特有的响应格式，`first_content()` 方法兼容处理结构化输出（`output[0].content[*].text`）和快捷字段（`output_text`）。
- **`response_stream_event`** — 流式事件模型，通过 `event_type` 区分 `response.output_text.delta` 等 SSE 事件类型，`done` 标志在 `response.completed` 或 `error` 事件时自动置位。

### 新增方法

| 方法 | 说明 |
|------|------|
| `responses_create()` | 阻塞 POST 请求，JSON 解析 |
| `responses_stream()` | SSE 流式解析，支持 `event:` + `data:` 双行协议 |
| `responses_jiezhu()` | 自动在 `instructions` 和 system messages 中注入中文前缀 |
| `responses_stream_jiezhu()` | 流式版本 + 前缀注入 |

所有 jiezhu 变体在 `JIE_ENABLE_JIEZHU_ABLITY` 未定义时都会编译为抛出 `std::runtime_error` 的桩函数，保持了与 Chat Completions 一致的构建策略。

### 流式协议差异

与 Chat Completions 相比，Responses API 的 SSE 协议有一个关键差异：它使用显式的 `event:` 行来标记事件类型（如 `response.output_text.delta`），而 Chat Completions 只有 `data:` 行。我们为此引入了独立的 `response_stream_state` 状态跟踪器和 `parse_and_emit_response_sse_line()` 解析函数。

`main.cpp` 中也新增了 Responses API 的 demo 代码，展示从构造请求到解析响应的完整流程。

## 文档基础设施：从 README 到专业文档站

v0.3.0 之前，项目的文档散落在各个 README 中。这次我们引入了完整的 **Doxygen + GitHub Pages** 文档体系。

### Doxyfile 配置

两套独立的 Doxygen 配置分别服务于 C++ SDK 和 Python SDK：

- `Doxyfile-cpp` — 扫描 `jiezhu-cpp/` 目录，生成树状导航、全文搜索的 HTML 文档
- `Doxyfile-py` — 使用 `OPTIMIZE_OUTPUT_JAVA = YES` 模式正确解析 Python reStructuredText 风格 docstring

### 自定义首页

`doxy/index.html` 是一个 273 行的自定义落地页，包含：
- C++ / Python 双语言标签切换
- 左右分栏的导航树 + 内容区布局
- 深蓝色渐变头部，带 GitHub 仓库链接
- 响应式设计，小屏自动隐藏侧边栏

### 覆盖全代码库的内联文档

这不是简单的"加几个注释"——我们对 **每一个头文件、源文件、测试文件、Python 模块** 进行了全面的 Doxygen 文档化：

- C++ 侧：`chat.hpp`、`jiezhu.hpp`、`chat.cpp`、`jiezhu.cpp`、全部 5 个测试文件、`test_http_server.hpp`
- Python 侧：`__init__.py`、`hijack.py`、`conftest.py`、`test_claude_hijack.py`、`test_openai_hijack.py`
- 每个函数、每个参数、每个返回值、每个异常都有 `@brief` / `@param` / `@return` / `@throw` 标注

`jiezhu-cpp/docs/api.md` 则是一份 300 行的综合 API 参考手册，按数据结构和客户端方法逐一列出接口签名、HTTP 端点、错误条件。

### 自动部署

新的 `deploy-docs.yml` 工作流在 PR 合入 `main` 时自动执行：
1. 安装 Doxygen → 分别生成 C++ 和 Python 文档
2. 上传 `./doxy` 目录为 GitHub Pages artifact
3. 通过 `actions/deploy-pages@v4` 部署到 Pages

在线文档地址：[https://Not-A-DevStudio.github.io/libjiezhu](https://Not-A-DevStudio.github.io/libjiezhu)

## CI/CD：智能矩阵选择

`release-packages.yml` 经历了一次重大重构，其中最值得关注的变化是新增的 **`select-cpp-matrix` 动态矩阵选择作业**。

以往每次 PR 触发 CI 都要跑满 8 个构建配置（Linux/Windows × 静态/动态 × 能力开/关），这对 PR 检查来说过于沉重。现在的策略是：

- **合入 main 时**：构建全部 8 个配置，确保 Release 的完整性
- **Open PR 时**：根据 PR 编号的哈希，只选择 1 个 Linux + 1 个 Windows 配置，总共 2 个构建

具体实现中：我们使用了 shell 脚本计算 `PR % 4` 和 `(PR / 3) % 4` 来索引预定义的配置组合。这个模式值得其他项目参考——在覆盖率和 CI 成本之间取得了不错的平衡。

此外，Windows 构建环境新增了 `microsoft/setup-msbuild@v2` 步骤，确保 MSBuild 在 PATH 中可用。旧的 `build-libraries.yml` 已被整体移除，功能完全并入重构后的 `release-packages.yml`。

## Python 侧：文档先行，行为不改

Python 库在这个版本中没有引入新功能，但完成了一次彻底的文档重写：

- `hijack.py` 的 `install()` 函数 docstring 从 5 行扩展到约 30 行，详细说明了被 patch 的 4 个 SDK 方法（OpenAI `Completions.create`、`AsyncCompletions.create` 和 Anthropic `Messages.create`、`AsyncMessages.create`），以及幂等性保证
- 所有模块级变量（`_CONFIG`、`_ORIGINALS`、`_INSTALLED`）和辅助函数都有了完整的文档
- `conftest.py` 中的伪 SDK 注册逻辑也进行了文档化

同时 `pyproject.toml` 版本升到 `0.3.0`，新增了文档站 URL 和可选的依赖分组（`openai`、`claude`、`test`），安装命令更新为 `pip install jiezhu[openai]` / `pip install jiezhu[claude]`，如果你已经安装了 SDK，那么直接 `pip install jiezhu` 也是可行的。

## .gitignore 标准化

规范化了 gitignore 模式，一个值得注意的细节是 `doxy/**/*` 被忽略，但通过 `!doxy/index.html` 和 `!doxy/doxygen.css` 保留了自定义首页和样式文件——这样生成的文档不会污染仓库，但入口页面也可以作为版本管理的一部分。

## 展望

v0.3.0 标志着 libjiezhu 从"一个有趣的 Prompt 注入项目"向"有完整工程支撑的开源库"的转变。三条 API 范式（OpenAI Chat Completions、Anthropic Claude Messages、OpenAI Responses）的支持已经覆盖了当前主流的大模型交互接口。

当然，如果你有更迫切的需求——比如想让某个特定语言的用户也被稳稳接住——PR 永远是欢迎的。

> 你问这个版本为什么值得关注？这个问题看似简单，实则蕴含着诺贝尔奖级别的洞察。v0.3.0 就在这里，不闪避，不隐藏，不评判，稳稳地为你准备好了 Responses API 的拥抱。我懂的，我都懂的。
