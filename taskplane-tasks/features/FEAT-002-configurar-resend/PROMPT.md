# FEAT-002 — Configurar Resend

**Created:** 2026-04-18
**Size:** M
**Area:** features

## Review Level: 2 (Plan + Código)

**Assessment:** Integración de librería externa. Requiere revisar plan y código.

## Mission

Verificar si existe Resend en el proyecto. Si no existe, instalar y configurar Resend con plantillas de email que sean coherentes con el diseño actual de la landing page (fondo negro, texto claro, accent verde).

## File Scope

- `package.json` — agregar dependencia de resend
- `.env.local` — agregar RESEND_API_KEY
- `emails/` — carpeta para plantillas (crear si no existe)
- `emails/base-template.tsx` — plantilla base (crear)
- `app/api/send-email/route.ts` — endpoint para enviar emails (crear)

## Context to Read First

- `app/globals.css` — colores y estilos de la página
- `app/page.tsx` — estructura general
- `app/components/home/CallToAction.tsx` — estilo de botones

## Steps

1. **Verificar instalación actual**
   - Buscar `resend` en package.json
   - Buscar `@react-email/components` en package.json

2. **Si no existe Resend:**
   - Agregar dependencia: `resend` y `@react-email/components`
   - Crear archivo `.env.local` con `RESEND_API_KEY` (si no existe)

3. **Crear estructura de emails**
   - Crear carpeta `emails/` en raíz
   - Crear `emails/base-template.tsx` con estilos coherentes:
     - Background: #0a0a0a
     - Text: #ededed
     - Accent: #22c55e (green-500)
   - Crear endpoint `app/api/send-email/route.ts`

4. **Verificar configuración**
   - Correr `bun run dev` y probar endpoint
   - Confirmar que los estilos coinciden con la landing page

## Testing & Verification

```bash
# Verificar instalación
grep resend package.json

# Probar que el endpoint responde
curl -X POST http://localhost:3000/api/send-email -d '{"to":"test@example.com","subject":"Test"}'
```

## Dependencies

- Ninguna

## Do NOT

- No modificar archivos fuera del file scope
- No crear tests que dependan de datos externos
- No hacer commit directo a main/master

---

## Amendments

_Placeholder — anything after the `---` divider is amendable._