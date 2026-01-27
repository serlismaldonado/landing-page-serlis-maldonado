"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Send, Code, FileText, Eye, ExternalLink } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  category: "proyecto" | "blog";
  tags: string[];
  visibility?: "public" | "private";
}

const categories: { key: "all" | "proyecto" | "blog"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "proyecto", label: "Projects" },
  { key: "blog", label: "Blog" },
];

export default function SearchGrid() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "proyecto" | "blog">("all");
  // Fetch projects from Convex
  const projects = useQuery(api.projects.queries.getAllProjects);

  const filteredItems = useMemo(() => {
    if (!projects) return [];
    return projects.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        );
      const matchesFilter = filter === "all" || item.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [projects, query, filter]);

  const handleEmailSubmit = () => {
    window.location.href = "mailto:serlismaldonado@heskala.com";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEmailSubmit();
    }
  };

  return (
    <section className="py-12 px-6">
      {/* Email Contact */}
      <p className="max-w-3xl mx-auto mb-3 font-mono text-xs text-zinc-400 uppercase tracking-wider text-center">
        Contact me in one command
      </p>

      {/* Email Input */}
      <div className="max-w-xs mx-auto mb-10">
        <div className="relative group">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <span className="font-mono text-sm">
              <span className="text-green-600 dark:text-green-500">$</span>
              <span className="text-zinc-600 dark:text-zinc-400"> npx </span>
              <span className="text-green-600 dark:text-green-500">
                contact{" "}
              </span>
              <span className="text-green-600 dark:text-green-500">serlis</span>
              <span className="text-zinc-600 dark:text-zinc-400"> --now </span>
            </span>
            <button
              onClick={handleEmailSubmit}
              className="ml-auto p-1.5 text-zinc-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
              title="Send email"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 font-mono text-xs text-zinc-400 text-center">
            Press Enter or click the send icon to open your email client
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-sm mx-auto mb-6">
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
      {!projects ? (
        <div className="text-center py-12">
          <div className="font-mono text-zinc-400">Loading projects...</div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          {filteredItems.map((item: Project) => (
            <div
              key={item._id}
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

              {/* Title - Clickable to detail page */}
              <a
                href={`/projects/${item._id}`}
                className="font-mono text-sm text-zinc-900 dark:text-white flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hover:underline"
              >
                {item.title}
              </a>

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

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                {/* Detail view icon */}
                <a
                  href={`/projects/${item._id}`}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  title="View details"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-3.5 h-3.5" />
                </a>

                {/* External link icon (only if URL exists) */}
                {item.url && item.url !== "#" && (
                  <a
                    href={
                      item.url.startsWith("http")
                        ? item.url
                        : `https://${item.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    title="Open external link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center font-mono text-zinc-400 text-xs">
          No results found.
        </p>
      )}
    </section>
  );
}
