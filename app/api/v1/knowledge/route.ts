import { NextRequest, NextResponse } from "next/server";
import { mockKnowledgeBase } from "@/lib/mock-data";

// GET /api/v1/knowledge — list knowledge base entries
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const businessId = searchParams.get("businessId") || "biz-001";
  const search = searchParams.get("search")?.toLowerCase();

  let entries = mockKnowledgeBase.filter((k) => k.businessId === businessId);

  if (category && category !== "All") {
    entries = entries.filter((k) => k.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    entries = entries.filter(
      (k) => k.question.toLowerCase().includes(search) || k.answer.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ entries, total: entries.length });
}

// POST /api/v1/knowledge — create knowledge base entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category, businessId } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const newEntry = {
      id: `kb-${Date.now()}`,
      businessId: businessId || "biz-001",
      question,
      answer,
      category: category || "General",
      usageCount: 0,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ entry: newEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
