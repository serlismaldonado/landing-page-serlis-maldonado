import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: [".claude/**", ".pi/**", "dist/**", ".astro/**", ".vercel/**", ".next/**", "node_modules/**", "convex/_generated/**"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    // Mismo nivel que tenía eslint-config-next: reglas clásicas de hooks y variables sin usar como aviso.
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
);
