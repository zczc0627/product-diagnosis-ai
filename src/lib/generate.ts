import type { ProductInput, DiagnosticResult } from "./types";

type CategoryTemplate = {
  angles: string[];
  typicalProblems: {
    title: string;
    description: (name: string) => string;
    severity: "critical" | "warning" | "suggestion";
    category: "title" | "selling_point" | "main_image" | "detail_page" | "differentiation";
  }[];
  titleVersions: (name: string, platform: string) => { title: string; reasoning: string; expectedCTR: string }[];
  sellingPoints: (name: string, sp: string[]) => { title: string; description: string; angle: string }[];
  mainImageConcepts: (name: string) => { version: number; concept: string; description: string; expectedImpact: string }[];
  detailStructure: (name: string) => string[];
  faqs: (name: string) => { question: string; answer: string }[];
  diffPoints: (name: string) => string[];
};

const templates: Record<string, CategoryTemplate> = {
  "食品饮料": {
    angles: ["口感场景", "复购场景", "健康卖点", "社交场景", "便携场景"],
    typicalProblems: [
      {
        title: "标题缺乏味觉锚点",
        description: (n) => `「${n}」的标题过于平淡，没有建立味觉联想。零食类商品需要用具体口感、味道激发用户想象——让用户看到标题就想尝一口。`,
        severity: "critical",
        category: "title",
      },
      {
        title: "卖点缺少消费场景",
        description: (n) => `「${n}」的卖点只是罗列参数，没有关联到用户真实消费场景（追剧、下午茶、办公室零食、送礼）。需要场景提示来触发购买冲动。`,
        severity: "critical",
        category: "selling_point",
      },
      {
        title: "主图缺少食欲感",
        description: (n) => `「${n}」的主图以包装为主，但食品类商品的主图核心是"食欲感"。建议增加拆封实拍、食材特写或食用场景图。`,
        severity: "warning",
        category: "main_image",
      },
      {
        title: "没有建立复购理由",
        description: (n) => `「${n}」的详情页没有强调复购价值。零食是高复购品类，需要在小包装、多口味、囤货装上下功夫，让用户产生"吃完再买"的预期。`,
        severity: "warning",
        category: "detail_page",
      },
      {
        title: "与同类零食差异化不足",
        description: (n) => `「${n}」在零食赛道中卖点不够突出。同类竞品都在打好吃、健康、量大，你需要找到更细分的差异化角度。`,
        severity: "suggestion",
        category: "differentiation",
      },
    ],
    titleVersions: (n, p) => [
      {
        title: `一口停不下来｜${n}追剧必备零食`,
        reasoning: "用口感锚点和具体场景激发冲动消费，让标题更有画面感",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `办公室人手一包的${n}，下午茶标配`,
        reasoning: "锚定办公室社交场景，让用户产生跟风购买的心理",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `孩子吃了还要的${n}，囤货装更划算`,
        reasoning: "用复购场景和囤货经济打动家庭用户，提升客单价",
        expectedCTR: "点击吸引力更强",
      },
    ],
    sellingPoints: (n, sp) => {
      const items = sp.length > 0 ? sp : ["口感酥脆", "独立包装", "好吃不腻"];
      return [
        { title: `${items[0]}，吃一口就停不下来`, description: `${n}精选原料，${items[0]}。独立小包装设计，一次一包刚刚好，不用担心开封后受潮`, angle: "口感体验" },
        { title: `追剧/办公/出游，随时随地来一包`, description: `${n}小包装随身带，办公室下午茶、追剧零食、户外便携，想吃就吃`, angle: "消费场景" },
        { title: `囤货装更划算，买过的人都说好吃`, description: `${n}老顾客回购率高，很多用户第一次买完直接回购囤货装。现在买囤货装更划算`, angle: "复购优势" },
        { title: `大人小孩都爱吃，家庭分享装`, description: `${n}配方温和，不添加防腐剂，孩子吃着放心。家庭装够全家吃`, angle: "家庭场景" },
        { title: `工厂直发，同样品质更优价格`, description: `${n}省去中间环节，和超市同款比价格更优，品质不打折`, angle: "价格优势" },
      ];
    },
    mainImageConcepts: (n) => [
      { version: 1, concept: "拆封实拍图", description: `撕开包装的${n}特写，露出实物本体，激发食欲。文案：「打开就香」`, expectedImpact: "食欲感更强，点击吸引力提升" },
      { version: 2, concept: "场景搭配图", description: `办公桌上放着${n}和一杯茶/咖啡，旁边电脑亮着。文案：「下午3点，来一包」`, expectedImpact: "场景代入感更强" },
      { version: 3, concept: "家庭分享图", description: `孩子手拿${n}，大人也在吃，温馨家庭场景。文案：「全家都爱吃」`, expectedImpact: "受众面更宽，适合家庭用户" },
      { version: 4, concept: "价格对比图", description: `${n}和超市同款的价格对比展示。文案：「同品质，更实惠」`, expectedImpact: "性价比感知更清晰" },
      { version: 5, concept: "囤货展示图", description: `${n}整箱/多包装摆在一起，视觉冲击。文案：「囤一次吃一个月」`, expectedImpact: "客单价提升，适合囤货用户" },
    ],
    detailStructure: (n) => [
      `第1屏：${n}拆封实拍 + 核心卖点3条（口感 + 场景 + 价格优势）`,
      `第2屏：产品参数速览（净含量/保质期/口味/包装规格，图标呈现）`,
      `第3屏：口感/味道详细描述（${n}的好吃在哪？用具体词汇描述酥脆度、甜度、口感层次）`,
      `第4屏：消费场景扩展（办公室/追剧/户外/送礼/家庭 5个场景配图）`,
      `第5屏：原料与安全（选用什么原料、有无添加剂、食品安全认证）`,
      `第6屏：价格对比（${n} vs 超市同款 vs 其他渠道，帮用户算清账）`,
      `第7屏：用户好评精选（真实评价截图，重点突出"回购""好吃""划算"）`,
      `第8屏：FAQ + 囤货装购买引导（推荐多包装、强调复购便利性）`,
    ],
    faqs: (n) => [
      { question: `${n}保质期多久？`, answer: `保质期通常 6-12 个月，发货都是近一个月内生产的批次，保证新鲜。具体保质期请以包装标注为准。` },
      { question: "会不会很甜/很腻？", answer: `${n}经过配方优化，甜度适中，不会齁嗓子。独立小包装一次一包，不用担心吃多。` },
      { question: "适合送礼吗？", answer: `${n}有礼盒装可选，包装精致，送朋友、同事、客户都合适。` },
      { question: "发什么快递？多久到？", answer: `默认合作主流快递，下单后尽快发货，大部分地区 2-4 天到货。具体时效以物流为准。` },
      { question: "不好吃能退吗？", answer: `支持 7 天无理由退换（未拆封），如有质量问题拆封也可退。` },
    ],
    diffPoints: (n) => [
      `${n}独立小包装设计，一次一包不浪费`,
      "口感经过多次配方调试，兼顾酥脆和味道",
      "工厂直发，省去中间加价环节",
      "多口味可选，满足全家不同偏好",
      "老顾客回购意愿强，品质稳定",
    ],
  },

  "美妆个护": {
    angles: ["成分功效", "使用体验", "安全性", "性价比", "口碑种草"],
    typicalProblems: [
      {
        title: "标题成分堆砌，缺少用户利益",
        description: (n) => `「${n}」的标题列了大量成分，但没有告诉用户"用了会怎样"。美妆用户关心的不是成分名，而是效果承诺。`,
        severity: "critical",
        category: "title",
      },
      {
        title: "卖点像成分说明书",
        description: (n) => `「${n}」的卖点罗列了成分和参数，但没有转化为用户能感知的利益。用户想知道的是：用完皮肤会变好吗？`,
        severity: "critical",
        category: "selling_point",
      },
      {
        title: "主图缺少使用效果对比",
        description: (n) => `「${n}」的主图仅展示产品外观。美妆类商品需要在主图上展示使用效果或质地特写，让用户产生"想试试"的冲动。`,
        severity: "warning",
        category: "main_image",
      },
      {
        title: "详情页缺少种草感",
        description: (n) => `「${n}」的详情页太像说明书了。小红书/抖音用户习惯"种草文风"，需要加入使用感受、前后对比、达人推荐等元素。`,
        severity: "warning",
        category: "detail_page",
      },
      {
        title: "没有针对敏感肌/肤质说明",
        description: (n) => `「${n}」没有明确适用肤质。美妆用户非常关心"适不适合我的肤质"，缺少这个信息会导致大量流失。`,
        severity: "suggestion",
        category: "differentiation",
      },
    ],
    titleVersions: (n, p) => [
      {
        title: `用了一次就被问链接｜${n}真的好用`,
        reasoning: "种草感标题 + 社交证明，用户看到会产生好奇和信任",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `干皮救星！${n}用完皮肤像喝饱水`,
        reasoning: "肤质锚点 + 效果承诺，精准触达目标肤质用户",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `不到百元的${n}，效果不输大牌`,
        reasoning: "价格锚点 + 效果对比，吸引追求性价比的用户",
        expectedCTR: "点击吸引力更强",
      },
    ],
    sellingPoints: (n, sp) => {
      const items = sp.length > 0 ? sp : ["温和配方", "效果明显", "性价比高"];
      return [
        { title: `${items[0]}，多种肤质适用`, description: `${n}采用温和配方，不添加酒精香精，经过皮肤安全性测试，适合多种肤质日常使用`, angle: "安全性" },
        { title: `坚持使用，肤质改善看得见`, description: `${n}添加有效成分，持续使用可看到肤质改善。产品页面可放真实用户对比图增强说服力`, angle: "效果承诺" },
        { title: `大牌平替，效果在线价格更友好`, description: `${n}核心成分对标大牌同款，但价格更亲民，适合追求性价比的用户`, angle: "性价比" },
        { title: `小红书真实好评，用户自发推荐`, description: `${n}在小红书已积累大量真实好评，很多用户用完主动推荐给朋友`, angle: "口碑种草" },
        { title: `质地清爽不粘腻，四季适用`, description: `${n}的质地经过反复调配，触感清爽不粘腻，延展性好，用量省`, angle: "使用体验" },
      ];
    },
    mainImageConcepts: (n) => [
      { version: 1, concept: "质地特写图", description: `${n}挤在手背上特写，展示质地轻薄感。文案：「一抹化水」`, expectedImpact: "质感更清晰，信任感增强" },
      { version: 2, concept: "使用场景图", description: `浴室/化妆台场景，正在使用${n}。文案：「每天早晚的护肤仪式」`, expectedImpact: "使用习惯联想更强" },
      { version: 3, concept: "成分解析图", description: `${n}核心成分可视化，用图标解释每种成分的作用。文案：「看得见的有效成分」`, expectedImpact: "成分透明度更高" },
      { version: 4, concept: "前后对比图", description: `坚持使用${n}后的肤质改善对比。文案：「坚持用的变化」`, expectedImpact: "效果直观可感知" },
      { version: 5, concept: "博主推荐图", description: `小红书/抖音博主手持${n}的使用场景。文案：「博主也在用」`, expectedImpact: "社交证明更强" },
    ],
    detailStructure: (n) => [
      `第1屏：${n}产品大图 + 核心卖点（效果 + 温和 + 性价比）`,
      `第2屏：成分可视化解析（每种成分的作用和来源，图标化呈现）`,
      `第3屏：适用肤质 + 使用方法（简单几步教会用户，降低使用门槛）`,
      `第4屏：使用效果对比（真实用户前后对比，标注使用周期）`,
      `第5屏：安全认证（检测报告/备案凭证/皮肤安全性测试）`,
      `第6屏：博主/达人推荐（真实种草内容截图）`,
      `第7屏：用户评价精选（按肤质分类展示好评）`,
      `第8屏：FAQ + 试用保障（过敏包退、7天无理由）`,
    ],
    faqs: (n) => [
      { question: `${n}适合什么肤质？`, answer: `${n}适合多种肤质，包括敏感肌。配方温和，不添加酒精、香精等刺激性成分。` },
      { question: "孕妇可以用吗？", answer: `建议孕妇使用前咨询医生。${n}成分温和，但孕期护肤需谨慎选择产品。` },
      { question: "多久能看到效果？", answer: `大多数用户反馈坚持使用一段时间后能看到改善，持续使用效果更稳定。每个人的肤质和吸收情况不同。` },
      { question: "会过敏吗？", answer: `${n}经过皮肤安全性测试，过敏概率很低。如果担心，建议先在耳后试用。` },
      { question: "支持过敏包退吗？", answer: `支持！如果使用后出现过敏反应，凭照片即可全额退款。` },
    ],
    diffPoints: (n) => [
      `${n}核心成分浓度有保障，对标大牌品质`,
      "经过皮肤安全性测试，温和不刺激",
      "质地经过反复调配，清爽不粘腻",
      "真实用户好评积累中",
      "支持过敏包退，零风险试用",
    ],
  },

  "数码3C": {
    angles: ["性能参数", "使用场景", "便携性", "性价比", "兼容性"],
    typicalProblems: [
      {
        title: "标题参数堆砌，像产品说明书",
        description: (n) => `「${n}」的标题全是规格参数。数码用户虽然看参数，但购买动机来自"解决了什么需求"而非参数本身。`,
        severity: "critical",
        category: "title",
      },
      {
        title: "卖点缺少使用场景",
        description: (n) => `「${n}」只强调了参数强，但没有告诉用户在什么场景下用到。数码产品的卖点应该是"能帮你做什么"，不是"有什么"。`,
        severity: "critical",
        category: "selling_point",
      },
      {
        title: "主图只有产品图，缺少体验感",
        description: (n) => `「${n}」的主图只是白底产品图。建议加入使用场景——耳机放耳朵上、手表戴手上——让用户想象自己使用的样子。`,
        severity: "warning",
        category: "main_image",
      },
      {
        title: "没有对比竞品突出优势",
        description: (n) => `「${n}」的详情页没有做竞品对比。数码用户习惯货比三家，你需要主动告诉他们"为什么选这个不选那个"。`,
        severity: "warning",
        category: "detail_page",
      },
      {
        title: "售后保障不明确",
        description: (n) => `「${n}」没有清晰展示售后政策。数码产品的售后是用户最关心的问题之一，缺少保障信息会影响转化。`,
        severity: "suggestion",
        category: "differentiation",
      },
    ],
    titleVersions: (n, p) => [
      {
        title: `用了就回不去｜${n}真实体验分享`,
        reasoning: "体验感标题，用真实使用感受打动用户",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `${n}——同价位配置标杆`,
        reasoning: "性价比锚点，吸引配置敏感型用户",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `终于找到好用的${n}了，体验不输大牌`,
        reasoning: "解决型标题 + 品质锚点，适合对比型用户",
        expectedCTR: "点击吸引力更强",
      },
    ],
    sellingPoints: (n, sp) => {
      const items = sp.length > 0 ? sp : ["性能强劲", "续航持久", "连接稳定"];
      return [
        { title: `${items[0]}，同价位体验出众`, description: `${n}在核心性能上对标旗舰水准，日常使用流畅不卡顿`, angle: "性能优势" },
        { title: `续航持久，告别充电焦虑`, description: `${n}的长续航让你不用频繁充电。支持快充，补电也快`, angle: "续航场景" },
        { title: `轻巧便携，长时间使用不累`, description: `${n}轻量化设计，长时间佩戴或使用也不觉得负担`, angle: "舒适体验" },
        { title: `兼容主流设备，连接稳定`, description: `${n}支持最新蓝牙标准，兼容主流设备，连接稳定不断连`, angle: "兼容便利" },
        { title: `售后无忧，不满意可退`, description: `对${n}的品质有信心。不喜欢？支持退换，让你买得放心`, angle: "购买保障" },
      ];
    },
    mainImageConcepts: (n) => [
      { version: 1, concept: "使用场景图", description: `实际使用${n}的场景，展示融入日常生活的状态。文案：「每天都在用」`, expectedImpact: "使用联想更强，点击吸引力提升" },
      { version: 2, concept: "产品细节特写图", description: `${n}的质感特写，展示工艺和材质。文案：「细节见品质」`, expectedImpact: "品质感更强" },
      { version: 3, concept: "场景化对比图", description: `${n}在同一场景下与其他产品的对比。文案：「一眼看出差距」`, expectedImpact: "差异化更清晰" },
      { version: 4, concept: "全家桶/全套图", description: `${n}搭配其他配件/设备的全家福。文案：「一步到位」`, expectedImpact: "关联购买意愿增强" },
      { version: 5, concept: "APP/功能界面图", description: `${n}配套功能或 APP 界面截图。文案：「智能又好用」`, expectedImpact: "功能价值更直观" },
    ],
    detailStructure: (n) => [
      `第1屏：${n}使用场景大图 + 一句话核心卖点`,
      `第2屏：核心参数速览（配置/续航/重量/兼容性，图标化呈现）`,
      `第3屏：使用场景扩展（通勤/运动/办公/游戏/出差 5个场景）`,
      `第4屏：竞品对比表格（${n} vs 同价位竞品，参数和体验逐项对比）`,
      `第5屏：细节工艺展示（材质/做工/按键/接口，高清特写）`,
      `第6屏：配套功能演示（如有配套软件/APP，展示功能界面）`,
      `第7屏：用户评价精选（按使用场景分类展示好评）`,
      `第8屏：FAQ + 售后保障（保修政策、退换流程、客服方式）`,
    ],
    faqs: (n) => [
      { question: `${n}保修多久？`, answer: `提供 1 年官方质保，质量问题以换代修，具体保修政策以官方说明为准。` },
      { question: "兼容苹果/安卓吗？", answer: `${n}全面兼容 iOS 和 Android，主流设备均可稳定连接。` },
      { question: "续航怎么样？", answer: `正常使用满足标称续航。重度使用一天一充，轻度使用可用多天。具体视使用习惯而定。` },
      { question: "和 X 品牌比哪个好？", answer: `${n}在核心体验上对标 X 品牌，关键差异在于续航更长、佩戴更轻、价格更友好。` },
      { question: "售后怎么处理？", answer: `有任何问题联系客服，快速响应。质量问题免费换新，人为损坏成本价维修。` },
    ],
    diffPoints: (n) => [
      `${n}同价位体验出众，核心参数有竞争力`,
      "轻量化设计，长时间使用无负担",
      "主流接口标准，兼容现有设备",
      "售后政策清晰，购买无忧",
    ],
  },

  "家居日用": {
    angles: ["空间节省", "使用便利", "材质安全", "收纳效率", "颜值设计"],
    typicalProblems: [
      {
        title: "标题没有突出使用场景",
        description: (n) => `「${n}」的标题太平淡，没有让用户联想到自己在家里使用的画面。家居用品需要激发"我家也需要"的感觉。`,
        severity: "critical",
        category: "title",
      },
      {
        title: "卖点缺少痛点解决",
        description: (n) => `「${n}」的卖点只是描述产品特点，没有对应到用户的家居痛点（空间小、东西乱、不好收纳等）。`,
        severity: "critical",
        category: "selling_point",
      },
      {
        title: "主图没有家居场景感",
        description: (n) => `「${n}」的主图只是产品图。家居用品需要展现在实际家居环境中的样子，让用户想象放在自己家的效果。`,
        severity: "warning",
        category: "main_image",
      },
      {
        title: "没有尺寸/适配说明",
        description: (n) => `「${n}」的详情页缺少清晰的尺寸标注和适配场景。家居用户最担心买回去不合适。`,
        severity: "warning",
        category: "detail_page",
      },
      {
        title: "缺少材质安全认证",
        description: (n) => `「${n}」没有强调材质安全信息。家居用品直接接触生活，用户关心是否安全环保。`,
        severity: "suggestion",
        category: "differentiation",
      },
    ],
    titleVersions: (n, p) => [
      {
        title: `小户型救星！${n}让家里瞬间整洁`,
        reasoning: "痛点前置 + 效果引导，让用户产生代入感",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `我家用了半年的${n}，真实好用`,
        reasoning: "长期使用背书，比新品推荐更有信任感",
        expectedCTR: "点击吸引力更强",
      },
      {
        title: `${n}——妈妈见了都夸我会买`,
        reasoning: "社交证明 + 情感共鸣，适合家居类种草",
        expectedCTR: "点击吸引力更强",
      },
    ],
    sellingPoints: (n, sp) => {
      const items = sp.length > 0 ? sp : ["省空间", "材质好", "颜值高"];
      return [
        { title: `${items[0]}，小空间也能高效收纳`, description: `${n}巧妙利用空间，不占地却能装很多东西，让家里井井有条`, angle: "空间效率" },
        { title: `安全材质，给孩子用也放心`, description: `${n}采用食品接触级材料，通过安全检测，不含 BPA 等有害物质`, angle: "安全健康" },
        { title: `颜值在线，放在家里像装饰品`, description: `${n}简约设计不突兀，放在家里提升空间质感`, angle: "设计美学" },
        { title: `一物多用，买一个顶几个`, description: `${n}不止一个用途，可以满足收纳、装饰、日常使用的多种需求`, angle: "多功能" },
        { title: `退换无忧，不合适包退`, description: `对${n}品质有信心，买回去不合适支持退换，运费我们承担`, angle: "购买保障" },
      ];
    },
    mainImageConcepts: (n) => [
      { version: 1, concept: "家居场景图", description: `${n}放在整洁的家居环境中的实拍图。文案：「让家变得井井有条」`, expectedImpact: "场景代入感更强" },
      { version: 2, concept: "收纳前后对比图", description: `使用${n}前后的空间对比。文案：「收纳效率翻倍」`, expectedImpact: "痛点对比更直观" },
      { version: 3, concept: "产品细节图", description: `${n}的材质、做工细节特写。文案：「细节看得见」`, expectedImpact: "品质信任增强" },
      { version: 4, concept: "多功能展示图", description: `${n}在不同场景下的多种用法。文案：「一物多用」`, expectedImpact: "价值感更强" },
      { version: 5, concept: "安全认证图", description: `${n}的检测报告和认证标志。文案：「安全到可以给孩子用」`, expectedImpact: "信任感增强" },
    ],
    detailStructure: (n) => [
      `第1屏：${n}家居场景大图 + 核心卖点（收纳/材质/设计）`,
      `第2屏：尺寸规格 + 适用场景（精确尺寸，不同空间使用效果图）`,
      `第3屏：收纳容量实测（${n}能装多少？用具体物品做对比演示）`,
      `第4屏：材质与安全认证（检测报告、材质认证）`,
      `第5屏：使用步骤（安装/使用教学，降低使用门槛）`,
      `第6屏：同类产品对比（${n} vs 普通款，材质/设计/容量对比）`,
      `第7屏：用户真实评价（按使用场景分类展示）`,
      `第8屏：FAQ + 售后保障 + 搭配推荐`,
    ],
    faqs: (n) => [
      { question: `${n}的尺寸是多少？`, answer: `详细尺寸请见详情页尺寸标注图。购买前建议先量一下家里的空间，确保适配。` },
      { question: "材质安全吗？", answer: `${n}采用食品级/环保材质，通过安全检测认证，不含有害物质。` },
      { question: "好安装吗？", answer: `${n}安装简单，无需打孔或特殊工具，一个人几分钟搞定。包装内含详细说明书。` },
      { question: "能承重多少？", answer: `${n}经过承重测试，正常使用完全没问题。具体承重数据见规格参数。` },
      { question: "支持退换吗？", answer: `支持 7 天无理由退换。如果不合适，联系客服即可办理退换，运费我们承担。` },
    ],
    diffPoints: (n) => [
      `${n}通过材质安全检测，食品接触级标准`,
      "无需打孔/工具，安装简单快捷",
      "简约设计，颜值和功能兼备",
      "退换无忧，售后有保障",
    ],
  },
};

const defaultTemplate: CategoryTemplate = {
  angles: ["使用场景", "性价比", "品质保障", "用户口碑", "差异化"],
  typicalProblems: [
    {
      title: "标题缺乏吸引力和场景感",
      description: (n) => `「${n}」的标题较为平淡，缺少能激发用户点击欲望的场景描述和利益承诺。`,
      severity: "critical",
      category: "title",
    },
    {
      title: "卖点表达不够聚焦",
      description: (n) => `「${n}」的卖点缺乏重点和层次，用户看完无法快速感知核心价值。`,
      severity: "critical",
      category: "selling_point",
    },
    {
      title: "主图缺乏视觉吸引力",
      description: (n) => `「${n}」的主图以产品展示为主，缺少使用场景和利益标签，不易在信息流中脱颖而出。`,
      severity: "warning",
      category: "main_image",
    },
    {
      title: "详情页缺少用户顾虑应对",
      description: (n) => `「${n}」的详情页没有主动解答用户购买前可能会有的疑问和顾虑。`,
      severity: "warning",
      category: "detail_page",
    },
    {
      title: "与竞品差异化不明显",
      description: (n) => `「${n}」在同类商品中卖点趋向于同质化，用户很难快速感知为什么选你不选别人。`,
      severity: "suggestion",
      category: "differentiation",
    },
  ],
  titleVersions: (n, p) => [
    {
      title: `终于找到好用的${n}了`,
      reasoning: "解决型标题，建立「终于找到」的共鸣感",
      expectedCTR: "点击吸引力更强",
    },
    {
      title: `${n}真实体验｜用了一段时间才来评价`,
      reasoning: "体验感标题，强调真实性和可信度",
      expectedCTR: "点击吸引力更强",
    },
    {
      title: `被问了很多次的${n}，用过都说好`,
      reasoning: "社交证明标题，激发用户好奇心",
      expectedCTR: "点击吸引力更强",
    },
  ],
  sellingPoints: (n, sp) => {
    const items = sp.length > 0 ? sp : ["品质好", "性价比高", "口碑推荐"];
    return [
      { title: `${items[0]}，用过就知道不一样`, description: `${n}从选材到工艺都精益求精，真正做到了${items[0]}`, angle: "品质感" },
      { title: `买过的都说好，口碑放心`, description: `${n}已获得大量用户好评，很多用户用完主动推荐给身边朋友`, angle: "口碑推荐" },
      { title: `不满意包退，零风险试用`, description: `${n}提供无忧试用服务，不满意全额退款，让你买得放心`, angle: "购买保障" },
      { title: `比同类产品更划算`, description: `${n}在同等品质下价格更优，性价比突出`, angle: "性价比" },
      { title: `多场景都能用，买一件顶多件`, description: `${n}适用多种场景，实用性强，买了不会闲置`, angle: "多功能性" },
    ];
  },
  mainImageConcepts: (n) => [
    { version: 1, concept: "场景使用图", description: `${n}在实际使用场景中的展示。文案：「每天都在用」`, expectedImpact: "场景代入感更强" },
    { version: 2, concept: "品质细节图", description: `${n}的质感和细节特写。文案：「细节见品质」`, expectedImpact: "品质信任增强" },
    { version: 3, concept: "用户好评图", description: `${n}的真实用户评价截图。文案：「用过都说好」`, expectedImpact: "社交证明更强" },
    { version: 4, concept: "对比展示图", description: `${n}与普通款的对比展示。文案：「一眼看出差距」`, expectedImpact: "差异化更清晰" },
    { version: 5, concept: "礼盒/套装图", description: `${n}的精致包装展示。文案：「送礼也合适」`, expectedImpact: "送礼场景延伸" },
  ],
  detailStructure: (n) => [
    `第1屏：${n}核心卖点 + 场景大图`,
    `第2屏：产品参数速览（规格/材质/尺寸，图标化呈现）`,
    `第3屏：使用场景扩展（展示多种使用场景，覆盖更多人群）`,
    `第4屏：品质细节（材质、工艺、质检展示）`,
    `第5屏：与竞品对比（${n} vs 竞品的差异优势）`,
    `第6屏：用户真实评价（精选好评，含图片评价）`,
    `第7屏：使用步骤/教程（降低用户使用门槛）`,
    `第8屏：FAQ 顾虑解答 + 售后保障`,
  ],
  faqs: (n) => [
    { question: `${n}适合我吗？`, answer: `如果你正在寻找高性价比的${n}，这款非常适合你。我们有试用保障，不合适可退。` },
    { question: "质量怎么样？", answer: `${n}经过严格质检，品质有保障。提供质保服务，质量问题免费换新。` },
    { question: "多久发货？", answer: `下单后尽快安排发货，合作主流快递，通常 2-4 天到手。具体时效以物流信息为准。` },
    { question: "售后怎么保障？", answer: `7 天无理由退换，质量问题包运费退换。客服在线响应。` },
    { question: "有优惠吗？", answer: `目前有限时优惠，多件更划算。具体优惠信息见商品页面。` },
  ],
  diffPoints: (n) => [
    `${n}品质经过严格把控，对标同品类高标准`,
    "无忧试用，售后保障明确",
    "性价比突出，同等品质价格更优",
    "多场景适用，实用性强",
  ],
};

function hashName(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return h;
}

function seededScore(seed: number, min: number, max: number): number {
  return min + (seed % (max - min + 1));
}

export function generateDiagnosis(input: ProductInput): DiagnosticResult {
  const template = templates[input.category] || defaultTemplate;
  const seed = hashName(input.productName);
  const spList = input.currentSellingPoints
    .split(/[,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const titleScore = seededScore(seed, 55, 82);
  const sellingScore = seededScore(seed + 1, 50, 80);
  const imageScore = seededScore(seed + 2, 58, 85);
  const desireScore = seededScore(seed + 3, 52, 80);
  const diffScore = seededScore(seed + 4, 55, 82);
  const overall = Math.round(
    (titleScore + sellingScore + imageScore + desireScore + diffScore) / 5
  );

  const score = {
    overall,
    titleAttractiveness: titleScore,
    clarityOfSellingPoints: sellingScore,
    mainImageClickability: imageScore,
    purchaseDesire: desireScore,
    differentiation: diffScore,
  };

  const issues = template.typicalProblems.map((p, i) => ({
    id: `issue-${i + 1}`,
    category: p.category,
    severity: p.severity,
    title: p.title,
    description: p.description(input.productName),
  }));

  const titleVersions = template.titleVersions(input.productName, input.platform).map((t, i) => ({
    version: i + 1,
    ...t,
  }));

  const sellingPoints = template.sellingPoints(input.productName, spList);
  const mainImageConcepts = template.mainImageConcepts(input.productName);
  const detailStructure = template.detailStructure(input.productName);
  const userFAQs = template.faqs(input.productName);
  const diffPoints = template.diffPoints(input.productName);

  return {
    id: `diag-${Date.now()}`,
    productName: input.productName,
    category: input.category,
    platform: input.platform,
    originalTitle: input.currentTitle,
    score,
    issues,
    freeOptimizations: [titleVersions[0]],
    fullResult: {
      optimizedTitles: titleVersions,
      sellingPoints,
      mainImageConcepts: mainImageConcepts,
      detailPageStructure: detailStructure,
      userFAQs,
      differentiationPoints: diffPoints,
    },
    createdAt: new Date().toISOString(),
  };
}
