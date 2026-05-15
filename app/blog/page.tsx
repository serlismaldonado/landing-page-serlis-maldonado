import { getAllPosts } from '@/lib/blog'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog — Serlis Maldonado',
  description: 'Notas técnicas, proceso y herramientas.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="bg-zinc-950 min-h-screen">
      <main className="max-w-[680px] mx-auto px-6 py-20">
        <div className="mb-16">
          <Link
            href="/"
            className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-12 inline-block"
          >
            ← volver
          </Link>
          <h1 className="text-[40px] font-bold text-white tracking-[-0.02em] leading-tight mb-3">
            Blog
          </h1>
          <p className="text-[17px] text-zinc-500 leading-relaxed">
            Notas técnicas, proceso y herramientas.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-zinc-600">
            // No hay posts todavía.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-900">
            {posts.map(({ slug, metadata }) => (
              <li key={slug} className="py-8 first:pt-0">
                <Link href={`/blog/${slug}`} className="group block">
                  <p className="font-mono text-[11px] text-zinc-600 mb-2 tracking-wide uppercase">
                    {metadata.date}
                  </p>
                  <h2 className="text-[18px] font-semibold text-zinc-200 group-hover:text-white transition-colors mb-2 leading-snug tracking-[-0.01em]">
                    {metadata.title}
                  </h2>
                  <p className="text-[15px] text-zinc-500 leading-relaxed">
                    {metadata.description}
                  </p>
                  {metadata.tags && metadata.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
