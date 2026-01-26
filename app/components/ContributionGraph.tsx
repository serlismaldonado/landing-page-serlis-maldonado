"use client";

import { useState, useRef, useEffect, useMemo } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  const [tooltipData, setTooltipData] = useState<{ date: Date; intensity: number; count: number } | null>(null);
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
    const weeksData = Array.from({ length: 52 }, (_, weekIndex) => {
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - (51 - weekIndex) * 7 - (6 - dayIndex));
        const contribution = contributions.find((c) => {
          const contribDate = new Date(c.date);
          return contribDate.toDateString() === targetDate.toDateString();
        });
        return { date: targetDate, intensity: contribution?.intensity || 0, count: contribution?.count || 0 };
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

  const handleMouseEnter = (date: Date, intensity: number, count: number, e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
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
                  <div key={i} className="w-2.5 h-2.5 rounded-sm bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Graph skeleton */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-1.5 min-w-fit">
              <div className="flex flex-col justify-between py-0.5 pr-2">
                {days.map((_, i) => (
                  <div key={i} className="h-3 w-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 52 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <div key={dayIndex} className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
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
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto" ref={containerRef}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="font-mono text-lg font-bold text-zinc-900 dark:text-white">
            Contribution Graph
          </h2>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="font-mono">{totalContributions} contributions</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-2.5 h-2.5 rounded-sm ${intensityColors[level as keyof typeof intensityColors]}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Graph container */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <div className="flex gap-1.5 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col justify-between py-0.5 pr-2 text-[10px] text-zinc-400 font-mono">
                {days.map((day, index) => (
                  <span key={index} className="h-3 flex items-center justify-end">{day}</span>
                ))}
              </div>

              {/* Weeks grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((cell, dayIndex) => {
                      const colorClass = intensityColors[cell.intensity as keyof typeof intensityColors];
                      const isHovered = tooltipData?.date.toDateString() === cell.date.toDateString();

                      return (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm transition-all duration-150 ${
                            colorClass
                          } ${cell.intensity > 0 ? "cursor-pointer hover:scale-125" : "cursor-default"} ${
                            isHovered ? "scale-125" : ""
                          }`}
                          onMouseEnter={(e) => cell.intensity > 0 && handleMouseEnter(cell.date, cell.intensity, cell.count, e)}
                          onMouseLeave={handleMouseLeave}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Month labels */}
          <div className="flex gap-1 ml-9 mt-2 relative">
            {monthLabels.map(({ month, index }) => (
              <span
                key={`${month}-${index}`}
                className="font-mono text-[10px] text-zinc-400 absolute"
                style={{ left: `${index * 14 + 3}px` }}
              >
                {month}
              </span>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {tooltipData && (
          <div
            className="fixed z-50 p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 pointer-events-none"
            style={{ left: tooltipPosition.x + 15, top: tooltipPosition.y - 100, maxWidth: "200px" }}
          >
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
              {tooltipData.count} contributions
            </div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {tooltipData.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
