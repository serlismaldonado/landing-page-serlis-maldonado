"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  const [hoveredCell, setHoveredCell] = useState<{
    project: (typeof projects)[0] | null;
    x: number;
    y: number;
  }>({
    project: null,
    x: 0,
    y: 0,
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  // Generate weeks for display (last 52 weeks)
  const weeks = Array.from({ length: 52 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (51 - weekIndex) * 7 - (6 - dayIndex));

      const project = projects.find(
        (p) => p.year === date.getFullYear() && p.month === date.getMonth(),
      );

      return {
        date,
        project: project || null,
        intensity: project?.intensity || 0,
      };
    });
  });

  // Filter projects based on selected tags (for future use)
  // const filteredProjects =
  //   selectedTags.length > 0
  //     ? projects.filter((project) =>
  //         selectedTags.some((tag) => project.tags.includes(tag)),
  //       )
  //     : projects;

  // Get all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  ).sort();

  // Calculate statistics
  const totalProjects = projects.length;
  const totalContributions = projects.reduce((sum, p) => sum + p.intensity, 0);
  const averageIntensity = (totalContributions / totalProjects).toFixed(1);

  // Position tooltip to stay within viewport
  useEffect(() => {
    if (hoveredCell.project && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) return;

      let x = hoveredCell.x + 20;
      let y = hoveredCell.y - 100;

      // Adjust if tooltip would go off right edge
      if (x + tooltip.offsetWidth > rect.width) {
        x = hoveredCell.x - tooltip.offsetWidth - 10;
      }

      // Adjust if tooltip would go off top edge
      if (y < 0) {
        y = hoveredCell.y + 20;
      }

      setHoveredCell((prev) => ({ ...prev, x, y }));
    }
  }, [hoveredCell.project, hoveredCell.x, hoveredCell.y]);

  const handleMouseEnter = (
    project: (typeof projects)[0] | null,
    e: React.MouseEvent,
  ) => {
    if (project) {
      const rect = containerRef.current?.getBoundingClientRect();
      setHoveredCell({
        project,
        x: e.clientX - (rect?.left || 0),
        y: e.clientY - (rect?.top || 0),
      });
      setTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
    setTimeout(() => {
      if (!tooltipVisible) {
        setHoveredCell({ project: null, x: 0, y: 0 });
      }
    }, 150);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleCellClick = (project: (typeof projects)[0] | null) => {
    if (project && project.url !== "#") {
      const url = project.url.startsWith("http")
        ? project.url
        : `https://${project.url}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!hoveredCell.project || !cellRefs.current.length) return;

      const currentWeekIndex = weeks.findIndex((week) =>
        week.some((cell) => cell.project?.title === hoveredCell.project?.title),
      );
      const currentDayIndex = weeks[currentWeekIndex]?.findIndex(
        (cell) => cell.project?.title === hoveredCell.project?.title,
      );

      if (currentWeekIndex === -1 || currentDayIndex === -1) return;

      let newWeekIndex = currentWeekIndex;
      let newDayIndex = currentDayIndex;

      switch (e.key) {
        case "ArrowUp":
          newDayIndex = Math.max(0, currentDayIndex - 1);
          break;
        case "ArrowDown":
          newDayIndex = Math.min(6, currentDayIndex + 1);
          break;
        case "ArrowLeft":
          newWeekIndex = Math.max(0, currentWeekIndex - 1);
          break;
        case "ArrowRight":
          newWeekIndex = Math.min(51, currentWeekIndex + 1);
          break;
        case "Enter":
        case " ":
          if (hoveredCell.project) {
            handleCellClick(hoveredCell.project);
          }
          return;
        case "Escape":
          setHoveredCell({ project: null, x: 0, y: 0 });
          setTooltipVisible(false);
          return;
        default:
          return;
      }

      const newCell = weeks[newWeekIndex]?.[newDayIndex];
      if (newCell?.project) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setHoveredCell({
            project: newCell.project,
            x: rect.width * (newWeekIndex / 52) + 50,
            y: rect.height * (newDayIndex / 7) + 100,
          });
          setTooltipVisible(true);

          // Focus the cell for screen readers
          cellRefs.current[newWeekIndex]?.[newDayIndex]?.focus();
        }
      }
    },
    [hoveredCell.project, weeks],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Initialize cell refs
  useEffect(() => {
    cellRefs.current = weeks.map(() => []);
  }, [weeks]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        {/* Header with stats and controls */}
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
          <div className="flex flex-wrap gap-4">
            <div className="text-center">
              <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">
                {totalProjects}
              </div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Projects
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">
                {totalContributions}
              </div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Total Activity
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">
                {averageIntensity}
              </div>
              <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Avg. Intensity
              </div>
            </div>
          </div>
        </div>

        {/* Tag filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
              Filter by technology:
            </span>
            <button
              onClick={() => setSelectedTags([])}
              className={`font-mono text-xs px-3 py-1 rounded-full transition-colors ${
                selectedTags.length === 0
                  ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 ring-2 ring-green-300 dark:ring-green-700"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Graph container */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800">
          {/* Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                Activity level:
              </span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="flex flex-col items-center gap-1"
                    title={
                      intensityLabels[level as keyof typeof intensityLabels]
                    }
                  >
                    <div
                      className={`w-4 h-4 rounded-sm ${intensityColors[level as keyof typeof intensityColors]}`}
                    />
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              Hover or use arrow keys to navigate • Click or press Enter/Space
              to visit project
            </div>
          </div>

          {/* Graph */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col justify-between py-1 pr-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                {days.map((day, index) => (
                  <span
                    key={index}
                    className="h-4 flex items-center justify-end"
                    aria-label={day}
                  >
                    {index % 2 === 0 ? day : ""}
                  </span>
                ))}
              </div>

              {/* Weeks grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((cell, dayIndex) => {
                      const colorClass =
                        intensityColors[
                          cell.intensity as keyof typeof intensityColors
                        ];
                      const isFiltered =
                        cell.project && selectedTags.length > 0
                          ? selectedTags.some((tag) =>
                              cell.project!.tags.includes(tag),
                            )
                          : true;
                      const isHovered =
                        hoveredCell.project?.title === cell.project?.title;

                      return (
                        <button
                          key={dayIndex}
                          ref={(el) => {
                            if (!cellRefs.current[weekIndex]) {
                              cellRefs.current[weekIndex] = [];
                            }
                            cellRefs.current[weekIndex][dayIndex] = el;
                          }}
                          className={`w-4 h-4 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 ${
                            colorClass
                          } ${
                            cell.project && isFiltered
                              ? "cursor-pointer hover:scale-110 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600 hover:shadow-sm"
                              : "cursor-default"
                          } ${!isFiltered ? "opacity-30" : ""} ${
                            isHovered
                              ? "ring-2 ring-zinc-500 dark:ring-zinc-400 scale-110 shadow-sm"
                              : ""
                          }`}
                          onMouseEnter={(e) =>
                            handleMouseEnter(cell.project, e)
                          }
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleCellClick(cell.project)}
                          onFocus={(e) => {
                            if (cell.project) {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const containerRect =
                                containerRef.current?.getBoundingClientRect();
                              if (containerRect) {
                                setHoveredCell({
                                  project: cell.project,
                                  x:
                                    rect.left -
                                    containerRect.left +
                                    rect.width / 2,
                                  y:
                                    rect.top -
                                    containerRect.top +
                                    rect.height / 2,
                                });
                                setTooltipVisible(true);
                              }
                            }
                          }}
                          onBlur={() => {
                            if (!tooltipVisible) {
                              setTimeout(() => {
                                setHoveredCell({ project: null, x: 0, y: 0 });
                              }, 100);
                            }
                          }}
                          tabIndex={cell.project && isFiltered ? 0 : -1}
                          aria-label={
                            cell.project
                              ? `${cell.project.title}, ${intensityLabels[cell.intensity as keyof typeof intensityLabels]}, ${months[cell.date.getMonth()]} ${cell.date.getFullYear()}. Press arrow keys to navigate, Enter or Space to visit project, Escape to close tooltip.`
                              : `No activity on ${cell.date.toLocaleDateString()}`
                          }
                          title={
                            cell.project
                              ? `${cell.project.title} (${months[cell.date.getMonth()]} ${cell.date.getFullYear()}) - ${intensityLabels[cell.intensity as keyof typeof intensityLabels]}`
                              : `No activity on ${cell.date.toLocaleDateString()}`
                          }
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
              <span
                key={month}
                className="font-mono text-xs text-zinc-400 dark:text-zinc-500 flex-1 text-center"
              >
                {i % 2 === 0 ? month : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Year indicators */}
        <div className="flex justify-between mt-4 px-2">
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {new Date().getFullYear() - 1}
          </span>
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {new Date().getFullYear()}
          </span>
        </div>

        {/* Enhanced Tooltip */}
        {hoveredCell.project && (
          <div
            ref={tooltipRef}
            className={`fixed z-50 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 pointer-events-none transition-all duration-200 ${
              tooltipVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
            role="tooltip"
            aria-live="polite"
            aria-label={`Project details: ${hoveredCell.project.title}`}
            style={{
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
              maxWidth: "320px",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-mono text-base font-bold text-zinc-900 dark:text-white">
                  {hoveredCell.project.title}
                </div>
                <div className="font-mono text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {months[hoveredCell.project.month]} {hoveredCell.project.year}
                  <span className="mx-2">•</span>
                  {
                    intensityLabels[
                      hoveredCell.project
                        .intensity as keyof typeof intensityLabels
                    ]
                  }
                </div>
              </div>
              <div
                className={`w-3 h-3 rounded-sm shrink-0 ml-2 ${intensityColors[hoveredCell.project.intensity as keyof typeof intensityColors]}`}
              />
            </div>

            <p className="font-mono text-sm text-zinc-600 dark:text-zinc-300 mb-3">
              {hoveredCell.project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {hoveredCell.project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs font-mono rounded-full ${
                    selectedTags.includes(tag)
                      ? "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {hoveredCell.project.url !== "#" && (
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-700">
                <ExternalLink className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <a
                  href={`https://${hoveredCell.project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors truncate"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Visit ${hoveredCell.project.title}, opens in new tab`}
                  title={`Visit ${hoveredCell.project.title} (opens in new tab)`}
                >
                  {hoveredCell.project.url}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Keyboard instructions for screen readers */}
        <div className="sr-only" aria-live="polite">
          {hoveredCell.project
            ? `Selected: ${hoveredCell.project.title}. Use arrow keys to navigate between projects, Enter or Space to visit, Escape to close.`
            : "No project selected. Use Tab to navigate to cells with projects."}
        </div>
      </div>
    </section>
  );
}
