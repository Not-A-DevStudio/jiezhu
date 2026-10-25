---
title: "清理电脑：从清出30G可用到一天变红"
author: "Not A DevStudio Team"
date: "2026-07-22"
tags: ["storage", "disk cleanup", "engineering"]
desc: "内存涨价硬盘涨价移动硬盘涨价连SD卡都涨价！AI技术带来的（，金融圈瞎炒股直接导致的）存储涨价浪潮下，工科人如何打赢C盘最后10GB的保卫战？"
---

# 工科人的电脑清理指南：精准释放几十GB空间

## 前言

工科人的电脑永远在“磁盘空间不足”的边缘徘徊。装一个EDA工具动辄十几GB，捆绑下载工具链又是十几GB，还要安装SDK再来几个GB，磁盘里一堆项目，每个跑个仿真生成无数个几百MB的波形文件，打开IDE工具解析出的语法索引继续吃掉几个GB。醒醒，你的FPGA既有Vivado又有Quartus Ⅱ，你的嵌入式既有Keil又有VS Code甚至加上CCStudio，你的算法既有PyTorch又有TensorFlow，你的不同Python项目需要在pip、canda、uv这3个包管理器间来回切换，为了适配你电脑中的3个不同Python版本和2个不同CUDA版本你还要专门下载3*2个Pytorch的+cuda版wheel，你的课题组聊天群横跨QQ、微信和企业微信。你以为你只是装了几个软件，其实你是在给C盘开了一个“黑洞”，每天都在吞噬你的可用空间。

本文不从“清回收站”“删临时文件”这种基础操作讲起。我们直接定位几个隐藏的磁盘杀手，它们长期被忽视，却占据着惊人的空间。而且**一般的“清理C盘空间”教程很少会考虑专业软件**，每天清理QQ、微信缓存的你是否也会抱怨“C盘昨天才清理10G，今天怎么又满了？”

**关键词**：NVIDIA APP、VS Code C++ IntelliSense、企业微信、pip conda uv、MATLAB临时文件、仿真波形文件

---

## NVIDIA驱动文件缓存

如果你用的是NVIDIA显卡，这个目录下大概率堆积着你买来电脑以来，NVIDIA的全部驱动版本：

```
C:\ProgramData\NVIDIA Corporation\NVIDIA App\UpdateFramework\ota-artifacts
```

**它是什么？**

NVIDIA App（原GeForce Experience）会自动下载驱动更新包并缓存在这里。每次更新完成后，旧的安装包并不会被自动删除，而是日积月累地堆叠。一个驱动包大约800MB到1.5GB，如果你经历过三四个版本的迭代，这个目录轻松突破5GB。

**清理方法：**

1. 关闭NVIDIA App（系统托盘右键退出）
2. 直接删除 `ota-artifacts` 文件夹内的所有文件
3. 放心删——这些只是离线安装包缓存，不影响当前驱动运行。下次更新时NVIDIA会自动重新下载

**可选优化：** 如果你习惯手动更新驱动，干脆卸载NVIDIA App，改用NVCleanstall只安装纯驱动，既省空间又少一个后台进程。

---

## VS Code C++扩展缓存

工科生写嵌入式C/C++或做算法验证，VS Code几乎是标配。但很多人不知道，VS Code预装的C++扩展（IntelliSense）会在后台默默建立代码索引，这些索引文件的体积可能比你写的代码还大几倍。

缓存位置：
```
%LocalAppData%\Microsoft\vscode-cpptools
```

C++ IntelliSense 需要解析所有头文件、宏定义、模板实例化，然后建立符号数据库。如果你用过STM32 HAL库、ROS 2、OpenCV这类巨型框架，索引文件轻松超过5GB。更坑的是，切换过工作区或更新过扩展版本后，旧的索引数据往往不会被清理，层层叠加。

**清理方法：**

- 直接删除 `vscode-cpptools` 目录下的缓存子文件夹（通常是 `ipch` 文件夹）。VS Code会在下次打开项目时重建索引，不影响任何代码或配置
- 如果你用的扩展版本较新，也可以在VS Code设置中限制缓存大小。搜索 `C_Cpp.intelliSenseCacheSize`，设为合适值（默认5120MB，建议减半）

**额外提示：** 浏览一下 `%LocalAppData%\Microsoft` 目录，你可能还会发现其他扩展的残留数据（Python语言服务器、Latex Workshop等），按需清理即可。

---

## 企业微信更新缓存

国内工科课题组和实验室的沟通工具，企业微信占比极高。它的更新逻辑和Chrome类似——下载增量包、解压、替换，但旧版本文件并不会完全清理。

缓存位置：

```
C:\Users\<用户名>\AppData\Roaming\Tencent\WXWork\upgrade
```

**它有多大？**

单个企业微信安装包约200-400MB，但 `upgrade` 文件夹里可能躺着多个历史版本的全量安装包和补丁文件。长期不清理的话，2-3GB是常有的事。

**清理方法：**

1. 确保企业微信处于关闭状态（任务管理器检查 `WXWork.exe` 进程）
2. 直接删除 `upgrade` 文件夹内的所有文件
3. 重新打开企业微信，一切正常运行

**为什么安全？** 这个目录里全是更新用的临时安装包，真正的程序文件在安装目录（通常 `C:\Program Files (x86)\Tencent\WXWork`），两者互不影响。

---

## Python 缓存与虚拟环境

除非使用命令手动指定，否则 `pip install` 下载的所有包都会缓存在：
```
%LocalAppData%\pip\cache
```
这个目录可以安全删除，`pip install` 时会重新下载。

如果你的实验项目生成了多个 conda 环境，每个环境都可能占据1-5GB。用以下命令列出所有环境及其大小：

```
conda env list
```

然后 `conda remove -n <环境名> --all` 卸载不再使用的环境。

喜欢使用 uv 管理 Python 虚拟环境的同学，通过 `uv add` 下载的包也会占用磁盘空间，定期清理 `~/.uv/cache` 目录即可。

### MATLAB 临时文件

MATLAB 的 Live Script 和 Simulink 会生成大量临时编译文件，通常在：

```
%LocalAppData%\Temp
```

在 MATLAB 中运行 `tempdir` 命令可以直接定位当前会话的临时文件夹。退出 MATLAB 后，这些文件一般都可以安全删除。

### 仿真软件波形文件

Vivado、ModelSim、QuestaSim 等项目目录下，`*.wdb`、`*.vcd`、`*.fsdb` 等波形文件往往是磁盘大户。跑一次长时间仿真生成几百MB甚至几个GB的波形文件非常常见。建议定期归档或删除不需要的仿真结果，需要时重新跑即可。
