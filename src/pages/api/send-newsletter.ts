import type { APIRoute } from 'astro'
import { serverEnv } from '@/lib/env'
import { Resend } from 'resend'
import { getPost } from '@/lib/blog'
import { render } from '@react-email/components'
import { BlogPostEmail } from '@/emails/BlogPostEmail'
import { isAdminRequest } from '@/lib/require-admin'

export const POST: APIRoute = async ({ request }) => {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
  const resend = new Resend(serverEnv('RESEND_API_KEY'))
  const { slug } = await request.json()

  console.log('[send-newsletter] slug:', slug)

  if (!slug || typeof slug !== 'string') {
    return Response.json({ error: 'Slug requerido' }, { status: 400 })
  }

  const audienceId = serverEnv('RESEND_AUDIENCE_ID') || serverEnv('RESEND_SEGMENT_ID')
  console.log('[send-newsletter] audienceId:', audienceId ? 'set' : 'MISSING')
  if (!audienceId) {
    return Response.json({ error: 'RESEND_AUDIENCE_ID no configurado' }, { status: 500 })
  }

  const siteUrl = serverEnv('NEXT_PUBLIC_SITE_URL') ?? 'https://serlismaldonado.com'

  const { metadata } = await getPost(slug)

  const html = await render(
    BlogPostEmail({
      title: metadata.title,
      description: metadata.description,
      date: metadata.date,
      slug,
      coverImage: metadata.coverImage,
      tags: metadata.tags,
      siteUrl,
    })
  )
  console.log('[send-newsletter] html rendered, length:', html.length)

  const { data: created, error: createError } = await resend.broadcasts.create({
    audienceId,
    from: 'Serlis Maldonado <blog@serlismaldonado.com>',
    subject: metadata.title,
    html,
  })

  if (createError || !created?.id) {
    console.error('[send-newsletter] create error:', JSON.stringify(createError))
    return Response.json({ error: createError?.message ?? 'Error creando broadcast' }, { status: 500 })
  }

  const { data, error: sendError } = await resend.broadcasts.send(created.id)

  if (sendError) {
    console.error('[send-newsletter] send error:', JSON.stringify(sendError))
    return Response.json({ error: sendError.message }, { status: 500 })
  }

  return Response.json({ ok: true, broadcastId: data?.id })
  } catch (err) {
    console.error('[send-newsletter] unexpected error:', err)
    return Response.json({ error: 'Error enviando el newsletter' }, { status: 500 })
  }
}

export const prerender = false
