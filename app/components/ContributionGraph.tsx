"use client";

import { useState, useRef, useEffect } from "react";

const projects = [
  { title: "ERP Heskala", year: 2025, month: 11, intensity: 4, tags: ["React", "Node.js"], url: "github.com/serlismaldonado/heskala-erp" },
  { title: "Clawdbot", year: 2026, month: 0, intensity: 3, tags: ["TypeScript", "Docker"], url: "github.com/serlismaldonado/clawdbot" },
  { title: "Landing Page", year: 2026, month: 0, intensity: 2, tags: ["Next.js", "Tailwind"], url: "serlis.dev" },
  { title: "TanStack Router Post", year: 2026, month: 0, intensity: 1, tags: ["React", "Blog"], url: "#" },
  { title: "n8n Workflows", year: 2025, month: 11, intensity: 2, tags: ["Automation"], url: "#" },
  { title: "Docker Guide", year: 2025, month: 10, intensity: 1, tags: ["Docker", "Blog"], url: "#" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const intensityColors = {
  0: "bg-zinc-100 dark:bg-zinc-800",
  1: "bg-green-200 dark:bg-green-900",
  2: "bg-green-300 dark:bg-green-800",
  3: "bg-green-400 dark:bg-green-700",
  4: "bg-green-500 dark:bg-green-600",
};

export default function ContributionGraph() {
  const [hoveredCell, setHoveredCell] = useState<{ project: typeof projects[0] | null; x: number; y: number }>({
    project: null,
    x: 0,
    y: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate weeks for display (last 52 weeks)
  const weeks = Array.from({ length: 52 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (51 - weekIndex) * 7 - (6 - dayIndex));
      
      const project = projects.find(
        (p) => p.year === date.getFullYear() && p.month === date.getMonth()
      );
      
      return {
        date,
        project: project || null,
        intensity: project?.intensity || 0,
      };
    });
  });

  const handleMouseEnter = (project: typeof projects[0] | null, e: React.MouseEvent) => {
    if (project) {
      const rect = containerRef.current?.getBoundingClientRect();
      setHoveredCell({
        project,
        x: e.clientX - (rect?.left || 0),
        y: e.clientY - (rect?.top || 0) - 10,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell({ project: null, x: 0, y: 0 });
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-lg text-zinc-900 dark:text-white">
            Contribution Graph
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="font-mono">Less</span>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${intensityColors[level as keyof typeof intensityColors]}`}
                />
              ))}
            </div>
            <span className="font-mono">More</span>
          </div>
        </div>

        {/* Graph */}
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-fit">
            {/* Day labels */}
            <div className="flex flex-col justify-between py-1 pr-2 text-xs text-zinc-400 font-mono">
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((cell, dayIndex) => {
                    const colorClass = intensityColors[cell.intensity as keyof typeof intensityColors];
                    const isHovered = hoveredCell.project?.title === cell.project?.title;

                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${colorClass} ${
                          cell.project
                            ? "cursor-pointer hover:ring-2 hover:ring-zinc-400 dark:hover:ring-zinc-600 transition-all"
                            : ""
                        } ${isHovered ? "ring-2 ring-zinc-500 dark:ring-zinc-400" : ""}`}
                        onMouseEnter={(e) => handleMouseEnter(cell.project, e)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => cell.project && window.open(`https://${cell.project.url}`, "_blank")}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Month labels */}
        <div className="flex gap-1 ml-9 mt-2">
          {months.map((month, i) => (
            <span key={month} className="font-mono text-xs text-zinc-400" style={{ width: "13.5px" }}>
              {i % 2 === 0 ? month : ""}
            </span>
          ))}
        </div>

        {/* Custom Tooltip */}
        {hoveredCell.project && (
          <div
            className="fixed z-50 p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 pointer-events-none"
            style={{
              left: hoveredCell.x + 10,
              top: hoveredCell.y - 80,
            }}
          >
            <div className="font-mono text-sm font-medium text-zinc-900 dark:text-white">
              {hoveredCell.project.title}
            </div>
            <div className="font-mono text-xs text-zinc-500 mt-1">
              {months[hoveredCell.project.month]} {hoveredCell.project.year}
            </div>
            <div className="flex gap-1 mt-2">
              {hoveredCell.project.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-200 dark:bg-zinc-700 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
