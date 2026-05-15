import { getPost, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const { metadata } = await getPost(slug)
    return {
      title: `${metadata.title} — Serlis Maldonado`,
      description: metadata.description,
    }
  } catch {
    return {}
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  let markdown: string
  let metadata: Awaited<ReturnType<typeof getPost>>['metadata']

  try {
    ;({ markdown, metadata } = await getPost(slug))
  } catch {
    notFound()
  }

  return (
    <div className="bg-zinc-950 min-h-screen">
      <article className="max-w-[680px] mx-auto px-6 pt-12 pb-20">
        <Link
          href="/blog"
          className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-8 inline-block"
        >
          ← blog
        </Link>

        <header className="mb-6">
          <p className="font-mono text-[11px] text-zinc-600 mb-4 tracking-wide uppercase">
            {metadata.date}
          </p>
          <h1 className="text-[40px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4">
            {metadata.title}
          </h1>
          <div className="flex items-center gap-2.5 mb-4">
            <Image
              src="/avatar.jpg"
              alt="Serlis Maldonado"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <span className="text-[13px] text-zinc-400">Serlis Maldonado</span>
          </div>
          <p className="text-xl text-zinc-400 leading-relaxed font-normal mb-6">
            {metadata.description}
          </p>
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex gap-2">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="border-zinc-800/60 mb-6" />

        <div className="
          text-[17px] text-zinc-300 leading-[1.8]
          [&>*+*]:mt-5
          [&_h1]:text-[36px] [&_h1]:font-bold [&_h1]:text-white [&_h1]:tracking-[-0.025em] [&_h1]:leading-tight [&_h1]:mt-14 [&_h1]:mb-5
          [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:text-white [&_h2]:tracking-[-0.02em] [&_h2]:leading-tight [&_h2]:mt-12 [&_h2]:mb-4
          [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_h3]:tracking-[-0.015em] [&_h3]:leading-snug [&_h3]:mt-10 [&_h3]:mb-3
          [&_h4]:text-[17px] [&_h4]:font-semibold [&_h4]:text-zinc-200 [&_h4]:mt-8 [&_h4]:mb-2
          [&_p]:text-zinc-300 [&_p]:leading-[1.8]
          [&_strong]:text-white [&_strong]:font-semibold
          [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-zinc-600 [&_a]:hover:decoration-white [&_a]:transition-colors
          [&_code]:font-mono [&_code]:text-[14px] [&_code]:bg-zinc-900 [&_code]:text-zinc-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-zinc-800
          [&_pre]:bg-zinc-900 [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:rounded-xl [&_pre]:px-5 [&_pre]:py-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-[14px]
          [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-zinc-300
          [&_blockquote]:border-l [&_blockquote]:border-zinc-700 [&_blockquote]:pl-5 [&_blockquote]:my-6 [&_blockquote]:text-zinc-500 [&_blockquote]:italic
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-2
          [&_li]:text-zinc-300 [&_li]:leading-[1.8]
          [&_hr]:border-zinc-800/60 [&_hr]:my-10
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:text-[15px]
          [&_th]:border [&_th]:border-zinc-800 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-medium [&_th]:text-zinc-300 [&_th]:bg-zinc-900/60
          [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-zinc-400
          [&_img]:rounded-xl [&_img]:my-8 [&_img]:w-full
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>

        <hr className="border-zinc-800/60 mt-16 mb-8" />

        <Link
          href="/blog"
          className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          ← volver al blog
        </Link>
      </article>
    </div>
  )
}
