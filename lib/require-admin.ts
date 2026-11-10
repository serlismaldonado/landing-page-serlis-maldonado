import { api } from "@/convex/_generated/api";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";

// Verifica en el servidor que la sesión actual pertenece a un admin
// (lista ADMIN_EMAILS en las variables de entorno de Convex).
export async function isAdminRequest(): Promise<boolean> {
  try {
    if (!(await isAuthenticated())) return false;
    return await fetchAuthQuery(api.auth.isAdmin, {});
  } catch {
    return false;
  }
}
