import { defineSchema } from "convex/server";
import { projects } from "./projects";
import { passwordResetTokens } from "./passwordResetTokens";
import { emailTemplates } from "./emailTemplates";
import { siteSettings } from "./settings";

export default defineSchema({
  projects,
  passwordResetTokens,
  emailTemplates,
  siteSettings,
});
