import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query, type QueryCtx, type MutationCtx } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

// Emails con acceso al admin, separados por coma (variable de entorno de Convex).
// Si no está definida, nadie es admin: falla cerrado.
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: { enabled: false },
    trustedOrigins: [
      "https://www.serlismaldonado.com",
      "https://serlismaldonado.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    plugins: [
      convex({ authConfig }),
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        // Solo cuentas existentes pueden iniciar sesión; nadie puede registrarse.
        disableSignUp: true,
        async sendVerificationOTP({ email, otp }) {
          // No mandamos códigos a emails que no son admin (evita spam desde el login).
          if (!isAdminEmail(email)) return;
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Serlis <hola@serlismaldonado.com>",
            to: email,
            subject: "Tu código de acceso",
            html: `
              <div style="background:#0a0a0a;color:#ededed;font-family:monospace;padding:32px;max-width:480px;margin:0 auto;">
                <p style="font-size:13px;color:#71717a;margin:0 0 16px 0;">serlismaldonado.com</p>
                <h1 style="color:#fff;margin:0 0 8px 0;font-size:22px;font-weight:700;">Tu código de acceso</h1>
                <p style="font-size:14px;color:#a1a1aa;margin:0 0 24px 0;">Ingresá este código para iniciar sesión:</p>
                <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:24px;text-align:center;margin:0 0 24px 0;">
                  <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#fff;">${otp}</span>
                </div>
                <p style="font-size:13px;color:#52525b;">Expira en 5 minutos. Si no solicitaste este código, ignorá este email.</p>
              </div>
            `,
          });
        },
      }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});

// Lanza si el usuario no está autenticado o no es admin.
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) {
    throw new Error("Unauthorized: Please sign in to access this resource");
  }
  if (!isAdminEmail(user.email)) {
    throw new Error("Forbidden: admin only");
  }
  return user;
}

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    return isAdminEmail(user?.email);
  },
});
