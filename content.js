/* Personal projects and original media, independent from the presentation layer. */
window.PORTFOLIO_DATA = {
  projects: [
    {
      id: 'project-sxq',
      number: '01',
      title: 'SXQ · 高性能 RISC-V 处理器',
      english: 'SXQ RISC-V CPU',
      category: 'hardware',
      period: '大一下 · 第十届全国大学生集成电路创新创业大赛',
      role: '队长',
      repo: 'https://github.com/xiaomi0530/SXQ-RV32IM-CPU',
      summary: '面向七星微赛道，设计并实现 100 MHz 的 RV32IM 单发射准六级流水线 CPU。以约 3600 个 LUT 实现 2.76 CoreMark/MHz，动态功耗 0.231 W。',
      paragraphs: [
        '参加第十届全国大学生集成电路创新创业大赛七星微赛道，设计并实现支持 RISC-V RV32IM 指令集、工作在 100 MHz 的 FPGA 单发射准六级流水线 CPU，最终在 Artix-7 FPGA 上完成上板验证与跑分。',
        '最终达到 2.76 CoreMark/MHz，LUT 资源消耗约 3600 个，动态功耗 0.231 W；同时完成各类时序优化，保证功能复杂化后的时序收敛。',
        '作为队长，指导两名零基础队员掌握 FPGA 与 CPU 设计基础，编写并实现基础 CPU 架构，与团队合作提出并实现 5 种创新优化方法。充分利用 FPGA 片上资源特性，使性能提升近 40%。',
        '核心设计包含分支预测机制、晚转发优化与动态深度流水线，相关架构和优化示意见下方图集。'
      ],
      tags: ['RISC-V RV32IM', 'Verilog', 'Artix-7', '流水线设计', '时序优化'],
      metrics: [
        { value: '2.76', label: 'CoreMark / MHz' },
        { value: '100 MHz', label: '核心频率' },
        { value: '0.231 W', label: '动态功耗' },
        { value: '≈ 3600', label: 'LUT 资源' }
      ],
      cover: 'fig/SXQ-CPU/SXQCPU_Architecture.png',
      media: [
        { type: 'image', src: 'fig/SXQ-CPU/SXQCPU_Architecture.png', alt: 'SXQ-CPU 总体架构图' },
        { type: 'image', src: 'fig/SXQ-CPU/branch_prediction_summary.png', alt: '分支预测机制' },
        { type: 'image', src: 'fig/SXQ-CPU/late_bypass_contrast.png', alt: '晚转发优化对比' },
        { type: 'image', src: 'fig/SXQ-CPU/动态深度流水线示意.drawio.png', alt: '动态深度流水线示意' }
      ]
    },
    {
      id: 'project-rv32i',
      number: '02',
      title: '从零构建 CPU 与 RTOS',
      english: 'FROM CPU TO SYSTEM',
      category: 'hardware',
      period: '大一上',
      role: '独立设计与开发',
      repo: 'https://github.com/xiaomi0530/M-RV32I-CPU',
      summary: '在 Xilinx Artix-7 上从零实现 RV32I 处理器、SoC 与轻量级 RTOS。让亲手设计的 CPU 运行终端、窗口、游戏，以及 SD 卡中的应用和影音文件。',
      paragraphs: [
        '自学 CPU 架构与 Verilog 等必要知识，基于 Xilinx Artix-7 FPGA 搭建 RV32I 处理器与系统平台。围绕指令流水、数据通路、CSR / 中断控制、总线互联和外设访问，完成从 CPU 到 SoC 的完整实现。',
        '工程使用 100 MHz 板载时钟，经时钟管理生成 50 MHz 核心时钟与 25 MHz VGA 时钟。整合 UART、VGA、microSD SPI、PS/2 鼠标、PWM 音频、定时器、RAM / ROM 等模块。',
        '配套实现轻量级 RTOS，支持终端、窗口切换、贪吃蛇等交互应用；支持 SD 卡文件管理，并可从 SD 卡加载运行 .bin 应用、音频与视频文件，使 CPU 具备完整的嵌入式系统交互能力。',
        '下方演示依次记录系统开机、SD 卡文件管理，以及从 SD 卡加载运行 starwar 小游戏的过程。'
      ],
      tags: ['RV32I', 'FPGA', 'SoC', 'RTOS', 'VGA', 'SD / SPI'],
      metrics: [
        { value: '50 MHz', label: '核心时钟' },
        { value: '25 MHz', label: 'VGA 时钟' },
        { value: 'RTOS', label: '配套操作系统' }
      ],
      cover: null,
      media: [
        { type: 'video', src: 'fig/M-CPU/Boot_small.mp4', alt: 'RV32I CPU 与 RTOS 开机演示' },
        { type: 'video', src: 'fig/M-CPU/Boot.mp4', alt: 'RV32I CPU 完整开机流程' },
        { type: 'video', src: 'fig/M-CPU/SD_File_system.mp4', alt: '基于 SD 卡的文件管理系统演示' },
        { type: 'video', src: 'fig/M-CPU/Run_Gamebin.mp4', alt: '从 SD 卡加载运行 .bin 应用：starwar 小游戏' }
      ]
    },
    {
      id: 'project-myopia',
      number: '03',
      title: '用深度学习预测高度近视',
      english: 'DEEP LEARNING FOR VISION',
      category: 'research',
      period: '大一上 · IOVS / ARVO 2026',
      role: '主要负责人',
      repo: null,
      summary: '接手高度近视智能预测科研课题，重构评估流程并改进融合模型架构。模型性能较初始版本提升 50% 以上，参与专利及 ARVO 会议摘要撰写。',
      paragraphs: [
        '接手组内博士生的未完成项目，快速掌握深度学习理论、PyTorch 及相关 Python 库，与团队成员协作完成模型优化。',
        '重构训练、验证与测试流程，修正原评估方法缺陷，建立标准化评估规范，提升研究结果的科学性。',
        '创新改进并融合模型架构，使模型性能较初始版本提升 50% 以上。',
        '参与专利撰写与 ARVO 会议摘要撰写。文献信息：IOVS, June 2026, Vol. 67, Issue 7, 4636。摘要题目为 “Accurate Prediction of Preoperative Refractive Error for High Myopia Using Deep Neural Networks to Optimize Implantable Collamer Lens Selection”。'
      ],
      tags: ['Deep Learning', 'PyTorch', '医学预测', '模型融合', 'ARVO 2026'],
      metrics: [
        { value: '50%+', label: '模型性能提升' },
        { value: 'IOVS', label: '2026 会议摘要' }
      ],
      cover: 'fig/IOVS/Accurate%20Prediction%20of%20Preoperative%20Refractive%20Error%20for%20High%20Myopia%20Using%20Deep%20Neural%20Networks%20to%20Optimize%20Implantable%20Collamer%20Lens%20Selection%20%20%20IOVS%20%20%20ARVO%20Journals.png',
      media: [
        { type: 'image', src: 'fig/IOVS/Accurate%20Prediction%20of%20Preoperative%20Refractive%20Error%20for%20High%20Myopia%20Using%20Deep%20Neural%20Networks%20to%20Optimize%20Implantable%20Collamer%20Lens%20Selection%20%20%20IOVS%20%20%20ARVO%20Journals.png', alt: 'IOVS / ARVO 高度近视预测文献摘要' }
      ]
    },
    {
      id: 'project-breadboard',
      number: '04',
      title: '把 CPU 连在面包板上',
      english: 'A PROCESSOR, BY HAND',
      category: 'hardware',
      period: '大一上',
      role: '独立设计与搭建',
      repo: null,
      summary: '用分立逻辑器件与手工连线，在面包板上搭建单周期单发射 CPU。让抽象的处理器组成原理，成为能调试、能运行的硬件实体。',
      paragraphs: [
        '独立搭建基于分立逻辑器件与面包板的单周期单发射 CPU，手工连线实现取指、译码、运算、访存、写回等核心数据通路。',
        '结合指示灯、拨码开关及外部控制模块完成运行状态观测与功能验证，将抽象处理器组成原理转化为可调试、可演示的硬件实体。',
        '为 CPU 自编简单指令集，录入汇编代码，使处理器完成计数功能；视频记录了该程序的实际运行。'
      ],
      tags: ['数字逻辑', '分立器件', '数据通路', '手工连线'],
      metrics: [
        { value: '1', label: '单周期 · 单发射' },
        { value: '5', label: '核心数据通路阶段' }
      ],
      cover: 'fig/BBCPU/BBCPU_all.jpg',
      media: [
        { type: 'video', src: 'fig/BBCPU/BBCPU_show_landscape_fixed.mp4', poster: 'fig/BBCPU/BBCPU_show_poster.jpg', alt: '录入自编指令集的汇编代码，让面包板 CPU 完成计数' },
        { type: 'video', src: 'fig/BBCPU/BBCPU_show.mp4', poster: 'fig/BBCPU/BBCPU_show_poster.jpg', alt: '面包板 CPU 运行实拍' },
        { type: 'image', src: 'fig/BBCPU/BBCPU_all.jpg', alt: '面包板单周期单发射 CPU 整体连线' },
        { type: 'image', src: 'fig/BBCPU/BBCPU_evl.jpg', alt: '面包板 CPU 验证与调试记录' }
      ]
    },
    {
      id: 'project-touch',
      number: '05',
      title: 'Touch · 把相遇留下来',
      english: 'MAKE EVERY MEETING COUNT',
      category: 'software',
      period: '大一下',
      role: '独立开发',
      repo: 'https://github.com/xiaomi0530/Touch-App',
      summary: '借助 Codex 开发面向真实线下社交的 Android 应用，以 NFC 碰一碰记录相遇。把好友、名片、日历回顾与互动徽章，整理成可持续回看的个人关系档案。',
      paragraphs: [
        '灵感驱动，使用 Codex 快速开发 Touch 应用。Touch 面向线下真实社交记录，以 NFC 见面记录、好友管理、个人名片展示、日历回顾、互动徽章和图文打包分享组织功能。',
        '围绕“见过谁、何时见过、留下了什么”，把相遇整理成可持续回看的个人关系档案，减少手动记录成本并保持流程清晰稳定。',
        'Android 客户端使用 Kotlin 与 Jetpack Compose 构建，围绕主界面、好友、成就、传图和我的等模块组织功能；NFC Reader / HCE 负责近距离碰一碰的交互。',
        '配套本地开发后端提供注册登录、账号信息、头像上传、见面记录和设备注册等接口，使用 SQLite 与令牌机制处理基础数据管理。'
      ],
      tags: ['Android', 'Kotlin', 'Jetpack Compose', 'NFC / HCE', 'Codex', 'SQLite'],
      metrics: [
        { value: 'NFC', label: '碰一碰记录相遇' },
        { value: 'Android', label: '原生应用' }
      ],
      cover: 'fig/Touch/Touch_1.jpg',
      media: [
        { type: 'image', src: 'fig/Touch/Touch_1.jpg', alt: 'Touch 主界面' },
        { type: 'image', src: 'fig/Touch/Touch_2.jpg', alt: 'Touch 相遇记录界面' },
        { type: 'image', src: 'fig/Touch/Touch_3.jpg', alt: 'Touch 成就与徽章界面' },
        { type: 'image', src: 'fig/Touch/Touch_4.jpg', alt: 'Touch 我的页面' }
      ]
    },
    {
      id: 'project-synopsys',
      number: '06',
      title: '从 RTL 到 GDSII',
      english: 'THE COMPLETE IC FLOW',
      category: 'hardware',
      period: '大一下 · 2026 Synopsys 全流程 IC 设计暑期学校',
      role: '单日之星 · 优秀学员',
      repo: null,
      summary: '在 Synopsys 工程师指导下，完成数字与模拟 IC 设计全流程实践。通过 DRC / LVS、实现时序收敛且功耗达标，获评单日之星与优秀学员。',
      paragraphs: [
        '参加 2026 Synopsys 全流程 IC 设计暑期学校，在 Synopsys 工程师指导下，完成数字芯片从 RTL 到 GDSII 的全流程实践，积累前后端全链路协同与迭代优化的工程经验。',
        '数字部分使用 VCS、Verdi、SpyGlass、Fusion Compiler、Formality、PrimeTime、StarRC、IC Validator、TestMAX、PrimePower / RedHawk 等工具，覆盖前仿真、逻辑综合、物理实现、形式验证、时序签核、物理验证、可测性设计，以及功耗与 IR-EM 分析。',
        '模拟部分使用 Custom Compiler 完成原理图与版图设计，StarRC 提取寄生参数，ICV 进行物理验证，TotemSC 与 ParagonX 完成可靠性 / IR 分析及后仿真。',
        '最终通过 DRC / LVS 并达成时序收敛，功耗满足指标，获评单日之星与暑期培训优秀学员。'
      ],
      tags: ['RTL → GDSII', 'Synopsys', '数字 / 模拟 IC', 'DRC / LVS', '时序签核'],
      metrics: [
        { value: 'RTL → GDSII', label: '全流程实践' },
        { value: 'DRC / LVS', label: '验证通过' },
        { value: '优秀学员', label: 'Synopsys 夏校' }
      ],
      cover: 'fig/Syn/2.jpg',
      media: [
        { type: 'image', src: 'fig/Syn/1.jpg', alt: 'Synopsys 全流程实践记录 1' },
        { type: 'image', src: 'fig/Syn/2.jpg', alt: 'Synopsys 夏校实践记录 2' },
        { type: 'image', src: 'fig/Syn/1_rotated.jpg', alt: 'Synopsys 夏校实践记录 1' },
        { type: 'image', src: 'fig/Syn/3.jpg', alt: 'Synopsys 夏校实践记录 3' },
        { type: 'image', src: 'fig/Syn/4.jpg', alt: 'Synopsys 夏校实践记录 4' }
      ]
    }
  ],
  food: {
    meal: [
      'fig/Food/meal/178e150894c336690cd83cf07c5f8a89.jpg',
      'fig/Food/meal/49239dfbe48e58cc7d65b3b06cbbd865.jpg',
      'fig/Food/meal/63b3ef6a2c46d41eb65f6e17eee182e4.jpg',
      'fig/Food/meal/7c3a095a0d15f559288a48b8bc925af4.jpg',
      'fig/Food/meal/809d334226c70d45c619eaae811a9511.jpg',
      'fig/Food/meal/a83d05e493c8e182d7ed87073107b7bc.jpg',
      'fig/Food/meal/b302dd0d5f838ec5bfdf907be7c3ae9b.jpg',
      'fig/Food/meal/b6508cba9e34d959777cbab49ef5fdcd.jpg',
      'fig/Food/meal/b664c30a0089998415b6bd2b1281d6db.jpg',
      'fig/Food/meal/b83b1ff4ced2372d8de509caacbaa291.jpg',
      'fig/Food/meal/c27fee07451e09dc321064f8b07015c9.jpg',
      'fig/Food/meal/cac1c57785e64d1f280854de723c0e57.jpg',
      'fig/Food/meal/e10fa904ca0503e613002e7e560f139e.jpg',
      'fig/Food/meal/e68976cbd5f1ffbb11e81fd35c2551fa.jpg',
      'fig/Food/meal/eb03b31c671d674b4ae3df8f22f0ece4.jpg'
    ],
    dessert: [
      'fig/Food/dessert/2453cb061db357daa12f91cadc4ca214.jpg',
      'fig/Food/dessert/44cb73385a6af43831c1d58bd330ae55.jpg',
      'fig/Food/dessert/5bb1d34ad8f9b01d97e2de3b8662eccc.jpg',
      'fig/Food/dessert/63081f5bb9321de4a18e246f041ac564.jpg',
      'fig/Food/dessert/ae1532666911dd5daadb71edc3ffe1fb.jpg',
      'fig/Food/dessert/bc224c0ae1da87fe49c592e728d49c53.jpg',
      'fig/Food/dessert/ef1e2841534d2e5148960dbf10f1de6b.jpg'
    ]
  }
};
