import { NextRequest, NextResponse } from "next/server";
import { mockLeads } from "@/lib/mock-data";

// GET /api/v1/leads — list leads with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const businessId = searchParams.get("businessId") || "biz-001";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let leads = mockLeads.filter((l) => l.businessId === businessId);

  if (status && ["HOT", "WARM", "COLD"].includes(status)) {
    leads = leads.filter((l) => l.status === status);
  }

  const total = leads.length;
  const paginated = leads.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    leads: paginated,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/v1/leads — create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, source, businessId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // In production: save to DB via Prisma, then trigger AI qualification
    const newLead = {
      id: `lead-${Date.now()}`,
      businessId: businessId || "biz-001",
      name,
      email,
      phone,
      status: "COLD" as const,
      source: source || "API",
      score: 0,
      tags: [],
      lastContact: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ lead: newLead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
