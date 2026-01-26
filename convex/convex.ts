import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth";

const app = defineApp();

app.use(betterAuth);

export default app;
