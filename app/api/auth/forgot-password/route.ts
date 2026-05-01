import { NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const response = await fetch(`${CONVEX_URL}/api/passwordResetTokens/mutations/requestReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: { email } }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}