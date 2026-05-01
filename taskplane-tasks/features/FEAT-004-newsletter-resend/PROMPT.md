# FEAT-004 — Sistema de Newsletter con Resend

**Created:** 2026-05-01
**Size:** M
**Area:** features

## Review Level: 2 (Plan + Código)

**Assessment:** Nuevo feature con integración externa. Requiere revisar plan y código.

## Context

Resend tiene un sistema de Audiences para manejar contactos y enviar broadcasts de marketing. Podemos integrarlo a la landing page para permitir que visitantes se suscriban al newsletter.

## Mission

Crear un sistema de newsletter completo usando Resend Audiences:
- Página de suscripción con formulario
- API para agregar contactos al audience
- Página de confirmación/éxito
- Gestión de preferencias de email

## File Scope

- `app/subscribe/page.tsx` — página de suscripción (crear)
- `app/subscribe/success/page.tsx` — página de confirmación (crear)
- `app/api/subscribe/route.ts` — endpoint para suscribir (crear)
- `emails/newsletter-confirmation.tsx` — email de confirmación (crear)
- `emails/newsletter-welcome.tsx` — email de bienvenida (crear)
- `components/SubscribeForm.tsx` — componente reutilizable (crear)

## Features

### 1. Formulario de Suscripción
- Campo: email (requerido)
- Validación de email
- Diseño coherente con landing (dark theme)
- Mensaje de éxito/error

### 2. API Endpoint `/api/subscribe`
- Recibir email
- Validar formato
- Agregar a Resend Audience
- Enviar email de confirmación
- Retornar success/error

### 3. Emails
- **Confirmation:** Confirma la suscripción con botón de verificar
- **Welcome:** Bienvenida al newsletter

### 4. Página de Éxito
- Mensaje de confirmación
- Link para manage preferences

## Technical Details

### Resend API Usage
```typescript
// Agregar contacto al audience
await resend.contacts.create({
  audienceId: process.env.RESEND_AUDIENCE_ID,
  email: email,
  firstName: name,
});

// O verificar si ya existe
await resend.contacts.findOne({
  audienceId: process.env.RESEND_AUDIENCE_ID,
  email: email,
});
```

### Environment Variables
```bash
RESEND_API_KEY=re_xxxxx
RESEND_AUDIENCE_ID=xxxxx  # ID del audience en Resend
```

## Steps

1. **Agregar dependencies si es necesario**
   - Ya tenemos resend instalado

2. **Crear componentes**
   - `components/SubscribeForm.tsx`
   - `emails/newsletter-confirmation.tsx`
   - `emails/newsletter-welcome.tsx`

3. **Crear API endpoint**
   - `app/api/subscribe/route.tsx`
   - Validar email
   - Agregar a audience
   - Enviar emails

4. **Crear páginas**
   - `app/subscribe/page.tsx`
   - `app/subscribe/success/page.tsx`

5. **Integrar en landing page**
   - Agregar sección de newsletter en `app/page.tsx`
   - O crear página `/subscribe` separada

6. **Actualizar .env.local**
   - Agregar `RESEND_AUDIENCE_ID`

## Testing

```bash
# Test suscripción
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## Dependencies

- FEAT-002 (Resend configurado)
- FEAT-003 (Plantillas de email integradas)

## Do NOT

- No crear más de 2 plantillas de email
- No modificar diseño existente de landing