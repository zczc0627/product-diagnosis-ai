import { NextResponse } from "next/server";

function toSnake(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
    result[snake] = value;
  }
  return result;
}

function toCamel(record: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camel] = value;
  }
  return result;
}

export async function POST(request: Request) {
  try {
    console.log("收到反馈提交");
    const body = await request.json().catch(() => null);
    console.log("body:", body);
    if (!body) {
      console.log("收到反馈提交 - 请求体为空");
      return NextResponse.json({ success: false, error: "请求体为空" }, { status: 400 });
    }

    const helpfulness = body.helpfulness;
    const pricingAcceptance = body.pricingAcceptance;

    if (!helpfulness) {
      return NextResponse.json({ success: false, error: "请选择方案评价" }, { status: 400 });
    }
    if (!pricingAcceptance) {
      return NextResponse.json({ success: false, error: "请选择价格接受度" }, { status: 400 });
    }

    const row = toSnake({
      productName: body.productName || "未命名商品",
      category: body.category || "",
      platform: body.platform || "",
      score: body.score ?? 0,
      helpfulness,
      pricingAcceptance,
      contact: body.contact || "",
      unlocked: body.unlocked ?? false,
      hasCompetitorInfo: body.hasCompetitorInfo ?? false,
    });

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("SUPABASE_URL exists:", !!supabaseUrl);
    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!serviceRoleKey);
    console.log("Supabase insert data:", row);

    if (!supabaseUrl || !serviceRoleKey) {
      console.log("环境变量缺失");
      return NextResponse.json(
        { success: false, error: "服务器配置错误：缺少数据库凭据" },
        { status: 500 }
      );
    }

    // 直接使用 REST API，确保 service_role key 被正确传递
    const res = await fetch(`${supabaseUrl}/rest/v1/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });

    console.log("Supabase REST API status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.log("Supabase REST API error:", res.status, errText);
      return NextResponse.json(
        { success: false, error: `数据库写入失败 (${res.status}): ${errText}` },
        { status: 500 }
      );
    }

    console.log("Supabase insert 成功");
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "未知错误";
    console.log("POST catch error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: "服务器配置错误" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/feedbacks?order=created_at.desc&limit=500`,
      {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `查询失败 (${res.status})` },
        { status: 500 }
      );
    }

    const data = await res.json();
    const feedbacks = (data || []).map((row: Record<string, unknown>) => toCamel(row));

    return NextResponse.json({ success: true, data: feedbacks });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "未知错误";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
