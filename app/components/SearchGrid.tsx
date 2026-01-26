"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";

const items = [
  {
    title: "ERP Heskala",
    category: "proyecto",
    tags: ["React", "Node.js", "TypeScript"],
    url: "github.com/serlismaldonado/heskala-erp",
  },
  {
    title: "Clawdbot",
    category: "proyecto",
    tags: ["TypeScript", "Docker"],
    url: "github.com/serlismaldonado/clawdbot",
  },
  {
    title: "TanStack Router",
    category: "blog",
    tags: ["React", "Tutorial"],
    url: "blog/migracion-tanstack-router",
  },
  {
    title: "n8n Automations",
    category: "blog",
    tags: ["Automation"],
    url: "blog/n8n-workflows",
  },
  {
    title: "Docker Guide",
    category: "blog",
    tags: ["Docker", "DevOps"],
    url: "blog/docker-developers",
  },
  {
    title: "Landing Page",
    category: "proyecto",
    tags: ["Next.js", "Tailwind"],
    url: "serlis.dev",
  },
];

const categories: { key: "all" | "proyecto" | "blog"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "proyecto", label: "Projects" },
  { key: "blog", label: "Blog" },
];

export default function SearchGrid() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "proyecto" | "blog">("all");
  const [copied, setCopied] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === "all" || item.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx skills add --serlis");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 px-6">
      {/* Clipboard style install command */}
      <div className="max-w-3xl mx-auto mb-12">
        <button
          onClick={copyCommand}
          className="w-full group flex items-center gap-3 px-4 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer text-left"
        >
          <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
            $ npx skills add --serlis
          </span>
          <span className="ml-auto text-zinc-400 dark:text-zinc-500">
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
            )}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors font-mono"
        />
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-6 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`text-sm font-mono transition-colors ${
              filter === cat.key
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {filteredItems.map((item) => (
            <a
              key={item.title}
              href={`https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-500 uppercase">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  →
                </span>
              </div>
              <h3 className="text-base font-medium text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center font-mono text-zinc-400">No results found.</p>
      )}
    </section>
  );
}
