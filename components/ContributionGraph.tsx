import { useState, useRef, useEffect, useMemo } from "react";

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const days = ["Lun", "", "Mié", "", "Vie", "", "Dom"];

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
    // Reserva el mismo espacio que el calendario para que la página no salte al cargar.
    return (
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-24">
        <div className="h-[112px] animate-pulse rounded-md bg-zinc-900" />
        <div className="h-10 w-48 animate-pulse rounded-md bg-zinc-900" />
      </section>
    );
  }

  return (
    // Misma cuadrícula que el hero: calendario a la izquierda, resumen en la columna derecha.
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-24">
      <div ref={containerRef} className="min-w-0 lg:order-none order-last">
        {/* Cuadrícula fluida: 52 semanas que ocupan todo el ancho disponible. */}
        <div className="overflow-x-auto">
          <div className="flex min-w-[520px] gap-2">
            <div className="grid grid-rows-7 gap-[3px] pb-5 pr-1 font-mono text-[10px] text-zinc-500">
              {days.map((day, index) => (
                <span key={index} className="flex items-center leading-none">
                  {day}
                </span>
              ))}
            </div>
            <div className="flex-1">
              <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                {weeks.map((week, weekIndex) =>
                  week.map((cell, dayIndex) => {
                    const colorClass = intensityColors[cell.intensity as keyof typeof intensityColors];
                    const isHovered = tooltipData?.date.toDateString() === cell.date.toDateString();
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`aspect-square rounded-[2px] transition-transform duration-150 ${colorClass} ${
                          cell.intensity > 0 ? "cursor-pointer hover:scale-125" : ""
                        } ${isHovered ? "scale-125" : ""}`}
                        onMouseEnter={(e) => cell.intensity > 0 && handleMouseEnter(cell.date, cell.intensity, cell.count, e)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  }),
                )}
              </div>
              <div className="mt-2 grid h-3 font-mono text-[10px] leading-3 text-zinc-500" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                {weeks.map((_, weekIndex) => (
                  <span key={weekIndex} className="overflow-visible whitespace-nowrap">
                    {monthLabels.find((m) => m.index === weekIndex)?.month ?? ""}
                  </span>
                ))}
              </div>
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
              {tooltipData.count} contribuciones
            </div>
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {tooltipData.date.toLocaleDateString("es-HN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-3">
        <div>
          <a
            href="https://github.com/serlismaldonado"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white transition-colors hover:text-zinc-300"
          >
            Actividad en GitHub →
          </a>
          <p className="mt-2 text-[15px] text-zinc-400">
            <span className="font-mono text-white">{totalContributions.toLocaleString("es-HN")}</span> contribuciones en el último año
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span>Menos</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={`h-2.5 w-2.5 rounded-[2px] ${intensityColors[level as keyof typeof intensityColors]}`} />
          ))}
          <span>Más</span>
        </div>
      </div>
    </section>
  );
}
