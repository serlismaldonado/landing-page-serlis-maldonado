// Genera public/serlis-mask.svg: máscara para que los bordes de la foto del hero
// se deshagan en pixeles. Uso: node scripts/photo-mask.mjs
import { writeFileSync } from "node:fs";

const COLS = 46, ROWS = 52, DEPTH = 5;
const hash = (a, b) => {
  const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

// El interior es un solo rectángulo; solo las celdas del borde van sueltas.
const cells = [`<rect x="${DEPTH}" y="${DEPTH}" width="${COLS - DEPTH * 2}" height="${ROWS - DEPTH * 2}"/>`];
for (let x = 0; x < COLS; x++) {
  for (let y = 0; y < ROWS; y++) {
    const d = Math.min(x, y, COLS - 1 - x, ROWS - 1 - y);
    if (d < DEPTH && hash(x, y) < (d + 1) / (DEPTH + 1)) cells.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`);
  }
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS} ${ROWS}" preserveAspectRatio="none" shape-rendering="crispEdges">${cells.join("")}</svg>\n`;
writeFileSync(new URL("../public/serlis-mask.svg", import.meta.url), svg);
console.log(`public/serlis-mask.svg: ${cells.length} rects, ${svg.length} bytes`);
