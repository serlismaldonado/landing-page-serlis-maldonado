import type { Post } from "@/lib/blog";
import { optimizedImage } from "@/lib/image";

// Últimos posts en tarjetas compactas: imagen pequeña, fecha y título.
export function BlogSection({ posts }: { posts: Post[] }) {
  const latest = posts.slice(0, 4);
  if (latest.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-zinc-600">{"// últimos posts"}</p>
            <h2 className="text-2xl font-bold tracking-tight text-white">Blog</h2>
          </div>
          <a href="/blog" className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-300">
            ver todos →
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map(({ slug, metadata }) => (
            <li key={slug}>
              <a
                href={`/blog/${slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-zinc-600"
              >
                <div className="aspect-[16/9] overflow-hidden bg-zinc-900">
                  {metadata.coverImage ? (
                    <img
                      src={optimizedImage(metadata.coverImage, 384)}
                      alt=""
                      width={384}
                      height={216}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover grayscale brightness-75 transition duration-300 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    // Sin portada en Notion: textura de puntos con los colores de la marca.
                    <div
                      aria-hidden="true"
                      className="h-full w-full opacity-60 transition-opacity group-hover:opacity-100"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(0,0,0,.85) 1.2px, transparent 1.6px), linear-gradient(120deg, #8fbcbb33, #88c0d040, #81a1c133)",
                        backgroundSize: "6px 6px, 100% 100%",
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                  <p className="font-mono text-[11px] text-zinc-500">{metadata.date}</p>
                  <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-zinc-100 group-hover:text-white">
                    {metadata.title}
                  </h3>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
