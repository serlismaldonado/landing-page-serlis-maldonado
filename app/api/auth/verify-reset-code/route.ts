import { NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email y token requeridos" }, { status: 400 });
    }

    const response = await fetch(`${CONVEX_URL}/api/passwordResetTokens/queries/checkToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: { email, token } }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Verify reset code error:", error);
    return NextResponse.json({ valid: false, error: "Error interno" }, { status: 500 });
  }
}