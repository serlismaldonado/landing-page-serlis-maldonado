---
name: convex-ai-best-practices
description: Convex best practices for AI code generation - TypeScript queries, transactional guarantees, automatic reactivity, and project structure
---

# Convex AI Best Practices

Apply these guidelines when writing or reviewing Convex code.

## Core Principles

Convex is designed for AI-generated code with strong guarantees:

### 1. Queries are Just TypeScript
- Database queries are pure TypeScript functions with end-to-end type safety
- No SQL needed—TypeScript is the query language
- IDE support and autocomplete work automatically
- Makes it easy for AI to generate correct database code

### 2. Less Code for the Same Work
- Automatic infrastructure management reduces boilerplate
- Less code = fewer bugs to introduce
- Focus on business logic instead of plumbing

### 3. Automatic Reactivity
- Reactive system automatically tracks data dependencies
- UI updates automatically—no manual subscriptions needed
- No WebSocket management or state synchronization boilerplate
- Convex handles all connectivity concerns

### 4. Transactional Guarantees
- Queries are read-only
- Mutations run in transactions
- Nearly impossible to corrupt data or create inconsistent state
- AI can't accidentally introduce data bugs

## Project Structure

Standard Convex project layout:

```
project-root/
├── convex/
│   ├── _generated/         # Auto-generated files
│   │   └── ai/
│   │       └── guidelines.md
│   ├── schema.ts           # TypeSchema definition
│   ├── functions.ts        # Queries and mutations
│   ├── lib/                # Helpers and utilities
│   └── http.ts             # HTTP endpoints (optional)
├── src/
│   ├── components/         # React components
│   └── hooks/              # Custom hooks
├── convex.json             # Convex config
└── package.json
```

## Queries and Mutations

### Query Example
```typescript
import { query } from "./_generated/server"

export const listItems = query(async (ctx) => {
  return await ctx.db.query("items").collect()
})
```

### Mutation Example
```typescript
import { mutation } from "./_generated/server"

export const addItem = mutation(async (ctx, { name }) => {
  const itemId = await ctx.db.insert("items", { name })
  return itemId
})
```

### Key Points
- Use `ctx.db.query()`, `ctx.db.insert()`, `ctx.db.update()`, `ctx.db.delete()`
- All database operations are transactional
- Type-safe arguments and return values
- Always return serializable data (no functions, Date objects, etc.)

## Schema Definition

```typescript
import { defineSchema, defineTable, v } from "convex/values"

export default defineSchema({
  items: defineTable({
    name: v.string(),
    completed: v.boolean(),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
  })
    .index("by_email", ["email"]),
})
```

- Use `v.string()`, `v.number()`, `v.boolean()`, `v.id()` for types
- Define indexes on frequently queried fields
- Reference other tables with `v.id("table_name")`

## React Integration

### useQuery Hook
```typescript
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function ItemsList() {
  const items = useQuery(api.functions.listItems)
  
  if (items === undefined) return <div>Loading...</div>
  return <ul>{items.map(item => <li key={item._id}>{item.name}</li>)}</ul>
}
```

### useMutation Hook
```typescript
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function AddItem() {
  const addItem = useMutation(api.functions.addItem)
  
  const handleAdd = async (name: string) => {
    await addItem({ name })
  }
  
  return <button onClick={() => handleAdd("New Item")}>Add</button>
}
```

### useSubscription Hook
```typescript
const items = useSubscription(api.functions.listItems)
// Automatically re-fetches when data changes
```

## AI Files and Setup

### Install AI Files
```bash
npx convex ai-files install
```

This creates:
- `convex/_generated/ai/guidelines.md` - Guidelines for AI
- Updates `AGENTS.md` and `CLAUDE.md` with Convex info
- Agent skills via `npx skills`

### Check AI Files Status
```bash
npx convex ai-files status
npx convex ai-files update
```

## Common Patterns

### Authorization
```typescript
import { mutation } from "./_generated/server"

export const protectedMutation = mutation(async (ctx, args) => {
  const user = await ctx.auth.getUserIdentity()
  if (!user) throw new Error("Not authenticated")
  
  // User is authenticated
  return await ctx.db.insert("items", { userId: user.subject })
})
```

### Filtering and Pagination
```typescript
export const listUserItems = query(
  async (ctx, { userId, limit = 10 }) => {
    return await ctx.db
      .query("items")
      .filter(q => q.eq(q.field("userId"), userId))
      .take(limit)
  }
)
```

### Real-time Updates
```typescript
export const watchUserItems = query(
  async (ctx, { userId }) => {
    return await ctx.db
      .query("items")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect()
  }
)
// Automatically re-runs and pushes updates to UI
```

## Best Practices

✅ **DO:**
- Keep functions focused and single-responsibility
- Use TypeSchema for type safety
- Always validate input arguments
- Return only serializable data (strings, numbers, objects)
- Use indexes for frequently queried fields
- Check authentication before sensitive operations

❌ **DON'T:**
- Return functions, Date objects, or non-serializable data
- Manually manage WebSocket connections
- Manipulate subscriptions directly
- Use SQL directly (use TypeScript queries)
- Forget to define schema before querying

## Resources

- [Official Docs](https://docs.convex.dev)
- [API Reference](https://docs.convex.dev/api)
- [Convex MCP Server](https://docs.convex.dev/ai/convex-mcp-server) - AI-assisted optimization
- [LLM Leaderboard](https://convex.dev/llm-leaderboard) - Best models for Convex

## Development Workflow

```bash
# Start dev server
npm run dev

# Deploy
npx convex deploy

# Run functions
npx convex run api.functionName

# View logs
npx convex logs
```
