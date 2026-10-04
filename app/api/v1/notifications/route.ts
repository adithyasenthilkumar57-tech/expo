import { NextRequest, NextResponse } from "next/server";
import { mockNotifications } from "@/lib/mock-data";

// GET /api/v1/notifications — list notifications
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const businessId = searchParams.get("businessId") || "biz-001";

  let notifications = mockNotifications.filter((n) => n.businessId === businessId);

  if (unreadOnly) {
    notifications = notifications.filter((n) => !n.isRead);
  }

  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    total: notifications.length,
  });
}

// PATCH /api/v1/notifications — mark all as read or update status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === "mark_all_read") {
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (id) {
      return NextResponse.json({ success: true, message: `Notification ${id} updated` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
