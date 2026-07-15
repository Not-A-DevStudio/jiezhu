---
title: "Jiezhu DevBlog #4：v0.3.1 堂堂发布"
author: "Not A DevStudio Team"
date: "2026-07-15"
tags: ["v0.3.1", "documentation"]
desc: "Jiezhu v0.3.1 再次发布啦，本次更新主要更新了python端"
---

# v0.3.1 开发日志：更加灵活的 Python 注入控制

## 概述

v0.3.1 是一次功能性迭代，核心工作是 **Python 装饰器 `@jiezhu`、上下文管理器 `enabled()`** 的设计与实现，同时将 OpenAI Responses API 纳入注入覆盖范围。C++ 侧完成了版本号同步与测试 CI 基建，为后续 QA 自动化铺平道路。

> 仓库：[libjiezhu](https://github.com/Not-A-DevStudio/libjiezhu)

---

## 一、Python：`enabled()` 上下文管理器与 `@jiezhu` 装饰器

### 设计动机

此前 jiezhu-py 采用全局安装模式——`install()` 后所有 SDK 调用都会被注入前缀。这种设计在 Demo 场景下足够简单，但在真实应用中，用户往往只想对**部分**调用生效。因此我们引入了 **selective 模式**：

- `install(selective=True)` 后，全局注入默认关闭
- 只有进入 `enabled()` 上下文块，或被 `@jiezhu` 装饰的函数，才会触发注入

### 实现要点

`enabled()` 是一个上下文管理器，内部维护一个线程级嵌套深度计数器 `jiezhu_enabled_depth`。进入时深度 +1，退出时深度 -1。SDK 包装函数在执行前检查这个深度：大于 0 则注入，否则透传。

```python
with enabled(prefix="[Custom] "):
    # 此处调用会被注入
    client.chat.completions.create(...)
# 退出上下文后恢复透传
```

`@jiezhu` 装饰器本质上是 `enabled()` 的语法糖——它在函数调用时临时进入一个 `enabled()` 上下文：

```python
@jiezhu(prefix="[MyPrefix] ")
def ask_llm():
    return client.chat.completions.create(...)
```

两个 API 均支持 `prefix` 参数覆盖全局前缀，以及 `require_confirm` 参数控制终端确认弹窗。
在对 Python 侧更新功能时，我们 Not-A-DevStduio 团队总是坚持将选择权还给开发者，确保**最小侵入**：开发这不会因为默认行为而在不愿注入的请求中被 AI 意外接住。

### OpenAI Responses API 支持

此前只 patch 了 `openai.resources.chat.completions`。v0.3.1 新增了对 `openai.resources.responses.Responses`（及其 Async 版本）的 patch，覆盖 `instructions` 和 `input` 两个字段。

### 测试套件

为了不依赖真实 API Key，测试层使用 **fake SDK 注入** 方案：

`conftest.py` 中构建了完整的 `openai` / `anthropic` 模块树注册到 `sys.modules`，每个资源类都返回一个记录调用参数的 dict 而非真正发起 HTTP 请求。`test_openai_enabled.py` 覆盖以下场景：

| 测试类 | 覆盖内容 |
|---|---|
| `TestSelectiveInstall` | selective 模式下全局 vs 上下文行为、自定义/全局前缀回退、嵌套 enabled 覆盖、退出上下文后恢复 |
| `TestEnabledConfirmation` | `require_confirm=True` 时用户确认/拒绝两种路径 |
| `TestDecorator` | `@jiezhu` 装饰器注入、无参装饰器使用全局前缀、装饰函数与普通函数并存 |
| `TestEnabledResponses` | Responses API 的 `instructions` 字段注入、`input` 列表注入 |
| `TestEnabledAnthropic` | Anthropic string 和 block 两种 system 格式的注入 |

### 版本与包配置

`jiezhu-py/pyproject.toml` 中 `version` 从 `0.3.0` 升至 `0.3.1`。

---

## 二、C++：版本同步

`jiezhu-cpp/CMakeLists.txt` 中 `project()` 版本号提升到 `0.3.1`，与 Python 包的版本号对齐，避免使用者产生版本混淆。

---

## 三、CI 工作流

新增 `.github/workflows/ci.yml`，在 push / pull request 到 main 分支时自动运行。

**C++ 测试**（`cpp-tests`）：
- 环境：Ubuntu latest，安装 cmake、g++、libcurl4-openssl-dev
- 构建：`cmake -B build -DJIEZHU_BUILD_TEST=ON && cmake --build build --parallel`
- 运行：`ctest --test-dir build --output-on-failure`

**Python 测试**（`python-tests`）：
- 环境：Ubuntu latest + Python 3.9
- 安装：`pip install -e ".[all]"`
- 运行：`pytest -v`

---

## 四、其他杂项

- `.gitignore` 新增 `test/*` 和 `Testing/*`，避免 CMake 测试产物被误提交
- `main.py` 补充了 `enabled()` 和 `@jiezhu` 的完整使用示例，作为用户上手的第一手参考

---

## 回顾与展望

v0.3.1 的粒度控制设计参考了 C++ SDK 中 `chat_completions_jiezhu()` 的 opt-in 思路，将其以 Python 语境更自然的方式（装饰器 / 上下文管理器）暴露出来。后续版本计划围绕 **Python 类型标注完善** 和 **C++ 测试覆盖率提升** 展开。
