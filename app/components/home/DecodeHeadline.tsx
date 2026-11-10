"use client";

import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useRef, useState } from "react";

// Titular que se "decodifica" línea por línea desde pixeles aleatorios.
// pretext calcula los cortes de línea sin medir el DOM, así el texto no salta
// mientras cambian los caracteres.
const GLYPHS = "█▓▒░#@%&*+=-:.";
const LINE_DELAY = 420;
const LINE_DURATION = 700;

type Props = { text: string; className?: string };

export default function DecodeHeadline({ text, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [lineHeight, setLineHeight] = useState(0);

  // Corta el texto en líneas con pretext usando la fuente real del elemento.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let prepared: ReturnType<typeof prepareWithSegments> | null = null;
    let lastWidth = -1;

    const measure = async () => {
      // Solo un cambio de ancho cambia los cortes (el alto lo fijamos nosotros).
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      const style = getComputedStyle(el);
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      await document.fonts.load(font);
      if (cancelled) return;
      const letterSpacing = parseFloat(style.letterSpacing) || 0;
      const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.05;
      prepared ??= prepareWithSegments(text, font, { letterSpacing });
      const result = layoutWithLines(prepared, el.clientWidth, lh);
      setLineHeight(lh);
      const next = result.lines.map((l) => l.text.trimEnd());
      // Mismos cortes: no reiniciar la animación.
      setLines((prev) => (prev && prev.join("\n") === next.join("\n") ? prev : next));
    };

    measure();
    // Al cambiar el ancho solo se rehace el layout, no la medición.
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [text]);

  // Animación de decodificado.
  useEffect(() => {
    if (!lines) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrames(lines);
      return;
    }
    const start = performance.now();
    let timer = 0;
    const tick = () => {
      const now = performance.now() - start;
      let done = true;
      const next = lines.map((line, i) => {
        const p = Math.max(0, Math.min(1, (now - 250 - i * LINE_DELAY) / LINE_DURATION));
        if (p < 1) done = false;
        if (p === 0) return "";
        const solid = Math.floor(p * line.length);
        let out = "";
        for (let k = 0; k < line.length; k++) {
          const ch = line[k];
          out += k < solid || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        return out;
      });
      setFrames(next);
      if (!done) timer = window.setTimeout(tick, 33);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [lines]);

  return (
    <h1
      ref={ref}
      aria-label={text}
      className={`relative ${className ?? ""}`}
      style={lines ? { height: lines.length * lineHeight } : undefined}
    >
      {lines ? (
        lines.map((line, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute left-0 whitespace-pre ${frames[i] === line ? "text-white" : "text-green-400"}`}
            style={{ top: i * lineHeight }}
          >
            {frames[i] ?? ""}
          </span>
        ))
      ) : (
        // Antes de medir, el texto real (sin animación) para que no haya salto ni hueco.
        <span className="invisible">{text}</span>
      )}
    </h1>
  );
}
