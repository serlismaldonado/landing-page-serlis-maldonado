"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Code, FileText } from "lucide-react";

const items = [
  { title: "ERP Heskala", category: "proyecto", tags: ["React", "Node.js", "TypeScript"], url: "github.com/serlismaldonado/heskala-erp" },
  { title: "Clawdbot", category: "proyecto", tags: ["TypeScript", "Docker"], url: "github.com/serlismaldonado/clawdbot" },
  { title: "Landing Page", category: "proyecto", tags: ["Next.js", "Tailwind"], url: "serlis.dev" },
  { title: "TanStack Router", category: "blog", tags: ["React", "Tutorial"], url: "blog/migracion-tanstack-router" },
  { title: "n8n Automations", category: "blog", tags: ["Automation"], url: "blog/n8n-workflows" },
  { title: "Docker Guide", category: "blog", tags: ["Docker", "DevOps"], url: "blog/docker-developers" },
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
    <section className="py-12 px-6">
      {/* Install Title */}
      <p className="max-w-3xl mx-auto mb-3 font-mono text-xs text-zinc-400 uppercase tracking-wider">
        Install in one command
      </p>

      {/* Clipboard Command */}
      <div className="max-w-3xl mx-auto mb-10">
        <button
          onClick={copyCommand}
          className="w-full group flex items-center gap-3 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer text-left"
        >
          <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
            $ npx skills add --serlis
          </span>
          <span className="ml-auto text-zinc-400 dark:text-zinc-500">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors font-mono"
        />
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-6 mb-8">
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

      {/* Table-like Grid */}
      {filteredItems.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          {filteredItems.map((item) => (
            <a
              key={item.title}
              href={`https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 py-3 px-3 -mx-3 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
            >
              {/* Icon */}
              <div className="mt-0.5">
                {item.category === "proyecto" ? (
                  <Code className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                ) : (
                  <FileText className="w-4 h-4 text-zinc-400 group-hover:text-green-500 transition-colors" />
                )}
              </div>

              {/* Title */}
              <span className="font-mono text-sm text-zinc-900 dark:text-white flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </span>

              {/* Tags */}
              <div className="flex gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded"
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
