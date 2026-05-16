import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email } = await request.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const segmentId = process.env.RESEND_SEGMENT_ID

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  })

  if (error) {
    console.error('[subscribe] Resend error:', JSON.stringify(error))
    return NextResponse.json({ error: 'Error al suscribirse' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
