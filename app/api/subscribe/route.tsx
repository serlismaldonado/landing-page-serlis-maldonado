import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderNewsletterConfirmation } from "../../../emails/newsletter-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SubscribePayload {
  email: string;
  name?: string;
  redirectTo?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribePayload = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY no configurado" }, { status: 500 });
    }

    const existingContact = await resend.contacts.get({ email }).catch(() => null);

    if (existingContact?.data) {
      return NextResponse.json({ 
        success: true, 
        message: "Ya estás subscripto!",
        alreadySubscribed: true 
      });
    }

    const newContact = await resend.contacts.create(
      { email, firstName: name },
    );

    if (newContact.error) {
      console.error("Error creando contacto:", newContact.error);
      return NextResponse.json({ 
        error: newContact.error.message || "Error al agregar contacto" 
      }, { status: 500 });
    }

    const confirmationHtml = await renderNewsletterConfirmation({ email, name });

    await resend.emails.send({
      from: "Serlis <hola@serlismaldonado.com>",
      to: [email],
      subject: "Confirmá tu suscripción",
      html: confirmationHtml,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Suscripto! Revisá tu email.",
      alreadySubscribed: false 
    });

  } catch (error: any) {
    console.error("Subscribe error:", error?.message || error);
    return NextResponse.json({ 
      error: "Error interno", 
      details: error?.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Subscribe API is running",
  });
}