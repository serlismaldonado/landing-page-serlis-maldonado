import type { APIRoute } from 'astro'
import { serverEnv } from '@/lib/env'
import { Resend } from 'resend'

export const POST: APIRoute = async ({ request }) => {
  const resend = new Resend(serverEnv('RESEND_API_KEY'))
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Email inválido' }, { status: 400 })
  }

  const audienceId = serverEnv('RESEND_AUDIENCE_ID') || serverEnv('RESEND_SEGMENT_ID')

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(audienceId ? { audienceId } : {}),
  })

  if (error) {
    console.error('[subscribe] Resend error:', JSON.stringify(error))
    return Response.json({ error: 'Error al suscribirse' }, { status: 500 })
  }

  return Response.json({ ok: true })
}

export const prerender = false
