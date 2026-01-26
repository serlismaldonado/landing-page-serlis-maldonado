import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import schema from "./schema";

const app = defineApp();

app.use(betterAuth);

export default app;
