import { query, mutation } from "../../_generated/server";
import { customQuery, customMutation } from "convex-helpers/server/customFunctions";
import { authComponent } from "../auth";

/**
 * Tipo para el contexto de query seguro
 */
export type SecureQueryCtx<Args = {}> = {
  db: typeof import("../../_generated/server").QueryCtx.db;
  user: ReturnType<typeof authComponent.getAuthUser> extends Promise<infer T> ? T : null;
};

/**
 * Tipo para el contexto de mutation seguro
 */
export type SecureMutationCtx<Args = {}> = {
  db: typeof import("../../_generated/server").MutationCtx.db;
  user: ReturnType<typeof authComponent.getAuthUser> extends Promise<infer T> ? T : null;
};

/**
 * Query builder que inyecta el usuario autenticado
 */
const queryBuilder = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    return {
      ctx: {
        ...ctx,
        user,
      } as SecureQueryCtx<typeof args>,
      args,
    };
  },
});

/**
 * Mutation builder que inyecta el usuario autenticado
 */
const mutationBuilder = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    return {
      ctx: {
        ...ctx,
        user,
      } as SecureMutationCtx<typeof args>,
      args,
    };
  },
});

export const secureQuery = queryBuilder;
export const secureMutation = mutationBuilder;

/**
 * Helper para verificar si el usuario está autenticado
 */
export function requireAuth(user: any): void {
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
}

/**
 * Helper para verificar si es super admin
 */
export function requireSuperAdmin(user: any): void {
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  // Better Auth tiene un campo isSuperAdmin o similar
  // Ajustar según la configuración
  if (user.role !== "super_admin" && !user.isSuperAdmin) {
    throw new Error("Forbidden: Super admin required");
  }
}
