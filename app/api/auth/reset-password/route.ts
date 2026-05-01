import { NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const response = await fetch(`${CONVEX_URL}/api/passwordResetTokens/mutations/verifyAndReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: { email, token, newPassword } }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}