// Temas del sitio. Para agregar uno: añádelo aquí y su id en convex/settings/functions.ts (THEME_IDS).
// - vars: sobreescriben las variables de color de styles.css (las que no se pongan quedan como Fjord).
// - trail: colores del fondo pixel art (pixeles que titilan y estela del mouse) y si nieva.
// - decor: decoraciones propias del tema en la home.

export type Rgb = [number, number, number];

export interface Theme {
  id: string;
  label: string;
  vars: Record<string, string>;
  themeColor: string;
  trail: { twinkle: [Rgb, Rgb, Rgb]; spark: [Rgb, Rgb, Rgb]; snow?: boolean };
  decor?: "navidad";
}

export const THEMES: Theme[] = [
  {
    id: "fjord",
    label: "Fjord (por defecto)",
    vars: {},
    themeColor: "#1b2028",
    trail: {
      twinkle: [[143, 188, 187], [136, 192, 208], [129, 161, 193]],
      spark: [[143, 210, 225], [129, 161, 193], [94, 129, 172]],
    },
  },
  {
    id: "navidad",
    label: "Navidad",
    themeColor: "#111a15",
    vars: {
      "--background": "#111a15",
      "--color-black": "#111a15",
      "--color-zinc-950": "#111a15",
      "--color-zinc-900": "#18241d",
      "--color-zinc-800": "#26372d",
      "--color-zinc-700": "#3a4f42",
      "--color-zinc-600": "#5b7064",
      "--color-zinc-500": "#84968a",
      "--color-zinc-400": "#aebbb2",
      "--color-zinc-300": "#d6dfd8",
      "--color-white": "#f4f7f2",
      // Acentos (roles, GitHub, nivel): verde pino.
      "--color-green-200": "#cfe8d4",
      "--color-green-300": "#a8d6b2",
      "--color-green-400": "#86c494",
      "--color-green-500": "#6cb47e",
      "--color-green-600": "#4f9763",
      "--color-green-700": "#3d7a4f",
      "--color-green-800": "#2f5f3e",
      "--color-green-900": "#22452e",
      // Botones: rojo navideño.
      "--color-accent": "#d9483b",
      "--color-accent-hover": "#e86a5e",
      "--color-accent-ink": "#fff8f2",
    },
    trail: {
      twinkle: [[255, 236, 170], [244, 247, 242], [255, 214, 120]],
      spark: [[217, 72, 59], [244, 247, 242], [108, 180, 126]],
      snow: true,
    },
    decor: "navidad",
  },
];

export const DEFAULT_THEME = THEMES[0];

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
}

export function themeCss(theme: Theme): string {
  const body = Object.entries(theme.vars)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  return body ? `:root{${body}}` : "";
}
