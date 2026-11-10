import type { AnchorHTMLAttributes } from "react";

// Enlace simple: Astro navega con recargas normales (o View Transitions), no hace falta un router.
export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} />;
}
