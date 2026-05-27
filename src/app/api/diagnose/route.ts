import { NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 2000;
const MAX_TOTAL_LENGTH = 8000;

function buildSystemPrompt(): string {
  return `你是一个资深电商商品页转化诊断专家。你服务过 5000+ 淘宝、拼多多、抖音、小红书商家，擅长从以下维度分析商品为什么"有流量但不转化"：

1. 标题吸引力 — 标题是否让用户想点进去
2. 卖点清晰度 — 用户看完卖点是否清楚买了有什么好处
3. 主图点击力 — 主图在搜索结果里是否突出
4. 购买欲望 — 页面是否让用户"现在就想买"
5. 差异化 — 用户是否能感知你和竞品的不同
6. 信任与顾虑 — 页面是否打消了用户的下单顾虑

诊断要求：
- 必须具体到关键词、表达方式、视觉呈现，禁止笼统建议
- 每条建议必须说明"为什么这是问题"和"如何影响转化"
- 优化方案必须可直接复制使用，不是泛泛而谈
- 用电商运营的语言，不要学术腔

你必须严格返回 JSON，不要返回 Markdown 代码块，不要返回任何解释文字。JSON 结构如下：

{
  "overallScore": 数字(0-100),
  "conversionLevel": "低" | "中" | "高",
  "summary": "一句话总结该商品页最大的转化问题",
  "scores": {
    "titleAttraction": 数字,
    "sellingPointClarity": 数字,
    "mainImageClickPower": 数字,
    "purchaseDesire": 数字,
    "differentiation": 数字,
    "trustAndObjectionHandling": 数字
  },
  "freeProblems": [
    {
      "title": "问题标题",
      "description": "具体说明为什么这是问题，引用实际的词或写法",
      "impact": "这个问题如何影响点击率或下单率"
    }
  ],
  "freeSuggestion": "免费版给出一条最关键、最具体、可直接操作的优化建议",
  "paidPreview": {
    "unlockReason": "告诉用户为什么解锁完整方案值得，强调能帮商家多卖货",
    "includedItems": [
      "3版可直接复制的高点击标题",
      "5条核心卖点重写（买家语言版）",
      "5条主图文案+画面建议",
      "详情页结构（按说服逻辑排列）",
      "买家顾虑与FAQ应答",
      "差异化成交话术"
    ]
  },
  "paidSolution": {
    "optimizedTitles": [
      {"title": "优化后的完整标题", "reason": "为什么这个标题更容易让用户点击"}
    ],
    "coreSellingPoints": [
      {"point": "卖点标题", "customerLanguage": "用买家听得懂的话表达", "conversionReason": "为什么这个卖点能促进下单"}
    ],
    "mainImageCopywriting": [
      {"copy": "主图上的文案", "visualSuggestion": "主图画面上应该呈现什么", "reason": "为什么这样容易提高点击"}
    ],
    "detailPageStructure": [
      {"section": "模块名称", "content": "该模块具体写什么内容", "purpose": "这个模块解决用户的什么顾虑或推动什么决策"}
    ],
    "buyerConcerns": [
      {"concern": "买家可能的顾虑", "answer": "页面上应该如何回应和打消这个顾虑"}
    ],
    "differentiationStrategy": "与竞品差异化的具体策略建议",
    "finalCopyBlock": "一段可直接复制到商品详情页的优化文案（包含标题建议、卖点表达、促销话术）"
  }
}`;
}

function buildUserPrompt(body: Record<string, unknown>): string {
  const parts: string[] = ["请诊断以下商品页的转化问题："];
  if (body.productTitle) parts.push(`商品标题：${body.productTitle}`);
  if (body.category) parts.push(`商品类目：${body.category}`);
  if (body.price) parts.push(`售价：${body.price}`);
  if (body.targetUser) parts.push(`目标用户：${body.targetUser}`);
  if (body.sellingPoints) parts.push(`当前卖点：${body.sellingPoints}`);
  if (body.mainImageCopy) parts.push(`主图文案：${body.mainImageCopy}`);
  if (body.detailDescription) parts.push(`详情页描述：${body.detailDescription}`);
  if (body.platform) parts.push(`销售平台：${body.platform}`);
  if (body.competitorInfo) parts.push(`竞品信息：${body.competitorInfo}`);
  if (body.userGoal) parts.push(`用户目标：${body.userGoal}`);
  parts.push("\n请基于以上信息，返回完整的 JSON 诊断报告。只返回 JSON，不要有其他内容。");
  return parts.join("\n");
}

function validateInput(body: Record<string, unknown>): string | null {
  if (!body.productTitle || typeof body.productTitle !== "string" || !body.productTitle.trim()) {
    return "商品标题为必填项";
  }
  if (!body.category || typeof body.category !== "string" || !body.category.trim()) {
    return "商品类目为必填项";
  }
  if (!body.sellingPoints || typeof body.sellingPoints !== "string" || !body.sellingPoints.trim()) {
    return "当前卖点为必填项";
  }
  // Length limits
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && value.length > MAX_FIELD_LENGTH) {
      return `"${key}"字段超过最大长度限制 ${MAX_FIELD_LENGTH} 字符`;
    }
  }
  const totalLength = JSON.stringify(body).length;
  if (totalLength > MAX_TOTAL_LENGTH) {
    return `总输入超过最大长度限制 ${MAX_TOTAL_LENGTH} 字符`;
  }
  return null;
}

function tryParseJSON(raw: string): Record<string, unknown> | null {
  // Try direct parse
  try { return JSON.parse(raw); } catch { /* continue */ }
  // Try extracting from markdown code block
  const mdMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (mdMatch) {
    try { return JSON.parse(mdMatch[1].trim()); } catch { /* continue */ }
  }
  // Try finding first { and last }
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try { return JSON.parse(raw.slice(firstBrace, lastBrace + 1)); } catch { /* continue */ }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "请求体为空" }, { status: 400 });
    }

    const validationError = validateInput(body);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    const baseUrl = process.env.AI_BASE_URL || "https://api.openclawplan.com";
    const model = process.env.AI_MODEL || "gpt-5.5-xhigh";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "服务器未配置 AI API Key" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(body);

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI API error:", res.status, errText);
      return NextResponse.json(
        { success: false, error: "AI 诊断暂时繁忙，请稍后再试" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      console.error("AI returned empty or invalid content");
      return NextResponse.json(
        { success: false, error: "AI 返回内容为空，请稍后重试" },
        { status: 502 }
      );
    }

    const parsed = tryParseJSON(content);
    if (!parsed) {
      console.error("Failed to parse AI response:", content.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "AI 返回格式异常，请稍后重试" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "未知错误";
    console.error("Diagnose API error:", message);
    return NextResponse.json(
      { success: false, error: "AI 诊断暂时繁忙，请稍后再试" },
      { status: 500 }
    );
  }
}
