import type { APIRoute } from "astro";
import { authProxy } from "@/lib/auth-server";

export const prerender = false;

export const GET: APIRoute = ({ request }) => authProxy(request);
export const POST: APIRoute = ({ request }) => authProxy(request);
