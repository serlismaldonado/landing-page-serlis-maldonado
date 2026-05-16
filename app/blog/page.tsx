import { getAllPosts } from '@/lib/blog'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { NewsletterForm } from '@/app/components/blog/NewsletterForm'

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
                <Link href={`/blog/${slug}`} className="group flex gap-4 items-center">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] text-zinc-600 mb-2 tracking-wide uppercase">
                      {metadata.date}
                    </p>
                    <h2 className="text-[18px] font-semibold text-zinc-200 group-hover:text-white transition-colors mb-2 leading-snug tracking-[-0.01em]">
                      {metadata.title}
                    </h2>
                    <p className="text-[15px] text-zinc-500 leading-relaxed line-clamp-2">
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
                  </div>

                  {metadata.coverImage && (
                    <div className="shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden bg-zinc-900">
                      <Image
                        src={metadata.coverImage}
                        alt={metadata.title}
                        width={128}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <NewsletterForm />
      </main>
    </div>
  )
}
