import { defineSchema } from "convex/server";
import { projects } from "./projects";
import { emailTemplates } from "./emailTemplates";
import { passwordResetTokens } from "./passwordResetTokens";

export default defineSchema({
  projects,
  emailTemplates,
  passwordResetTokens,
});
