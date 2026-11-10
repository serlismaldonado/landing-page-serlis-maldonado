import type { AstroGlobal } from "astro";
import { isAdminRequest } from "@/lib/require-admin";

// Todas las páginas de /admin: sin sesión de admin, al login.
export async function requireAdminPage(Astro: AstroGlobal) {
  if (!(await isAdminRequest(Astro.request))) return Astro.redirect("/login");
  Astro.response.headers.set("Cache-Control", "private, no-store");
  return null;
}
