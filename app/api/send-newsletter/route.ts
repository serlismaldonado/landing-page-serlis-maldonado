import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { getPost } from '@/lib/blog'
import { render } from '@react-email/components'
import { BlogPostEmail } from '@/emails/BlogPostEmail'

export async function POST(request: Request) {
  try {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { slug } = await request.json()

  console.log('[send-newsletter] slug:', slug)

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
  }

  const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID
  console.log('[send-newsletter] segmentId:', segmentId ? 'set' : 'MISSING')
  if (!segmentId) {
    return NextResponse.json({ error: 'RESEND_SEGMENT_ID no configurado' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://serlismaldonado.com'

  const { metadata } = await getPost(slug)
  console.log('[send-newsletter] metadata:', JSON.stringify(metadata))

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
    segmentId,
    from: 'Serlis Maldonado <blog@serlismaldonado.com>',
    subject: metadata.title,
    html,
  })

  if (createError || !created?.id) {
    console.error('[send-newsletter] create error:', JSON.stringify(createError))
    return NextResponse.json({ error: createError?.message ?? 'Error creando broadcast' }, { status: 500 })
  }

  const { data, error: sendError } = await resend.broadcasts.send(created.id)

  if (sendError) {
    console.error('[send-newsletter] send error:', JSON.stringify(sendError))
    return NextResponse.json({ error: sendError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, broadcastId: data?.id })
  } catch (err) {
    console.error('[send-newsletter] unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
