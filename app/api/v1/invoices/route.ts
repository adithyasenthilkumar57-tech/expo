import { NextRequest, NextResponse } from "next/server";
import { mockInvoices } from "@/lib/mock-data";

// GET /api/v1/invoices
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const businessId = searchParams.get("businessId") || "biz-001";

  let invoices = mockInvoices.filter((i) => i.businessId === businessId);
  if (status) invoices = invoices.filter((i) => i.status === status);

  const summary = {
    total: invoices.length,
    totalAmount: invoices.reduce((s, i) => s + i.total, 0),
    paid: invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0),
    pending: invoices.filter((i) => ["SENT", "VIEWED"].includes(i.status)).reduce((s, i) => s + i.total, 0),
    overdue: invoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + i.total, 0),
  };

  return NextResponse.json({ invoices, summary });
}

// POST /api/v1/invoices
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientEmail, items, dueDate, notes, businessId } = body;

    if (!clientName || !clientEmail || !items?.length) {
      return NextResponse.json({ error: "clientName, clientEmail, and items are required" }, { status: 400 });
    }

    const subtotal = items.reduce((s: number, item: any) => s + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const newInvoice = {
      id: `inv-${Date.now()}`,
      businessId: businessId || "biz-001",
      clientName,
      clientEmail,
      number: `INV-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(3, "0")}`,
      status: "DRAFT" as const,
      items: items.map((item: any, i: number) => ({
        id: `item-${Date.now()}-${i}`,
        ...item,
        total: item.quantity * item.unitPrice,
      })),
      subtotal,
      tax,
      total,
      dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: notes || "",
      followUpCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ invoice: newInvoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
