import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function GET() {
  try {
    const response = await fetch(`${CONVEX_URL}/api/emailTemplates/queries/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: {} }),
    });
    const data = await response.json();
    return NextResponse.json({ templates: data });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ templates: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, content, type } = body;

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const response = await fetch(`${CONVEX_URL}/api/emailTemplates/mutations/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        args: {
          name,
          subject,
          content,
          type: type || "custom",
        },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data });
  } catch (error: any) {
    console.error("Error saving template:", error);
    return NextResponse.json(
      { error: error?.message || "Error al guardar" },
      { status: 500 }
    );
  }
}