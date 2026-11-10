/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as emailTemplates_index from "../emailTemplates/index.js";
import type * as http from "../http.js";
import type * as passwordResetTokens_index from "../passwordResetTokens/index.js";
import type * as projects_index from "../projects/index.js";
import type * as projects_mutations from "../projects/mutations.js";
import type * as projects_queries from "../projects/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "emailTemplates/index": typeof emailTemplates_index;
  http: typeof http;
  "passwordResetTokens/index": typeof passwordResetTokens_index;
  "projects/index": typeof projects_index;
  "projects/mutations": typeof projects_mutations;
  "projects/queries": typeof projects_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
