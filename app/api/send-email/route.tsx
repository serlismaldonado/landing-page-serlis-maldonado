import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/components";
import React from "react";
import { ContactEmailTemplate } from "../../../emails/contact-email";
import { WelcomeEmailTemplate } from "../../../emails/welcome-email";

const resend = new Resend(process.env.RESEND_API_KEY);

type TemplateType = "contact" | "welcome";

interface EmailPayload {
  to: string;
  subject?: string;
  template?: TemplateType;
  data?: Record<string, string>;
  html?: string;
  text?: string;
}

const templateSubjects: Record<TemplateType, string> = {
  contact: "Nuevo mensaje de contacto",
  welcome: "Bienvenido a mi sitio",
};

async function renderTemplate(template: TemplateType, data: Record<string, string>): Promise<string> {
  switch (template) {
    case "contact":
      return render(<ContactEmailTemplate name={data.name || ""} email={data.email || ""} message={data.message || ""} />);
    case "welcome":
      return render(<WelcomeEmailTemplate name={data.name || "User"} />);
    default:
      throw new Error(`Unknown template: ${template}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailPayload = await request.json();
    const { to, subject, template, data, html, text } = body;

    if (!to) {
      return NextResponse.json({ error: "Missing required field: to" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    let emailHtml: string | undefined;
    let emailSubject: string;

    if (template && data) {
      emailHtml = await renderTemplate(template, data);
      emailSubject = subject || templateSubjects[template];
    } else if (html) {
      emailHtml = html;
      emailSubject = subject || "";
    } else {
      return NextResponse.json(
        { error: "Must provide either template+data or html" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Serlis <hola@serlismaldonado.com>",
      to: [to],
      subject: emailSubject,
      html: emailHtml,
      text,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Email send error:", error?.message || error);
    return NextResponse.json({ error: "Failed to send email", details: error?.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Send Email API is running",
  });
}