"use client";

import { useState, useRef, useCallback } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "ERP Heskala",
    year: 2025,
    month: 11,
    intensity: 4,
    tags: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    url: "github.com/serlismaldonado/heskala-erp",
    description: "Sistema ERP completo para gestión empresarial",
  },
  {
    title: "Clawdbot",
    year: 2026,
    month: 0,
    intensity: 3,
    tags: ["TypeScript", "Docker", "Automation", "API"],
    url: "github.com/serlismaldonado/clawdbot",
    description: "Bot automatizado para scraping y procesamiento de datos",
  },
  {
    title: "Landing Page",
    year: 2026,
    month: 0,
    intensity: 2,
    tags: ["Next.js", "Tailwind", "React", "TypeScript"],
    url: "serlis.dev",
    description: "Portafolio personal y landing page",
  },
  {
    title: "TanStack Router Post",
    year: 2026,
    month: 0,
    intensity: 1,
    tags: ["React", "Blog", "TypeScript", "Routing"],
    url: "#",
    description: "Artículo técnico sobre TanStack Router",
  },
  {
    title: "n8n Workflows",
    year: 2025,
    month: 11,
    intensity: 2,
    tags: ["Automation", "n8n", "Workflows", "Integration"],
    url: "#",
    description: "Flujos de trabajo automatizados con n8n",
  },
  {
    title: "Docker Guide",
    year: 2025,
    month: 10,
    intensity: 1,
    tags: ["Docker", "Blog", "DevOps", "Tutorial"],
    url: "#",
    description: "Guía completa de Docker para desarrolladores",
  },
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

  // Generate weeks for display (last 52 weeks)
  const weeks = Array.from({ length: 52 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (51 - weekIndex) * 7 - (6 - dayIndex));
      const project = projects.find((p) => p.year === date.getFullYear() && p.month === date.getMonth());
      return { date, project: project || null, intensity: project?.intensity || 0 };
    });
  });

  // Get all unique tags from projects
  const allTags = Array.from(new Set(projects.flatMap((project) => project.tags))).sort();

  // Calculate statistics
  const totalProjects = projects.length;
  const totalContributions = projects.reduce((sum, p) => sum + p.intensity, 0);
  const averageIntensity = (totalContributions / totalProjects).toFixed(1);

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

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!hoveredProject || !cellRefs.current.length) return;

    const currentWeekIndex = weeks.findIndex((week) => week.some((cell) => cell.project?.title === hoveredProject.title));
    const currentDayIndex = weeks[currentWeekIndex]?.findIndex((cell) => cell.project?.title === hoveredProject.title);

    if (currentWeekIndex === -1 || currentDayIndex === -1) return;

    let newWeekIndex = currentWeekIndex;
    let newDayIndex = currentDayIndex;

    switch (e.key) {
      case "ArrowUp": newDayIndex = Math.max(0, currentDayIndex - 1); break;
      case "ArrowDown": newDayIndex = Math.min(6, currentDayIndex + 1); break;
      case "ArrowLeft": newWeekIndex = Math.max(0, currentWeekIndex - 1); break;
      case "ArrowRight": newWeekIndex = Math.min(51, currentWeekIndex + 1); break;
      case "Enter":
      case " ": handleCellClick(hoveredProject); return;
      case "Escape": setHoveredProject(null); return;
      default: return;
    }

    const newCell = weeks[newWeekIndex]?.[newDayIndex];
    if (newCell?.project && cellRefs.current[newWeekIndex]?.[newDayIndex]) {
      cellRefs.current[newWeekIndex]?.[newDayIndex]?.focus();
    }
  }, [hoveredProject, weeks]);

  // Initialize cell refs
  cellRefs.current = weeks.map(() => []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <div>
            <h2 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              Contribution Graph
            </h2>
            <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
              Visual timeline of projects and contributions
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="text-center">
              <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">{totalProjects}</div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">{totalContributions}</div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">Total Activity</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">{averageIntensity}</div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">Avg. Intensity</div>
            </div>
          </div>
        </div>

        {/* Graph container */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800">
          {/* Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">Activity level:</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className="flex flex-col items-center gap-1" title={intensityLabels[level as keyof typeof intensityLabels]}>
                    <div className={`w-4 h-4 rounded-sm ${intensityColors[level as keyof typeof intensityColors]}`} />
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">{level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              Hover or use arrow keys to navigate
            </div>
          </div>

          {/* Graph */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col justify-between py-1 pr-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                {days.map((day, index) => (
                  <span key={index} className="h-4 flex items-center justify-end">{day}</span>
                ))}
              </div>

              {/* Weeks grid */}
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
                          className={`w-4 h-4 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            colorClass
                          } ${cell.project ? "cursor-pointer hover:scale-110 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600" : "cursor-default"} ${
                            isHovered ? "ring-2 ring-zinc-500 dark:ring-zinc-400 scale-110" : ""
                          }`}
                          onMouseEnter={(e) => handleMouseEnter(cell.project, e)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleCellClick(cell.project)}
                          onFocus={() => cell.project && setHoveredProject(cell.project)}
                          tabIndex={cell.project ? 0 : -1}
                          title={cell.project ? `${cell.project.title} (${months[cell.date.getMonth()]} ${cell.date.getFullYear()})` : undefined}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Month labels */}
          <div className="flex gap-1 ml-12 mt-3">
            {months.map((month, i) => (
              <span key={month} className="font-mono text-xs text-zinc-400 dark:text-zinc-500 flex-1 text-center">
                {i % 2 === 0 ? month : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredProject && (
          <div
            className="fixed z-50 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 pointer-events-none"
            style={{ left: tooltipPosition.x + 20, top: tooltipPosition.y - 120, maxWidth: "300px" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-mono text-base font-bold text-zinc-900 dark:text-white">{hoveredProject.title}</div>
                <div className="font-mono text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {months[hoveredProject.month]} {hoveredProject.year}
                  <span className="mx-2">•</span>
                  {intensityLabels[hoveredProject.intensity as keyof typeof intensityLabels]}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-sm shrink-0 ml-2 ${intensityColors[hoveredProject.intensity as keyof typeof intensityColors]}`} />
            </div>
            <p className="font-mono text-sm text-zinc-600 dark:text-zinc-300 mb-3">{hoveredProject.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {hoveredProject.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs font-mono rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
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
