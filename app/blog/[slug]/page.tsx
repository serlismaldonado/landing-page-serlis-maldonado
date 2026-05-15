import { getPost, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

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

  let Component: React.ComponentType
  let metadata: Awaited<ReturnType<typeof getPost>>['metadata']

  try {
    ;({ Component, metadata } = await getPost(slug))
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
          {metadata.tags && (
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

        <div>
          <Component />
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
