"use client";

import { useState, useMemo } from "react";
import { Search, Code, FileText } from "lucide-react";

const projects = [
  {
    title: "ERP Heskala",
    description: "Sistema empresarial completo con facturación multi-empresa",
    category: "proyecto",
    tags: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    link: "https://github.com/serlismaldonado/heskala-erp",
  },
  {
    title: "Clawdbot Integration",
    description: "Bot multi-plataforma con Docker y Telegram",
    category: "proyecto",
    tags: ["TypeScript", "Docker", "Telegram API"],
    link: "#",
  },
  {
    title: "Landing Page Personal",
    description: "Portfolio minimalista con Next.js y Base UI",
    category: "proyecto",
    tags: ["Next.js", "React", "Tailwind"],
    link: "#",
  },
];

const posts = [
  {
    title: "Migración a TanStack Router",
    description: "Cómo migrar de React Router a TanStack Router",
    category: "blog",
    tags: ["React", "Tutorial"],
    link: "#",
  },
  {
    title: "Automatizaciones con n8n",
    description: "Workflows de automatización para negocios",
    category: "blog",
    tags: ["Automation", "n8n"],
    link: "#",
  },
  {
    title: "Docker para Developers",
    description: "Guía práctica de Docker en el día a día",
    category: "blog",
    tags: ["Docker", "DevOps"],
    link: "#",
  },
];

export default function SearchGrid() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "proyecto" | "blog">("all");

  const filteredItems = useMemo(() => {
    const allItems = [...projects, ...posts];
    return allItems.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = activeFilter === "all" || item.category === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const filters = [
    { key: "all", label: "Todos" },
    { key: "proyecto", label: "Proyectos" },
    { key: "blog", label: "Blog" },
  ] as const;

  return (
    <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Proyectos y Artículos
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Explora mis proyectos y contenido técnico
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, tecnología..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.key
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <a
                key={item.title + index}
                href={item.link}
                className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {item.category === "proyecto" ? (
                      <Code className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      {item.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">
              No se encontraron resultados para "{query}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
