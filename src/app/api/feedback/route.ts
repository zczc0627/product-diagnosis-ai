import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

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

    console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log("Supabase insert data:", row);

    const { error } = await getSupabaseAdmin().from("feedbacks").insert(row);
    if (error) {
      console.log("Supabase insert error:", error);
      console.log("Supabase insert error.message:", error.message);
      console.log("Supabase insert error.details:", (error as any).details);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    const { data, error } = await getSupabaseAdmin()
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const feedbacks = (data || []).map((row) => toCamel(row));

    return NextResponse.json({ success: true, data: feedbacks });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "未知错误";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
