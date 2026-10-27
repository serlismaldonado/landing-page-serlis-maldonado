import { getAllPosts } from '@/lib/blog'
import { SendButton } from './SendButton'
import Link from 'next/link'

export default async function NewsletterAdminPage() {
  const posts = await getAllPosts()

  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            href="/admin"
            className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-8 inline-block"
          >
            ← admin
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Newsletter
          </h1>
          <p className="text-sm text-zinc-500">
            Envía un post del blog a todos los suscriptores.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-zinc-600">
            // No hay posts publicados.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-900">
            {posts.map(({ slug, metadata }) => (
              <li key={slug} className="py-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-zinc-600 mb-0.5 uppercase tracking-wide">
                    {metadata.date}
                  </p>
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {metadata.title}
                  </p>
                  {metadata.tags && metadata.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-1">
                      {metadata.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <SendButton slug={slug} title={metadata.title} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
