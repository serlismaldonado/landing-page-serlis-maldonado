"use client";

import { useState, useRef, useCallback } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  { title: "ERP Heskala", year: 2025, month: 10, intensity: 4, tags: ["React", "Node.js", "TypeScript", "PostgreSQL"], url: "github.com/serlismaldonado/heskala-erp", description: "Sistema ERP completo para gestión empresarial" },
  { title: "Clawdbot", year: 2025, month: 7, intensity: 3, tags: ["TypeScript", "Docker", "Automation", "API"], url: "github.com/serlismaldonado/clawdbot", description: "Bot automatizado para scraping y procesamiento de datos" },
  { title: "Landing Page", year: 2026, month: 0, intensity: 2, tags: ["Next.js", "Tailwind", "React", "TypeScript"], url: "serlis.dev", description: "Portafolio personal y landing page" },
  { title: "TanStack Router Post", year: 2026, month: 0, intensity: 1, tags: ["React", "Blog", "TypeScript", "Routing"], url: "#", description: "Artículo técnico sobre TanStack Router" },
  { title: "n8n Workflows", year: 2025, month: 5, intensity: 2, tags: ["Automation", "n8n", "Workflows", "Integration"], url: "#", description: "Flujos de trabajo automatizados con n8n" },
  { title: "Docker Guide", year: 2025, month: 3, intensity: 1, tags: ["Docker", "Blog", "DevOps", "Tutorial"], url: "#", description: "Guía completa de Docker para desarrolladores" },
  { title: "Bitrate System", year: 2024, month: 11, intensity: 3, tags: ["React", "System"], url: "github.com/serlismaldonado/bitrate-system", description: "Sistema de gestión de bitrate" },
  { title: "Video Production", year: 2024, month: 8, intensity: 2, tags: ["Video", "Production"], url: "#", description: "Proyecto de producción de video" },
  { title: "Hack Net Provider", year: 2024, month: 6, intensity: 1, tags: ["Network", "Provider"], url: "#", description: "Proveedor de red hack" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

const intensityColors = {
  0: "bg-zinc-100 dark:bg-zinc-800",
  1: "bg-green-200 dark:bg-green-900",
  2: "bg-green-300 dark:bg-green-800",
  3: "bg-green-400 dark:bg-green-700",
  4: "bg-green-500 dark:bg-green-600",
};

const intensityLabels = {
  0: "No activity",
  1: "Low activity",
  2: "Moderate activity",
  3: "High activity",
  4: "Very high activity",
};

export default function ContributionGraph() {
  const [hoveredProject, setHoveredProject] = useState<(typeof projects)[0] | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  // Generate weeks (last 26 weeks only for compact view)
  const weeks = Array.from({ length: 26 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (25 - weekIndex) * 7 - (6 - dayIndex));
      const project = projects.find((p) => p.year === date.getFullYear() && p.month === date.getMonth());
      return { date, project: project || null, intensity: project?.intensity || 0 };
    });
  });

  // Calculate statistics
  const totalProjects = projects.length;
  const totalContributions = projects.reduce((sum, p) => sum + p.intensity, 0);

  const handleMouseEnter = (project: (typeof projects)[0] | null, e: React.MouseEvent) => {
    if (project && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setHoveredProject(project);
    }
  };

  const handleMouseLeave = () => setHoveredProject(null);

  const handleCellClick = (project: (typeof projects)[0] | null) => {
    if (project && project.url !== "#") {
      const url = project.url.startsWith("http") ? project.url : `https://${project.url}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Initialize cell refs
  cellRefs.current = weeks.map(() => []);

  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        {/* Header - more compact */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="font-mono text-lg font-bold text-zinc-900 dark:text-white">
            Contribution Graph
          </h2>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="font-mono">{totalProjects} projects</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-2.5 h-2.5 rounded-sm ${intensityColors[level as keyof typeof intensityColors]}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Graph container - more compact */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <div className="flex gap-1.5 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col justify-between py-0.5 pr-2 text-[10px] text-zinc-400 font-mono">
                {days.map((day, index) => (
                  <span key={index} className="h-3 flex items-center justify-end">{day}</span>
                ))}
              </div>

              {/* Weeks grid - smaller cells */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((cell, dayIndex) => {
                      const colorClass = intensityColors[cell.intensity as keyof typeof intensityColors];
                      const isHovered = hoveredProject?.title === cell.project?.title;

                      return (
                        <button
                          key={dayIndex}
                          ref={(el) => { cellRefs.current[weekIndex] ||= []; cellRefs.current[weekIndex][dayIndex] = el; }}
                          className={`w-3 h-3 rounded-sm transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            colorClass
                          } ${cell.project ? "cursor-pointer hover:scale-125" : "cursor-default"} ${
                            isHovered ? "scale-125 ring-1 ring-zinc-400" : ""
                          }`}
                          onMouseEnter={(e) => handleMouseEnter(cell.project, e)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleCellClick(cell.project)}
                          tabIndex={cell.project ? 0 : -1}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Month labels - more compact */}
          <div className="flex gap-1 ml-9 mt-2">
            {months.map((month, i) => (
              <span key={month} className="font-mono text-[10px] text-zinc-400 flex-1 text-center">
                {i % 2 === 0 ? month : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredProject && (
          <div
            className="fixed z-50 p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 pointer-events-none"
            style={{ left: tooltipPosition.x + 15, top: tooltipPosition.y - 90, maxWidth: "260px" }}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <div className="font-mono text-sm font-bold text-zinc-900 dark:text-white">{hoveredProject.title}</div>
                <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {months[hoveredProject.month]} {hoveredProject.year}
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-sm ml-2 ${intensityColors[hoveredProject.intensity as keyof typeof intensityColors]}`} />
            </div>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-300 mb-2 line-clamp-2">{hoveredProject.description}</p>
            <div className="flex flex-wrap gap-1">
              {hoveredProject.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
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
