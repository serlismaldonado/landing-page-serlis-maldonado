import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import Image from 'next/image'

export async function BlogSection() {
  const posts = await getAllPosts()
  const latest = posts.slice(0, 4)

  if (latest.length === 0) return null

  const [first, second, third, fourth] = latest

  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-wide mb-2">
              // últimos posts
            </p>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[200px]">
          {/* Post 1 — grande, ocupa 2 columnas y 2 filas */}
          {first && (
            <Link
              href={`/blog/${first.slug}`}
              className="lg:col-span-2 lg:row-span-2 group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              {first.metadata.coverImage && (
                <Image
                  src={first.metadata.coverImage}
                  alt={first.metadata.title}
                  fill
                  className="object-cover grayscale brightness-50 contrast-125 group-hover:brightness-60 transition-all duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {first.metadata.tags && first.metadata.tags.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {first.metadata.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-zinc-500 border border-zinc-700 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="font-mono text-[11px] text-zinc-500 mb-2">
                  {first.metadata.date}
                </p>
                <h3 className="text-[20px] font-bold text-white tracking-tight leading-snug mb-2 group-hover:text-zinc-200 transition-colors">
                  {first.metadata.title}
                </h3>
                {first.metadata.description && (
                  <p className="text-[13px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {first.metadata.description}
                  </p>
                )}
              </div>
            </Link>
          )}

          {/* Post 2 — ocupa 2 columnas, 1 fila */}
          {second && (
            <Link
              href={`/blog/${second.slug}`}
              className="lg:col-span-2 group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              {second.metadata.coverImage && (
                <Image
                  src={second.metadata.coverImage}
                  alt={second.metadata.title}
                  fill
                  className="object-cover grayscale brightness-50 contrast-125 group-hover:brightness-60 transition-all duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-zinc-500 mb-1">
                    {second.metadata.date}
                  </p>
                  <h3 className="text-[16px] font-bold text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors truncate">
                    {second.metadata.title}
                  </h3>
                </div>
                <span className="font-mono text-xs text-zinc-500 shrink-0 group-hover:text-zinc-300 transition-colors">
                  →
                </span>
              </div>
            </Link>
          )}

          {/* Post 3 */}
          {third && (
            <Link
              href={`/blog/${third.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              {third.metadata.coverImage && (
                <Image
                  src={third.metadata.coverImage}
                  alt={third.metadata.title}
                  fill
                  className="object-cover grayscale brightness-50 contrast-125 group-hover:brightness-60 transition-all duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-[11px] text-zinc-500 mb-1">
                  {third.metadata.date}
                </p>
                <h3 className="text-[14px] font-bold text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2">
                  {third.metadata.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Post 4 */}
          {fourth && (
            <Link
              href={`/blog/${fourth.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              {fourth.metadata.coverImage && (
                <Image
                  src={fourth.metadata.coverImage}
                  alt={fourth.metadata.title}
                  fill
                  className="object-cover grayscale brightness-50 contrast-125 group-hover:brightness-60 transition-all duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono text-[11px] text-zinc-500 mb-1">
                  {fourth.metadata.date}
                </p>
                <h3 className="text-[14px] font-bold text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2">
                  {fourth.metadata.title}
                </h3>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
