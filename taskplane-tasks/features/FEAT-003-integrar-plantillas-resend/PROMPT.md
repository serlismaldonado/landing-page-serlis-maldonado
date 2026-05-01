# FEAT-003 — Integrar Plantillas de Email al Endpoint

**Created:** 2026-05-01
**Size:** S
**Area:** features

## Review Level: 2 (Plan + Código)

**Assessment:** Mejora de API existente. Requiere revisar plan y código.

## Context

El endpoint `/api/send-email` actualmente acepta html/text directo del request body. Las plantillas en `emails/` (contact-email.tsx, welcome-email.tsx) no están conectadas al endpoint.

## Mission

Conectar las plantillas al endpoint para enviar emails con diseño coherent con la landing page. El endpoint debe soportar diferentes tipos de email (contact, welcome, etc).

## File Scope

- `app/api/send-email/route.ts` — modificar para usar plantillas
- `emails/contact-email.tsx` — ya existe
- `emails/welcome-email.tsx` — ya existe

## Steps

1. **Modificar endpoint para soportar templates**
   - Aceptar `template` field en el body: "contact" | "welcome"
   - Usar `render` de `@react-email/components` para generar HTML
   - Mantener backward compatibility con html/text directo

2. **Ejemplo de payload**
   ```typescript
   // Usando plantilla
   { to: "user@example.com", template: "contact", data: { name: "Juan", email: "juan@test.com", message: "Hola" } }
   
   // Directo (mantener para flexibilidad)
   { to: "user@example.com", subject: "Asunto", html: "<p>Hola</p>" }
   ```

3. **Verificar que los emails se rendericen bien**
   - Test local con ambos tipos de payload

## Testing

```bash
# Test con plantilla contact
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"serlismaldonado@heskala.com","template":"contact","data":{"name":"Test User","email":"test@test.com","message":"Hola desde el test"}}'

# Test con plantilla welcome
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"serlismaldonado@heskala.com","template":"welcome","data":{"name":"Test User"}}'
```

## Dependencies

- FEAT-002 (Resend configurado)

## Do NOT

- No crear nuevas plantillas (usar las existentes)
- No modificar el diseño de las plantillas (ya están correctas)