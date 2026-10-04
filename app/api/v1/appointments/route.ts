import { NextRequest, NextResponse } from "next/server";
import { mockAppointments } from "@/lib/mock-data";

// GET /api/v1/appointments — list appointments with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const businessId = searchParams.get("businessId") || "biz-001";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let appointments = mockAppointments.filter((a) => a.businessId === businessId);

  if (status && ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].includes(status)) {
    appointments = appointments.filter((a) => a.status === status);
  }

  const total = appointments.length;
  const paginated = appointments.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    appointments: paginated,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/v1/appointments — schedule a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, clientName, clientEmail, clientPhone, scheduledAt, durationMinutes, notes, businessId } = body;

    if (!title || !clientName || !scheduledAt) {
      return NextResponse.json(
        { error: "Title, client name, and scheduled date/time are required" },
        { status: 400 }
      );
    }

    const newAppointment = {
      id: `apt-${Date.now()}`,
      businessId: businessId || "biz-001",
      title,
      clientName,
      clientEmail: clientEmail || "",
      clientPhone: clientPhone || "",
      scheduledAt: new Date(scheduledAt).toISOString(),
      durationMinutes: durationMinutes || 30,
      status: "SCHEDULED" as const,
      reminderSent: false,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ appointment: newAppointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
