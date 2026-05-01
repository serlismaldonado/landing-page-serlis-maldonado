# FEAT-005 — Instalar e Integrar React Email Editor 6.0

**Created:** 2026-05-01
**Size:** L
**Area:** features

## Review Level: 1 (Código directo)

**Assessment:** Nuevo feature con múltiples componentes. Implementar directo.

## Context

React Email 6.0 trae un editor visual open-source que podemos embedir en la app. Esto permite crear emails de newsletter visualmente sin escribir código.

## Mission

Instalar React Email 6.0 y crear una página admin para crear emails con el editor visual.

## File Scope

- `package.json` — instalar dependencias
- `app/admin/email-editor/page.tsx` — página del editor (crear)
- `app/admin/email-editor/layout.tsx` — layout con basic auth (crear)
- `lib/email-templates.ts` — utilidades para guardar/cargar templates (crear)
- `convex/emailTemplates/schema.ts` — tabla para guardar templates (crear)
- `convex/emailTemplates/mutations.ts` — mutations para CRUD (crear)
- `convex/emailTemplates/queries.ts` — queries para listar templates (crear)

## Dependencies

- react-email
- @react-email/ui
- @react-email/editor

## Steps

### 1. Install Dependencies
```bash
npm install react-email @react-email/ui @react-email/editor
```

### 2. Create Database Schema

Crear tabla `emailTemplates` en Convex:
```typescript
// convex/emailTemplates/schema.ts
export const emailTemplates = defineTable({
  name: v.string(),
  subject: v.string(),
  content: v.string(), // HTML output del editor
  type: v.union(v.literal("newsletter"), v.literal("confirmation"), v.literal("custom")),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index("by_type", ["type"])
.index("by_updated", ["updatedAt"]);
```

### 3. Create API Functions

- `convex/emailTemplates/mutations.ts`: create, update, delete
- `convex/emailTemplates/queries.ts`: list, getById

### 4. Create Admin Page

Crear página `/admin/email-editor` con:
- Editor visual de React Email
- Preview del email
- Botón para guardar
- Lista de templates guardados
- Basic auth simple (check env var ADMIN_SECRET)

### 5. Theme y Styling

Usar el theme default para que matchee con el diseño dark del sitio:
```typescript
import '@react-email/editor/themes/default.css'
```

Opcionalmente crear un theme custom que combine con la landing page (bg #0a0a0a).

## Testing

```bash
# Verificar que el editor carga
curl -s http://localhost:3000/admin/email-editor

# Verificar que el endpoint responde
curl -s http://localhost:3000/api/email-templates
```

## Dependencies

- FEAT-004 (Newsletter configurado)

## Do NOT

- No modificar el diseño de la landing page principal
- No crear endpoints públicos para el admin
- No hacer deploy sin verificar que funciona localmente