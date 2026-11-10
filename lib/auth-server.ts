import { getToken as getBetterAuthToken } from "@convex-dev/better-auth/utils";
import { ConvexHttpClient } from "convex/browser";
import type { FunctionArgs, FunctionReference } from "convex/server";
import { serverEnv } from "./env";

// Lo mismo que hacía convexBetterAuthNextJs, sin depender de Next.
const convexUrl = () => serverEnv("NEXT_PUBLIC_CONVEX_URL")!;
const convexSiteUrl = () => {
  const url = serverEnv("NEXT_PUBLIC_CONVEX_SITE_URL");
  if (!url || url.endsWith(".convex.cloud")) {
    throw new Error("NEXT_PUBLIC_CONVEX_SITE_URL debe ser la URL .convex.site de Convex");
  }
  return url;
};

// Reenvía /api/auth/* a Better Auth, que corre dentro de Convex.
export function authProxy(request: Request) {
  const siteUrl = convexSiteUrl();
  const { pathname, search } = new URL(request.url);
  const proxied = new Request(`${siteUrl}${pathname}${search}`, request);
  proxied.headers.set("accept-encoding", "application/json");
  proxied.headers.set("host", new URL(siteUrl).host);
  return fetch(proxied, { method: request.method, redirect: "manual" });
}

// JWT de Convex para la sesión de esta petición (a partir de sus cookies).
export async function getToken(request: Request): Promise<string | undefined> {
  const { token } = await getBetterAuthToken(convexSiteUrl(), request.headers);
  return token ?? undefined;
}

export async function fetchAuthQuery<Q extends FunctionReference<"query">>(
  request: Request,
  query: Q,
  args: FunctionArgs<Q>,
) {
  const client = new ConvexHttpClient(convexUrl());
  const token = await getToken(request);
  if (token) client.setAuth(token);
  return client.query(query, args);
}

// Consultas públicas desde el servidor (sin sesión).
export function publicQuery<Q extends FunctionReference<"query">>(query: Q, args: FunctionArgs<Q>) {
  return new ConvexHttpClient(convexUrl()).query(query, args);
}
