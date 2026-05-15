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
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Link
            href="/"
            className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-8 inline-block"
          >
            ← volver
          </Link>
          <h1 className="font-mono text-2xl text-white mb-2">
            <span className="text-green-500">$</span> cat blog/
          </h1>
          <p className="font-mono text-sm text-zinc-500">
            Notas técnicas, proceso y herramientas.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-zinc-600">
            // No hay posts todavía.
          </p>
        ) : (
          <ul className="space-y-10">
            {posts.map(({ slug, metadata }) => (
              <li key={slug}>
                <Link href={`/blog/${slug}`} className="group block">
                  <p className="font-mono text-xs text-zinc-600 mb-1">
                    {metadata.date}
                  </p>
                  <h2 className="font-mono text-base text-zinc-300 group-hover:text-white transition-colors mb-1">
                    {metadata.title}
                  </h2>
                  <p className="font-mono text-sm text-zinc-500">
                    {metadata.description}
                  </p>
                  {metadata.tags && (
                    <div className="flex gap-2 mt-2">
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
