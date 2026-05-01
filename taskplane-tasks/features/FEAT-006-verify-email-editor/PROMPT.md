# FEAT-006 — Verificar e Integrar Email Editor con Blog

**Created:** 2026-05-01
**Size:** M
**Area:** features

## Review Level: 2 (Plan + Código)

**Assessment:** Integración con features existentes. Requiere revisar plan y código.

## Context

FEAT-005 implementó el editor visual de emails. Ahora necesitamos:
1. Verificar que todo funciona correctamente
2. Integrar el editor con el sistema de blog posts
3. Crear template automático para newsletters

## Mission

- Verificar instalación y funcionamiento del editor
- Crear sistema de broadcasting automático cuando se publica un blog post
- Integrar con Resend para enviar newsletters

## File Scope

- `app/admin/email-editor/page.tsx` — verificar que funciona
- `app/api/send-newsletter/route.ts` — endpoint para enviar newsletter (crear)
- `emails/blog-post-template.tsx` — template dinámico para blog posts (crear)

## Dependencies

- FEAT-005 (Email Editor instalado)
- FEAT-004 (Newsletter configurado)

## Steps

### 1. Verificar Instalación

- Confirmar que react-email, @react-email/ui, @react-email/editor están en package.json
- Verificar que la página del editor carga sin errores
- Probar guardar un template simple

### 2. Crear Template de Blog Post

Crear un template que acepte:
- Título del post
- Excerpt/contenido
- Link al post
- Imagen (opcional)

```typescript
// app/api/send-newsletter/route.ts
interface NewsletterPayload {
  postId: string;
  templateId?: string;
}
```

### 3. Endpoint para Enviar Newsletter

Crear `/api/send-newsletter` que:
1. Obtiene el blog post de Convex
2. Renderiza el template con los datos
3. Envía a todos los contactos en Resend

```bash
# Test endpoint
curl -X POST http://localhost:3000/api/send-newsletter \
  -H "Content-Type: application/json" \
  -d '{"postId":"abc123"}'
```

### 4. Opcional: Webhook cuando se publica blog post

Si tenemos tabla de blog posts, crear un trigger que envíe newsletter automáticamente cuando `publishedAt` se setea.

## Testing

```bash
# Verificar editor
curl -s http://localhost:3000/admin/email-editor | grep -i "email-editor" && echo "OK"

# Test newsletter endpoint
curl -X POST http://localhost:3000/api/send-newsletter \
  -H "Content-Type: application/json" \
  -d '{"postId":"test-id"}'
```

## Do NOT

- No enviar newsletters de prueba a contactos reales sin autorización
- No modificar templates existentes sin backup
- No hacer deploy sin verificar todos los tests