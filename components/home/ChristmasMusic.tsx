import { useEffect, useRef, useState } from "react";

// Villancicos 8-bit, como los de las luces navideñas: onda cuadrada sintetizada con Web Audio.
// Melodías tradicionales de dominio público. Activado por defecto: suena en cuanto el navegador lo
// permite (al cargar si deja, si no con el primer clic/toque/tecla). Si el visitante lo apaga, se recuerda.

type Note = [pitch: string | null, beats: number];

const SONGS: { tempo: number; notes: Note[] }[] = [
  // Jingle Bells (estribillo)
  {
    tempo: 190,
    notes: [
      ["E5", 1], ["E5", 1], ["E5", 2], ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4],
      ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5], ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
      ["E5", 1], ["D5", 1], ["D5", 1], ["E5", 1], ["D5", 2], ["G5", 2],
      ["E5", 1], ["E5", 1], ["E5", 2], ["E5", 1], ["E5", 1], ["E5", 2],
      ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4],
      ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5], ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
      ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1], ["C5", 4],
    ],
  },
  // We Wish You a Merry Christmas
  {
    tempo: 170,
    notes: [
      ["G4", 1],
      ["C5", 1], ["C5", 0.5], ["D5", 0.5], ["C5", 0.5], ["B4", 0.5], ["A4", 1], ["A4", 1],
      ["A4", 1], ["D5", 1], ["D5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 0.5], ["B4", 1], ["G4", 1],
      ["G4", 1], ["E5", 1], ["E5", 0.5], ["F5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 1], ["A4", 1],
      ["G4", 0.5], ["G4", 0.5], ["A4", 1], ["D5", 1], ["B4", 1], ["C5", 3],
    ],
  },
  // Noche de paz (Silent Night)
  {
    tempo: 110,
    notes: [
      ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
      ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
      ["D5", 2], ["D5", 1], ["B4", 3],
      ["C5", 2], ["C5", 1], ["G4", 3],
      ["A4", 2], ["A4", 1], ["C5", 1.5], ["B4", 0.5], ["A4", 1],
      ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
      ["A4", 2], ["A4", 1], ["C5", 1.5], ["B4", 0.5], ["A4", 1],
      ["G4", 1.5], ["A4", 0.5], ["G4", 1], ["E4", 3],
      ["D5", 2], ["D5", 1], ["F5", 1.5], ["D5", 0.5], ["B4", 1],
      ["C5", 3], ["E5", 3],
      ["C5", 1], ["G4", 1], ["E4", 1], ["G4", 1.5], ["F4", 0.5], ["D4", 1], ["C4", 6],
    ],
  },
];

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function freq(pitch: string) {
  const name = pitch[0];
  const octave = Number(pitch.slice(-1));
  const sharp = pitch.includes("#") ? 1 : 0;
  const midi = 12 * (octave + 1) + SEMITONES[name] + sharp;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

const STORAGE_KEY = "villancicos";
const VOLUME = 0.035;

// playing: sonando · blocked: el navegador espera una interacción · off: apagado por el visitante
type Status = "playing" | "blocked" | "off";

export default function ChristmasMusic() {
  const [status, setStatus] = useState<Status>("blocked");
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number>(0);

  const stop = () => {
    window.clearTimeout(timerRef.current);
    ctxRef.current?.close();
    ctxRef.current = null;
  };

  const start = () => {
    stop();
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);

    // Programa una canción completa y, al terminar, la siguiente (en bucle).
    const play = (index: number) => {
      if (ctxRef.current !== ctx) return;
      const song = SONGS[index % SONGS.length];
      const beat = 60 / song.tempo;
      let t = ctx.currentTime + 0.1;
      for (const [pitch, beats] of song.notes) {
        const dur = beats * beat;
        if (pitch) {
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.type = "square";
          osc.frequency.value = freq(pitch);
          // Notas cortas y "picadas", como un chip de luces navideñas.
          env.gain.setValueAtTime(0, t);
          env.gain.linearRampToValueAtTime(1, t + 0.01);
          env.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur * 0.9, 0.6));
          osc.connect(env).connect(master);
          osc.start(t);
          osc.stop(t + dur);
        }
        t += dur;
      }
      const total = t - ctx.currentTime;
      timerRef.current = window.setTimeout(() => play(index + 1), (total + 1.5) * 1000);
    };

    // Si el navegador tiene el audio en pausa hasta que haya interacción, empezar cuando lo libere.
    if (ctx.state === "running") {
      setStatus("playing");
      play(0);
    } else {
      setStatus("blocked");
      ctx.onstatechange = () => {
        if (ctx.state === "running") {
          ctx.onstatechange = null;
          setStatus("playing");
          play(0);
        }
      };
    }
  };

  // Activado por defecto (salvo que el visitante lo haya apagado antes).
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "off") {
      setStatus("off");
      return;
    }
    start();
    // Eventos que el navegador acepta como interacción para permitir audio (touchend, no touchstart).
    const events = ["pointerup", "touchend", "keydown", "click"] as const;
    const unlock = () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state === "suspended") ctx.resume();
      if (ctx?.state === "running") events.forEach((e) => window.removeEventListener(e, unlock));
    };
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock));
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = () => {
    if (status === "blocked") {
      // Este clic ya desbloquea el audio: no lo apagamos.
      ctxRef.current?.resume();
      return;
    }
    if (status === "playing") {
      localStorage.setItem(STORAGE_KEY, "off");
      stop();
      setStatus("off");
      return;
    }
    localStorage.setItem(STORAGE_KEY, "on");
    start();
  };

  const label =
    status === "blocked" ? "♪ Toca para escuchar villancicos" : status === "playing" ? "♪ Villancicos: sí" : "♪ Villancicos";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={status === "playing"}
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-zinc-900 ${
        status === "off" ? "text-zinc-500 hover:text-zinc-300" : "text-white"
      }`}
      title={status === "playing" ? "Silenciar villancicos" : "Escuchar villancicos"}
    >
      {status === "blocked" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />}
      {label}
    </button>
  );
}
