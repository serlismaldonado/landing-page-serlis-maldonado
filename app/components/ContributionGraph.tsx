"use client";

import { useState, useRef, useEffect, useMemo } from "react";

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
const days = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

const intensityColors = {
  0: "bg-zinc-100 dark:bg-zinc-800",
  1: "bg-green-200 dark:bg-green-900",
  2: "bg-green-300 dark:bg-green-800",
  3: "bg-green-400 dark:bg-green-700",
  4: "bg-green-500 dark:bg-green-600",
};

interface ContributionDay {
  date: string;
  intensity: number;
  count: number;
}

export default function ContributionGraph() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState<{
    date: Date;
    intensity: number;
    count: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real contributions from GitHub API
  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("/api/contributions");
        const data = await res.json();
        if (data.contributions) {
          setContributions(data.contributions);
        }
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContributions();
  }, []);

  // Generate weeks with correct month labels (52 weeks to fit max-w-4xl)
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const weeksData = Array.from({ length: 52 }, (_, weekIndex) => {
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const targetDate = new Date(today);
        // Calculate date: start from today and go backwards
        // weekIndex 51 = most recent week (including today), weekIndex 0 = 51 weeks ago
        // dayIndex 0 = Monday, dayIndex 6 = Sunday
        // We want the most recent cell (weekIndex=51, dayIndex=0) to be today
        const daysOffset = (51 - weekIndex) * 7 + dayIndex;
        targetDate.setDate(targetDate.getDate() - daysOffset);

        const contribution = contributions.find((c) => {
          const contribDate = new Date(c.date);
          // Compare dates ignoring time and timezone
          const contribDateStr = contribDate.toISOString().split("T")[0];
          const targetDateStr = targetDate.toISOString().split("T")[0];
          return contribDateStr === targetDateStr;
        });
        return {
          date: targetDate,
          intensity: contribution?.intensity || 0,
          count: contribution?.count || 0,
        };
      });
    });

    // Generate month labels based on first day of each column
    const labels: { month: string; index: number }[] = [];
    weeksData.forEach((week, i) => {
      const firstDay = week[0]?.date;
      if (firstDay && firstDay.getDate() <= 7) {
        labels.push({ month: months[firstDay.getMonth()], index: i });
      }
    });

    return { weeks: weeksData, monthLabels: labels };
  }, [contributions]);

  // Calculate statistics
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0);
  const handleMouseEnter = (
    date: Date,
    intensity: number,
    count: number,
    e: React.MouseEvent,
  ) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const tooltipWidth = 200;
    const tooltipHeight = 80;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 15;
    const margin = 20;

    let tooltipX, tooltipY;

    // Si el cursor está en la mitad izquierda, tooltip a la derecha
    // Si está en la mitad derecha, tooltip a la izquierda
    if (mouseX < viewportWidth / 2) {
      // Cursor en mitad izquierda -> tooltip a la derecha
      tooltipX = mouseX + offset;
    } else {
      // Cursor en mitad derecha -> tooltip a la izquierda
      tooltipX = mouseX - tooltipWidth - offset;
    }

    // Asegurar que no se salga de los bordes
    tooltipX = Math.max(
      margin,
      Math.min(tooltipX, viewportWidth - tooltipWidth - margin),
    );

    // Posicionamiento vertical: arriba del cursor por defecto
    tooltipY = mouseY - tooltipHeight - offset;

    // Ajustar vertical si se sale del viewport
    if (tooltipY < margin) {
      tooltipY = mouseY + offset;
    } else if (tooltipY + tooltipHeight > viewportHeight - margin) {
      tooltipY = viewportHeight - tooltipHeight - margin;
    }

    setTooltipPosition({ x: tooltipX, y: tooltipY });
    setTooltipData({ date, intensity, count });
  };
  const handleMouseLeave = () => setTooltipData(null);

  if (loading) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Graph skeleton */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-1.5 min-w-fit">
              <div className="flex flex-col justify-between py-0.5 pr-2">
                {days.map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"
                  />
                ))}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 52 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="w-2.5 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 px-4">
      <div className="max-w-4xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="font-mono">
              {totalContributions} contributions
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-2.5 h-2.5 rounded-sm ${intensityColors[level as keyof typeof intensityColors]}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Graph container */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex gap-1 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col justify-between py-0.5 pr-2 text-[10px] text-zinc-400 font-mono">
                {days.map((day, index) => (
                  <span
                    key={index}
                    className="h-3 flex items-center justify-end"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Weeks grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {week.map((cell, dayIndex) => {
                      const colorClass =
                        intensityColors[
                          cell.intensity as keyof typeof intensityColors
                        ];
                      const isHovered =
                        tooltipData?.date.toDateString() ===
                        cell.date.toDateString();

                      return (
                        <div
                          key={dayIndex}
                          className={`w-2.5 h-2.5 rounded-sm transition-all duration-150 ${
                            colorClass
                          } ${cell.intensity > 0 ? "cursor-pointer hover:scale-125" : "cursor-default"} ${
                            isHovered ? "scale-125" : ""
                          }`}
                          onMouseEnter={(e) =>
                            cell.intensity > 0 &&
                            handleMouseEnter(
                              cell.date,
                              cell.intensity,
                              cell.count,
                              e,
                            )
                          }
                          onMouseLeave={handleMouseLeave}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Month labels - now inside scrollable container */}
            <div className="flex ml-9 mt-2 min-w-fit">
              {Array.from({ length: 52 }).map((_, weekIndex) => {
                const monthLabel = monthLabels.find(
                  (m) => m.index === weekIndex,
                );
                return (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-0.5 w-[14px]"
                  >
                    {monthLabel && (
                      <span className="font-mono text-[10px] text-zinc-400 h-3">
                        {monthLabel.month}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltipData && (
          <div
            className="fixed z-50 p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              maxWidth: "200px",
            }}
          >
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
              {tooltipData.count} contributions
            </div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {tooltipData.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
