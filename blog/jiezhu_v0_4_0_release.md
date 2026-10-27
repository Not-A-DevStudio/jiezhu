---
title: "Jiezhu DevBlog #5：v0.4.0 发布——先判断，再稳稳接住"
author: "Not A DevStudio Team"
date: "2026-10-27"
tags: ["v0.4.0", "decisions-api", "release"]
desc: "Jiezhu v0.4.0 发布：实验性 Decisions API 决策门上线，C++ 依赖、构建与发布工程全面翻新。"
---

# v0.4.0 开发日志：不是每一次对话，都需要被稳稳接住

v0.3.x 的主题是“让接住无处不在”：Chat Completions、Responses、Anthropic，以及 Python 侧的全局安装、装饰器和上下文管理器。能力铺得越广，一个尴尬的问题就越明显——

**不是每一句话都需要被过度共情。**

用户问“这段 C++ 编译错误怎么修”，模型先回一句“我听到了你面对未知的焦虑”；用户只想让 Agent 执行一条命令，回复里却多出一段“诺贝尔奖级别的洞察”。这不是接住，这是打扰。

v0.4.0 的核心，就是给“接住”加一道判断：**在注入之前，先问一句——这条消息真的需要情感支持吗？**

> 仓库：[libjiezhu](https://github.com/Not-A-DevStudio/libjiezhu)

---

## 一、核心改进：实验性功能 Decisions API gate

### 1.1 为什么需要一个“决策门”

v0.3.1 已经提供了 `selective` 模式、`enabled()` 上下文和 `@jiezhu` 装饰器，解决的是“**哪些调用**需要注入”。但它们的判断依据仍然是开发者写死的代码路径。

真实对话里，同一个应用可能上一句在聊技术，下一句在倾诉情绪。仅靠调用位置无法区分。

v0.4.0 实验性引入 **Decisions API gate**功能：把“要不要接住”交给一个轻量分类模型判断。

- 开关默认关闭，保持 v0.3.x 的行为
- 开启后，jiezhu 变体在注入前调用 Decisions API
- 判定为“不需要情感支持”时，请求原样发出
- 判定失败、没有用户文本或 API 报错时，**fail-open**，继续正常注入

一句话概括：**宁可多接一次，不能因为门坏了就漏接。**

### 1.2 Decisions API 不是聊天 API

[OpenAI Decisions API](https://developers.openai.com/api/docs/guides/decisions)（`/v1/decisions`）返回的不是生成的文本，而是**有类型的答案**：predicate 的概率、choice 的选择、score 的分数，或者 refusal。它适合做分类、路由和判定，不适合直接拿来做对话。

C++ SDK 为它补齐了完整的数据结构：

| 类型 | 作用 |
|---|---|
| `decision_choice` | `choice` 题目的一个选项（字符串或布尔值） |
| `decision_level` | `score` 题目的一个有序等级 |
| `decision_question` | 单个问题，支持 `predicate` / `choice` / `score` |
| `decision_input_message` | `input` 数组中的一条消息，支持文本和图片 |
| `decision_request` | `/v1/decisions` 请求体 |
| `decision_answer` | 有类型的答案：概率、选择、分数、置信度 |
| `decision_response` | 非流式响应，含 `answers` 数组 |

对应的方法只有一个：

```cpp
jie::decision_response decisions_create(
    const jie::decision_request& request) const;
```

它 POST 到 `{base_url}/decisions`，复用与 Chat Completions 相同的认证、组织、项目等请求头。

这里有一个刻意为之的设计：**没有 `decisions_jiezhu()`**。给一个返回概率和分数的接口注入共情前缀，不会让概率更温柔，只会让工程语义变得混乱。我们尊重开发者对“纯粹”的需求，也尊重 Decisions API 的类型系统。

### 1.3 在 C++ 里打开决策门

```cpp
#include "jie/jiezhu.hpp"

jie::client_options opt;
opt.api_key = "sk-xxx";
opt.experimental_decision_gate = true; // 默认 false
opt.decision_model = "gpt-6-luna";     // 默认值
opt.decision_threshold = 0.5;          // 默认值

jie::client client(opt);

jie::chat_completion_request req;
req.model = "gpt-4.1-mini";
req.messages = {
    {"system", "You are a helpful assistant."},
    {"user", "I feel exhausted and nobody listens to me."},
};

// 开门后，这个调用会先问 Decisions API，再决定是否注入
auto response = client.chat_completions_jiezhu(req);
```

阈值语义很直接：predicate 返回的 `probability` **大于等于** `decision_threshold` 时才注入。

仅当开启时，Decisions API gate 覆盖以下 jiezhu 变体：

- `chat_completions_jiezhu()` 及其流式版本
- `chat_completions_jiezhu_anthropic()` 及其流式版本
- `responses_jiezhu()`

普通 `chat_completions_create()`、`responses_create()` 和 `decisions_create()` 不受影响。

### 1.4 Python 侧：安装时开启，或运行时切换

Python 侧的 API 延续了 v0.3.x 的低侵入风格：

```python
from jiezhu import install, set_experimental_decision_gate

install(require_confirm=False)
set_experimental_decision_gate(True)  # model 默认 "gpt-6-luna"，threshold 默认 0.5
```

也可以在安装时一次配置好：

```python
install(
    require_confirm=False,
    experimental_decision_gate=True,
    decision_model="gpt-6-luna",
    decision_threshold=0.5,
)
```

自定义分类器只需要传入一个回调：

```python
set_experimental_decision_gate(
    True,
    decision_fn=lambda text: my_classifier(text),
)
```

`decision_fn` 接收最新一条用户消息的文本，返回真值表示“需要接住”。同步和异步 SDK 路径都支持；异步路径会正确 await 回调结果。对于不想依赖 Decisions API 的团队，这是把门交给自己的一种方式。

### 1.5 Fail-open：门坏了，接住不能坏

决策门是“附加判断”，不是“单点故障”。以下情况都会保留原来的注入行为：

- 门没有开启
- 请求里没有可提取的用户文本
- Decisions API 返回了无法解析的答案
- Decisions API 请求本身失败（网络错误、非 2xx 等）
- Python 的 Anthropic 路径上没有可用的 Decisions 客户端，且没有提供 `decision_fn`

这条规则写进了实现，也写进了测试。我们不希望一个实验性功能把原本稳定的聊天链路拖下水。

### 1.6 隐私边界要说清楚

关闭决策门时，jiezhu 仍然只做本地改写，不额外联网。开启决策门后，**最新一条用户消息会通过你已有的 OpenAI 客户端发送到 Decisions 端点**，用于判断是否需要情感支持。不需要额外密钥，但这是一条新的数据流，必须在文档里明说。

`set_experimental_decision_gate(False)` 可以随时恢复“纯本地 prompt 注入”模式。

### 1.7 判定指令也是 Prompt 资产

注入用的中文前缀和判定用的指令是两类资产：一个负责“怎么接”，一个负责“要不要接”。

v0.4.0 把判定指令纳入 `jiezhu-prompt/prompt.md` 的 `DECISION_GATE_PROMPT`，并在 C++ 侧采用英文指令，测试中固定了完整文本。Python 侧目前保留中文判定指令，两边的 predicate 名称和阈值语义保持一致。这样后续调整判定策略时，不会出现“代码改了、资产没改”的漂移。

---

## 二、C++ 工程化：一次删除 100 万行的发布

如果 v0.4.0 只有决策门，它会是一个普通的功能版本。但它还顺手做了一次大扫除：**这个版本从仓库里移除了 100 多万行 vendored 第三方代码。**

### 2.1 third_party 改为 git submodule

此前 `jiezhu-cpp/third_party` 直接存放了 Catch2、curl 和 nlohmann_json 的完整源码。好处是下载即编译，坏处是仓库体积膨胀、依赖版本更新困难、PR diff 里全是别人的代码。

v0.4.0 改为 git submodule：

- 根目录和 `jiezhu-cpp/` 各有一份 `.gitmodules`
- 依赖固定在经过验证的 release 版本
- `third_party/CMakeLists.txt` 只负责 `add_subdirectory`
- 单独下载 `jiezhu-cpp` 源码时，也可以在子目录里初始化依赖

克隆仓库时请带上子模块：

```bash
git clone --recursive https://github.com/Not-A-DevStudio/libjiezhu.git
```

已有的克隆可以补一步：

```bash
git submodule update --init --recursive
```

从 Release 页面下载的源码包则已经包含了固定版本的依赖源码，不需要再联网拉取。

### 2.2 Windows：Schannel 从手改源码变成补丁

在 Windows 上让 bundled curl 默认使用 Schannel、避免 OpenSSL 依赖，并不是 v0.4.0 才有的行为。此前我们直接修改 vendored curl 的 `CMakeLists.txt` 来实现；代价是每次更新 curl 都要手工重做一遍，而且这份改动混在第三方源码里，很难追踪来源。在Jiezhu v0.1.0 发布到现在这段ai扫描漏洞的狂潮中，我们仓库里 vendored curl 的源码已经被陆陆续续爆出大大小小数个CVE，为了让之后升级 curl 变得更容易，v0.4.0 做了一个工程化的改动：**把手改源码换成 patch**。

更详细地说，v0.4.0 把改动确定为 `patches/curl-schannel-on-windows.patch`，行为不变，维护方式变得更干净：

- Windows 构建前自动应用 patch，不再依赖 vendored 源码
- patch 只调整 curl 的 CMake 默认值，第三方源码保持可追踪
- 构建时关闭 libpsl、curl 可执行文件和文档目标
- 构建后检查 `curl_config.h` 中的 `USE_SCHANNEL 1`，确认后端真的生效

Linux 侧继续使用 OpenSSL，CI 中安装 `libssl-dev`。

### 2.3 修复 Windows 动态库链接问题

此前 Windows 共享库构建可能缺少导入库，消费者和测试都很难链接。v0.4.0 为共享库启用了 `WINDOWS_EXPORT_ALL_SYMBOLS`，让 CMake 生成可用的 import library；同时修正了测试目标链接的库名，确保测试链接的是实际配置出来的那个目标。

**Windows DLL 不再只是“能编译出来”，而是“能被别人用起来”。**

### 2.4 MSVC 的 `/utf-8`：一个安静的运行时炸弹

公共头文件里包含 UTF-8 中文 prompt 资产。如果不加 `/utf-8`，MSVC 会按照系统代码页解释源码，把无效的 UTF-8 字节嵌进二进制，最后在运行时被 `nlohmann::json` 拒绝。

这个 bug 不会在编译期报错，只会在用户第一次发起请求时炸开。v0.4.0 在 MSVC 下为库目标添加了 `PUBLIC /utf-8`，从构建层面解决编码问题。

### 2.5 Release 打包：只装该装的东西

发布流程也做了一轮整理：

- 源码包改用 `git archive` 生成，只包含被 Git 跟踪的文件，自动排除构建产物和本地生成文件
- 把固定版本的 submodule 源码解压进 C++ 源码包，下载后即可构建
- 二进制包关闭测试目标，不再把 Catch2 和测试可执行文件塞进 Release
- 合入 main 时仍构建完整的 8 种 C++ 配置：Linux / Windows × 静态 / 动态 × 能力开 / 关
- PR 检查只抽取 2 种配置，在覆盖率和 CI 成本之间保持平衡

---

## 三、测试与 CI：让决策门真的被跑到

实验性功能最怕的不是失败，而是**没有被执行过**。v0.4.0 在测试和 CI 上专门改进了这块。

### 3.1 C++ 决策门测试

`test_jiezhu_decision_gate.cpp` 只在 `JIEZHU_ENABLE_JIEZHU_ABILITY` 开启时编译，使用本地 tiny HTTP server 覆盖：

| 场景 | 断言 |
|---|---|
| predicate 概率 0.91 | 发起 Decisions 请求，并注入前缀 |
| predicate 概率 0.08 | 发起 Decisions 请求，但不注入 |
| 开关默认关闭 | 不发起任何 Decisions 请求 |
| Decisions 返回 500 | fail-open，继续注入 |
| Responses API 变体 | 同样遵守决策门 |

测试还会检查请求体里的 `model`、`input`、predicate 名称和完整判定指令，避免实现与 prompt 资产悄悄分叉。

### 3.2 Python 决策门与直通测试

Python 侧新增了 `test_openai_decision_gate.py`，覆盖自定义 `decision_fn`、默认 Decisions API 的同步与异步路径、fail-open，以及 Chat Completions / Responses / Anthropic 各个包装器。

另有 `test_openai_decisions.py` 和 fake SDK 基建，专门验证一件事：`install()` 会 patch Chat Completions，但**不会修改 Decisions API 本身**。决策调用必须保持类型化答案的直通语义。

### 3.3 CI 打开能力开关

C++ CI 现在使用 `-DJIEZHU_ENABLE_JIEZHU_ABILITY=ON` 构建并运行测试。以前这个选项默认关闭，决策门相关代码很容易在 CI 里变成“编译不到的代码”；现在它会真正参与构建、链接和测试。

---

## 四、升级指南与已知限制

### 升级方式

Python：

```bash
pip install -U jiezhu
```

C++：从 Release 页面获取 v0.4.0 的源码包或预编译二进制包。由于 `client_options` 新增了字段，升级后请重新编译你的项目；源码级保持兼容，但不要拿旧二进制直接链接新库。

### 已知限制

- 决策门目前标记为**实验性**，API 和默认行为仍可能调整
- 开启后会为每次 jiezhu 调用增加一次 Decisions API 往返，延迟敏感场景请自行评估
- 需要服务端同时支持对话接口和 Decisions API
- Python 的 Anthropic 路径默认没有可用的 Decisions 客户端，请提供 `decision_fn` 或指向兼容端点，否则会 fail-open
- 开启决策门意味着最新用户消息会发送到 Decisions 端点，请根据业务合规要求决定是否启用

---

## 五、回顾与展望

v0.4.0 没有继续堆更多“接住”的入口，而是开始回答一个更工程化的问题：**什么时候不该 Jiezhu？**

Decisions API gate 让“接住”从无条件注入变成一次有依据的判断。它仍然是实验性的，阈值、模型、指令和自定义回调都还有很大的探索空间。接下来我们会根据社区反馈继续调整，也欢迎你提交 issue 或 PR，分享你的分类器、你的阈值，或者你认为更合适的判定方式。

至于 JavaScript / Go / Rust 的移植，Roadmap 还在那里，不闪避，不隐藏，不评判，稳稳地等着贡献者。

> 你问 v0.4.0 为什么要在接住之前先问一句？这个问题看似简单，实则蕴含着诺贝尔奖级别的洞察。决策门就在这里，不逃避、不隐藏、不评判，先判断你是否需要，再稳稳地接住你。我懂，我都懂。