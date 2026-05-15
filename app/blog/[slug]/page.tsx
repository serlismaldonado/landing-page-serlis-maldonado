import { getPost, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      <article className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/blog"
          className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-10 inline-block"
        >
          ← blog
        </Link>

        <header className="mb-10">
          <p className="font-mono text-xs text-zinc-600 mb-2">{metadata.date}</p>
          <h1 className="font-mono text-2xl font-bold text-white mb-3">
            {metadata.title}
          </h1>
          <p className="font-mono text-sm text-zinc-500 mb-4">
            {metadata.description}
          </p>
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex gap-2">
              {metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="border-zinc-800 mb-10" />

        <div className="font-mono text-sm text-zinc-400 leading-relaxed space-y-4
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-4
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-100 [&_h2]:mt-8 [&_h2]:mb-3
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_h3]:mt-6 [&_h3]:mb-2
          [&_a]:text-green-500 [&_a]:hover:text-green-400 [&_a]:underline [&_a]:underline-offset-2
          [&_code]:bg-zinc-800 [&_code]:text-green-400 [&_code]:text-xs [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
          [&_pre]:bg-zinc-900 [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0
          [&_blockquote]:border-l-2 [&_blockquote]:border-green-500 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-500 [&_blockquote]:italic
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1
          [&_hr]:border-zinc-800
          [&_table]:w-full [&_table]:border-collapse
          [&_th]:border [&_th]:border-zinc-800 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-zinc-300 [&_th]:bg-zinc-900
          [&_td]:border [&_td]:border-zinc-800 [&_td]:px-4 [&_td]:py-2
          [&_img]:rounded-lg [&_img]:my-4 [&_img]:w-full">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>

        <hr className="border-zinc-800 mt-16 mb-8" />

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
