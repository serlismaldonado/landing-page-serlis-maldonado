import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { getPost } from '@/lib/blog'
import { render } from '@react-email/components'
import { BlogPostEmail } from '@/emails/BlogPostEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { slug } = await request.json()

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 })
  }

  const segmentId = process.env.RESEND_SEGMENT_ID
  if (!segmentId) {
    return NextResponse.json({ error: 'RESEND_SEGMENT_ID no configurado' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://serlismaldonado.com'

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

  const { data, error } = await resend.broadcasts.create({
    segmentId,
    from: 'Serlis Maldonado <blog@serlismaldonado.com>',
    subject: metadata.title,
    html,
    send: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, broadcastId: data?.id })
}
