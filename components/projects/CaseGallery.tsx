import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { optimizedImage } from "@/lib/image";

// Galería del caso de estudio: una imagen grande y luego de a pares, alternando proporciones.
// Al hacer clic se abre en pantalla completa (flechas y Esc para navegar).
export default function CaseGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (images.length === 0) return null;

  // Filas: [grande], [par], [grande], [par]...
  const rows: number[][] = [];
  for (let i = 0; i < images.length; ) {
    const big = rows.length % 2 === 0 || i === images.length - 1;
    rows.push(big ? [i] : [i, i + 1]);
    i += big ? 1 : 2;
  }

  const tile = (i: number, cls: string, width: number) => (
    <button
      key={i}
      type="button"
      onClick={() => setOpen(i)}
      className={`group relative overflow-hidden rounded-[10px] bg-zinc-900 ${cls}`}
      aria-label={`Ver imagen ${i + 1} de ${title}`}
    >
      <img
        src={optimizedImage(images[i], width)}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />
    </button>
  );

  return (
    <>
      <div className="grid gap-3.5">
        {rows.map((row, r) =>
          row.length === 1 ? (
            tile(row[0], "aspect-[16/9] w-full", 1920)
          ) : (
            <div key={r} className={`grid gap-3.5 sm:grid-cols-[1.4fr_1fr] ${r % 4 === 3 ? "sm:grid-cols-[1fr_1.4fr]" : ""}`}>
              {row.map((i) => tile(i, "aspect-[4/3] sm:aspect-auto sm:h-[380px]", 960))}
            </div>
          ),
        )}
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={close}>
          <img
            src={optimizedImage(images[open], 1920)}
            alt={`${title} — imagen ${open + 1}`}
            className="max-h-[88vh] max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" onClick={close} className="absolute right-5 top-5 rounded-full p-2 text-zinc-300 hover:bg-white/10" aria-label="Cerrar">
            <X className="h-6 w-6" />
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 rounded-full p-2 text-zinc-300 hover:bg-white/10" aria-label="Anterior">
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 rounded-full p-2 text-zinc-300 hover:bg-white/10" aria-label="Siguiente">
                <ChevronRight className="h-7 w-7" />
              </button>
              <span className="absolute bottom-5 font-mono text-xs text-zinc-400">
                {String(open + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
}
