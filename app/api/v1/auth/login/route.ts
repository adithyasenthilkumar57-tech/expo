import { NextRequest, NextResponse } from "next/server";

// POST /api/v1/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // In production: verify against database with bcrypt
    // const user = await prisma.user.findUnique({ where: { email } });
    // const isValid = await bcrypt.compare(password, user.passwordHash);

    // Mock successful auth for demo
    const mockUser = {
      id: "user-001",
      email,
      name: "Alex Mercer",
      role: "OWNER",
    };

    // In production: generate real JWT tokens
    const accessToken = `mock-access-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;

    return NextResponse.json({
      user: mockUser,
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
