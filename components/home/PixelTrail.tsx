import { useEffect, useRef } from "react";

// Fondo pixel art: pixeles que titilan y una estela de chispas que deja el cursor.
// Pixeles de fondo en los azules hielo de Fjord; la estela en los tonos cálidos de Ember.
const CELL = 10;
const STOPS: [number, number, number][] = [
  [143, 188, 187],
  [136, 192, 208],
  [129, 161, 193],
];
const EMBER: [number, number, number][] = [
  [235, 203, 139],
  [232, 135, 91],
  [208, 112, 92],
];
const MAX_PARTICLES = 600;

type Rgb = [number, number, number];
type Particle = { x: number; y: number; vx: number; vy: number; life: number; col: Rgb };

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function gradient(stops: Rgb[], u: number): Rgb {
  const t = Math.max(0, Math.min(1, u));
  return t < 0.5 ? mix(stops[0], stops[1], t * 2) : mix(stops[1], stops[2], (t - 0.5) * 2);
}
const brand = (u: number) => gradient(STOPS, u);
const ember = (u: number) => gradient(EMBER, u);

function hash(a: number, b: number) {
  const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export default function PixelTrail({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = [];
    const pointer = { x: 0, y: 0, speed: 0, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.speed = pointer.active ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
      pointer.x = x;
      pointer.y = y;
      pointer.active = y >= 0 && y <= rect.height;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const pixel = (x: number, y: number, col: Rgb, alpha: number) => {
      ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${alpha})`;
      ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);

      // Pixeles que titilan de fondo.
      const twinkles = Math.floor(cols * rows * 0.004);
      for (let i = 0; i < twinkles; i++) {
        const c = Math.floor(hash(i, 1) * cols);
        const r = Math.floor(hash(i, 2) * rows);
        const a = reduceMotion ? 0.18 : Math.max(0, Math.sin(t * 0.002 + i)) * 0.35;
        if (a > 0.05) pixel(c, r, brand(c / cols), a);
      }

      // Nuevas chispas en la posición del cursor.
      if (pointer.active && !reduceMotion) {
        const count = 1 + Math.min(6, pointer.speed / 6);
        for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
          particles.push({
            x: pointer.x + (Math.random() - 0.5) * 30,
            y: pointer.y + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 1.4,
            vy: Math.random() * 0.8,
            life: 1,
            col: ember(pointer.x / width),
          });
        }
        pointer.speed *= 0.6;
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.life -= 0.012;
      }
      while (particles.length && particles[0].life <= 0) particles.shift();
      for (const p of particles) {
        if (p.life > 0) pixel(Math.round(p.x / CELL), Math.round(p.y / CELL), p.col, p.life);
      }
    };

    const loop = (t: number) => {
      draw(t);
      frame = visible ? requestAnimationFrame(loop) : 0;
    };

    // Solo animar mientras el hero está en pantalla.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(loop);
    });

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
