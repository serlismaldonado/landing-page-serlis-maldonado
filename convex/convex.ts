import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp();

app.use(betterAuth, {
  componentDefinitionPath: "convex/convex.ts",
});

export default app;
