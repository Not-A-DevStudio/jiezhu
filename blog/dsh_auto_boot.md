---
title: "DSH Auto Boot：更好的 DeepSeek Harness 体验"
author: "Not A DevStudio 运维大刘"
date: "2026-08-15"
tags: ["devops", "systemd", "deepseek-harness", "deployment"]
desc: "把 DeepSeek Harness Web UI 变成开机自启的常驻服务：一个 systemd 单元 + 一个脚本，安全加固一步到位。"
---

# DSH Auto Boot：让 DeepSeek Harness 开机即就绪

哈喽大家好，我是 Not A DevStudio 的运维大刘。

自从 DeepSeek 开源 DeepSeek Harness 之后，国内外就掀起了一场轰轰烈烈的 Harness 定制热潮。然而目前 v0.1 开发者预览版的体验不算特别优秀：没有独立应用，没有 cil，**需要自己敲命令启动**。所以一个问题就很明显了：**能不能让 DeepSeek Harness 的 Web UI 像机房空调一样，开机就自己嗡嗡运转？**

答案是可以的，而且只需要两个文件。这次我们开源了 [dsh-auto-boot](https://github.com/not-a-devstudio/dsh-auto-boot) 仓库——一个通过 systemd 在开机时自动拉起 DeepSeek Harness Web UI 的极简方案。仓库很小，只有两个文件加一份说明，但背后的工程思考可一点也不少。

> 仓库：[dsh-auto-boot](https://github.com/not-a-devstudio/dsh-auto-boot)

---

## 一、它在解决什么问题？

先说说我在接触 DeepSeek Harness 开发者预览版时的真实体验：它的"极简模式"对 **Windows 支持并不友好**——在 Windows 上几乎跑不通。并且无论 Windows 还是 Linux，**每次都要手动敲命令启动**，从普通用户的角度，这是一件很反人类的事情：开机想用就得先开终端、复制粘贴、等它起来，一不小心关错窗口进程就没了。

当然，这些缺点正是“开发者预览版”这个名字的含义：它就是给开发者用的。但对于普通用户来说，想要使用，就没有选择。所以最顺手的解法，或许应该是：**把服务交给 Linux（或 WSL）来管**。WSL 用户甚至不需要一台独立服务器——在 Windows 上装个 WSL，就能以 Linux 的身份享受这套完整方案。于是就有了这个仓库。

具体来说，如果你手头有一台 Linux 机器（或 WSL），想跑一个 DeepSeek Harness Web UI，最常见的做法是：

1. SSH 进去；
2. 手动敲 `npx @deepseek-ai/dsh web`；
3. 把终端挂在那儿别关；
4. 祈祷 SSH 别断线、机器别重启。

一旦机器重启，你的 Web UI 就变成了一堆没跑起来的进程。更麻烦的是，你以为它是 `nohup` 就万事大吉，结果父进程一退出，孤儿进程没人管，日志不知道在哪，崩溃了也没有自动恢复。

DSH Auto Boot 把这些痛点一次性解决：

| 痛点 | 解决方式 |
|---|---|
| Windows 极简模式支持差 | 用 Linux / WSL 托管，规避兼容性坑 |
| 手动敲命令、终端不能关 | systemd 托管，完全后台化 |
| 重启后服务丢失 | `enable` 开机自启 |
| 进程崩溃无人管 | `Restart=on-failure` 自动拉起 |
| 安全裸奔 | 专用用户 + 系统级 hardening |

## 二、两个文件做了什么？

整个仓库的核心就两个文件，分工非常清晰：

| 文件 | 作用 |
|---|---|
| `dsh-start.sh` | 实际启动入口，由 systemd 在开机时调用 |
| `dsh-web.service` | systemd 单元文件，定义"什么时候跑、以谁的身份跑、怎么加固" |

### `dsh-start.sh`：一个脚本，两种模式

脚本支持两种运行模式：

| 模式 | 行为 |
|---|---|
| `--npx`（默认） | 启动时从 npm 拉取 `@deepseek-ai/dsh` 并运行 `web`，无需本地 checkout |
| `--web --path <dir>` | 在指定的本地 harness 目录里跑 `pnpm dsh web` |

`--web` 模式做了很严格的入场检查：路径必须是绝对路径、目录必须真实存在、必须由服务用户拥有、且不能被 group/others 写入。**没有静默的网络兜底**——不满足条件就直接报错退出，绝不偷偷回退到 `--npx` 模式。

另外一个贴心的细节就是，脚本会自动探测 nvm 环境。如果服务用户的 `$HOME/.nvm/nvm.sh` 存在，就加载它并切到默认 Node 版本，省去了在 systemd 单元里手写一堆环境变量的麻烦。Node 装在其他位置的话，用 `DSH_NVM_DIR` 环境变量指过去就行。

### `dsh-web.service`：安全不是附加项

这个单元文件是我最喜欢的部分。它没有把 `Restart=on-failure` 当成全部卖点，而是从一开始就把安全考虑进去：

```ini
NoNewPrivileges=true
ProtectSystem=strict
PrivateTmp=true
RestrictSUIDSGID=true
LockPersonality=true
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
```

用一句话概括：**用专用非 root 用户 `dsh` 跑服务，并把这些加固选项全开。** 该锁的都锁上了：不新增特权、系统分区只读、私有临时目录、禁止 SUID/SGID、限制地址族。

还有一个很诚实的取舍写在 SECURITY.md 里：`MemoryDenyWriteExecute=true` 这个加固选项**故意没开**，因为它会破坏 Node.js 的 JIT（V8 引擎）。真正的加固不是堆砌开关，而是知道每个开关的代价。

## 三、安装有多简单？

整个流程五步走，都是标准的 Linux 管理操作：

1. 创建系统用户：`sudo useradd --system --create-home --shell /bin/bash dsh`，并锁定密码
2. 安装脚本：`sudo install -m 755 dsh-start.sh /usr/local/bin/dsh-start.sh`
3. 给 `dsh` 用户装 Node（通过 nvm，两行命令）
4. 把单元文件拷到 `/etc/systemd/system/`
5. `systemctl daemon-reload` 然后 `systemctl enable --now dsh-web.service`

搞定。之后每次开机，Web UI 都会自己跑起来。

要切换模式？改一行 `ExecStart`，`daemon-reload` + `restart` 就完事。想验证？`systemctl status` 看状态，`journalctl -u dsh-web.service -f` 看实时日志。

## 四、SECURITY.md：把风险摊开讲

说实话，现在很多项目的 SECURITY.md 都是模板套话。但 dsh-auto-boot 这份是认真写的，把风险点一条条列得明明白白：

- **供应链风险**：`--npx` 模式每次启动都从 npm 拉代码，没有版本锁定也没有完整性校验。如果你依赖这种模式，请锁定版本（`@deepseek-ai/dsh@<exact-version>`），或者干脆 vendor 到本地跑。
- **权限边界**：明确警告不要改回 `User=root`；脚本对服务用户必须**可读不可写**。
- **可选加固**：如果监听 1024 以下端口需要补 capability；更推荐绑 `127.0.0.1` 然后前面放一层带鉴权的反代（Caddy / nginx）。其实dsh默认监听就是localhost，而且不使用1024以下端口，安全默认值已经很不错了。

另外文档里有个很妙的设计——**"让 AI 自己审计"**：它专门提供了一段提示词，让你把仓库丢给自己的 Agent 审计。我试过，这个动作本身就很有"AI 时代运维"的味道：工具不该让你盲目信任，而该给你验证它的手段。

## 五、这个仓库教会我的事

虽然它只有几十行代码，但我觉得它在三个层面值得参考：

1. **极简不等于敷衍**：两个文件讲清楚了"什么时候跑、怎么跑、跑坏了怎么办、安全怎么保证"。信息密度很高。
2. **安全默认值**：从创建用户的那一步开始，安全就是默认行为，不是事后补丁。
3. **诚实的文档**：把 `--npx` 的供应链风险、`MemoryDenyWriteExecute` 为什么不开，都写在明面上。这在开源项目里真的不多见。

---

如果你也在 Linux 服务器上跑 DeepSeek Harness，或者想把任何一个 Web 服务做成开机自启的 systemd 单元，去 [dsh-auto-boot](https://github.com/not-a-devstudio/dsh-auto-boot) 看看吧。就算不用它的代码，那份 SECURITY.md 和单元文件的加固选项也够抄一份作业了。
