import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID || process.env.RESEND_SEGMENT_ID

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(audienceId ? { audienceId } : {}),
  })

  if (error) {
    console.error('[subscribe] Resend error:', JSON.stringify(error))
    return NextResponse.json({ error: 'Error al suscribirse' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
