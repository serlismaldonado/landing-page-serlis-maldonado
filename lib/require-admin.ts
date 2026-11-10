import { api } from "@/convex/_generated/api";
import { fetchAuthQuery, getToken } from "@/lib/auth-server";

// Verifica en el servidor que la sesión de la petición pertenece a un admin
// (lista ADMIN_EMAILS en las variables de entorno de Convex).
export async function isAdminRequest(request: Request): Promise<boolean> {
  try {
    if (!(await getToken(request))) return false;
    return await fetchAuthQuery(request, api.auth.isAdmin, {});
  } catch {
    return false;
  }
}
