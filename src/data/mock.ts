import type { DiagnosticResult, HistoryItem } from "@/lib/types";

export const mockDiagnosticResult: DiagnosticResult = {
  id: "diag-001",
  productName: "便携榨汁杯",
  category: "厨房小家电",
  platform: "抖音",
  originalTitle: "便携榨汁杯家用充电款迷你果汁机学生宿舍榨汁机",
  score: {
    overall: 72,
    titleAttractiveness: 68,
    clarityOfSellingPoints: 70,
    mainImageClickability: 75,
    purchaseDesire: 73,
    differentiation: 74,
  },
  issues: [
    {
      id: "issue-1",
      category: "title",
      severity: "critical",
      title: "标题关键词堆砌，缺乏场景感",
      description:
        "标题包含太多重复关键词（榨汁杯、榨汁机），读起来像搜索词堆砌，无法激发购买欲。高转化的标题应该包含使用场景和用户利益点。",
    },
    {
      id: "issue-2",
      category: "selling_point",
      severity: "critical",
      title: "卖点表达不聚焦，缺少用户视角",
      description:
        "卖点罗列了多个参数（容量、功率、材质），但没有回答用户最关心的问题：这个产品能帮我解决什么？",
    },
    {
      id: "issue-3",
      category: "main_image",
      severity: "warning",
      title: "主图文案没有场景感",
      description:
        "主图仅展示产品外观，没有加入使用场景或利益点标签。建议在主图上叠加核心卖点，增强点击率。",
    },
    {
      id: "issue-4",
      category: "detail_page",
      severity: "suggestion",
      title: "详情页缺乏用户顾虑应对",
      description:
        "详情页没有针对用户常见顾虑（如清洗、续航、噪音）进行预判式解答，容易导致用户流失。",
    },
    {
      id: "issue-5",
      category: "differentiation",
      severity: "warning",
      title: "差异化不明显，与竞品趋同",
      description:
        "在市场搜索同类产品时，标题和卖点与 80% 以上竞品高度相似，用户无法快速感知差异。",
    },
  ],
  freeOptimizations: [
    {
      version: 1,
      title: "30秒鲜榨｜小包也能装下的便携榨汁杯",
      expectedCTR: "预计点击率提升 35%",
      reasoning: "前置使用场景和利益点，用具体数字建立信任感",
    },
  ],
  fullResult: {
    optimizedTitles: [
      {
        version: 1,
        title: "30秒鲜榨｜小包也能装下的便携榨汁杯",
        expectedCTR: "预计点击率提升 35%",
        reasoning: "前置使用场景和利益点，用具体数字建立信任感",
      },
      {
        version: 2,
        title: "不用插电的鲜榨自由！通勤/健身随手带",
        expectedCTR: "预计点击率提升 28%",
        reasoning: "强调便携性和使用场景，覆盖通勤和健身人群",
      },
      {
        version: 3,
        title: "告别奶茶！30秒自榨果汁｜学生党宿舍必备",
        expectedCTR: "预计点击率提升 42%",
        reasoning: "锚定替代需求（告别奶茶），精准触达学生群体",
      },
    ],
    sellingPoints: [
      {
        title: "30秒出汁，比叫外卖还快",
        description: "高效电机，水果切块丢进去，按下开关就能等果汁。不用提前准备，想喝随时榨",
        angle: "效率场景",
      },
      {
        title: "小包也能装，通勤健身随身带",
        description: "300g 超轻机身，放进通勤包、健身包都不占地。办公室、健身房随时来一杯",
        angle: "便携场景",
      },
      {
        title: "不用插电，真正随时随地",
        description: "内置 2000mAh 电池，充满电可榨 8-10 杯。野餐、出差、宿舍都能用",
        angle: "无线自由",
      },
      {
        title: "一冲即净，懒人友好",
        description: "刀头和杯身分离设计，水龙头下一冲就干净。不用费力刷洗，做完果汁30秒搞定清洁",
        angle: "清洁便利",
      },
      {
        title: "比奶茶便宜 80%，比果汁店新鲜 100%",
        description: "一杯奶茶 18 元，一杯自榨果汁不到 2 元。水果自己选，不加糖不加水",
        angle: "省钱健康",
      },
    ],
    mainImageConcepts: [
      {
        version: 1,
        concept: "场景对比图",
        description:
          "左边放产品+新鲜水果，右边放一杯成品果汁。文案：'30秒，从水果到果汁'",
        expectedImpact: "提升点击率 40%",
      },
      {
        version: 2,
        concept: "痛点解决图",
        description:
          "画面展示一只手从包里拿出榨汁杯。文案：'不插电，随时喝鲜榨'",
        expectedImpact: "提升点击率 35%",
      },
      {
        version: 3,
        concept: "使用场景图",
        description:
          "健身房/办公室/户外三个场景拼接，每个场景都有人在用榨汁杯。文案：'300g，去哪都带着'",
        expectedImpact: "提升点击率 38%",
      },
      {
        version: 4,
        concept: "细节特写图",
        description:
          "产品刀头、杯身材质特写，配合安全认证标识。文案：'食品级材质，给孩子喝也放心'",
        expectedImpact: "提升信任感和转化率",
      },
      {
        version: 5,
        concept: "竞品对比图",
        description:
          "对比传统榨汁机（大、需要插电、难清洗）vs 本产品（小、无线、一冲即净）。文案：'榨汁，不该这么麻烦'",
        expectedImpact: "快速建立差异化认知",
      },
    ],
    detailPageStructure: [
      "第1屏：核心卖点 + 场景大图（30秒出汁 + 使用场景照片）",
      "第2屏：产品参数速览（容量/重量/功率/材质，用图标呈现）",
      "第3屏：使用场景扩展（办公室/健身房/宿舍/野餐，各场景配图）",
      "第4屏：对比竞品优势（vs 传统榨汁机、vs 奶茶、vs 果汁店）",
      "第5屏：材质与安全认证（食品级 Tritan 材质、CE/FDA 认证）",
      "第6屏：使用步骤（4张图教会用户，降低使用门槛）",
      "第7屏：用户评价精选（3-5条真实好评，含图片评价）",
      "第8屏：FAQ 顾虑解答 + 购买保障（7天无理由、1年质保）",
    ],
    userFAQs: [
      {
        question: "榨汁杯好清洗吗？",
        answer: "刀头可拆卸，杯身大口径设计，水龙头下一冲即净，30秒搞定清洁。",
      },
      {
        question: "电池能用多久？",
        answer: "充满电能榨 8-10 杯，正常使用一周充一次。Type-C 接口，充电宝也能充。",
      },
      {
        question: "能榨冰块吗？",
        answer: "不建议榨纯冰块，但可以加冰一起榨水果，做成冰沙口感。",
      },
      {
        question: "声音大吗？",
        answer: "工作噪音约 60 分贝，相当于正常说话音量，不会吵到同事或室友。",
      },
      {
        question: "售后怎么保障？",
        answer: "7天无理由退换，1年质保。质量问题以换代修，客服在线10小时内必回。",
      },
    ],
    differentiationPoints: [
      "同价位最轻（300g），真正「随身携带」",
      "Type-C 充电，不用带专用充电线",
      "刀头可拆卸，市面上同价位唯一好清洗的设计",
      "食品级 Tritan 材质，婴用级别安全标准",
      "30天免费试用，不满意全额退款（竞品普遍没有试用政策）",
    ],
  },
  createdAt: "2026-05-21T10:30:00Z",
};

export const mockHistoryItems: HistoryItem[] = [
  {
    id: "hist-001",
    productName: "便携榨汁杯",
    platform: "抖音",
    score: 72,
    date: "2026-05-21",
    isCompleted: true,
  },
  {
    id: "hist-002",
    productName: "氨基酸洗面奶",
    platform: "小红书",
    score: 65,
    date: "2026-05-20",
    isCompleted: true,
  },
  {
    id: "hist-003",
    productName: "收纳箱三件套",
    platform: "拼多多",
    score: 78,
    date: "2026-05-19",
    isCompleted: false,
  },
  {
    id: "hist-004",
    productName: "无线蓝牙耳机",
    platform: "淘宝",
    score: 58,
    date: "2026-05-18",
    isCompleted: true,
  },
  {
    id: "hist-005",
    productName: "瑜伽垫加厚防滑",
    platform: "抖音",
    score: 81,
    date: "2026-05-17",
    isCompleted: false,
  },
];

export const caseCompareData = {
  before: {
    title: "便携榨汁杯家用充电款迷你果汁机学生宿舍榨汁机",
    mainImage: "纯白背景 + 产品图",
    sellingPoint: "大容量、强动力、食品级材质、Type-C充电",
    result: "点击率 2.1%，转化率 0.8%",
  },
  after: {
    title: "30秒鲜榨｜小包也能装下的便携榨汁杯",
    mainImage: "办公桌上使用场景 + 果汁特写",
    sellingPoint: "30秒出汁、300g随身带、一冲即净、比奶茶便宜80%",
    result: "点击率 5.3%，转化率 2.4%",
  },
};
