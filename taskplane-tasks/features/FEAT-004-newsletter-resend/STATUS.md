task: FEAT-004
status: done
created: 2026-05-01
size: M
review_level: 2
task_name: "Sistema de Newsletter con Resend"
completed: 2026-05-01

## Changes Made

1. **Creado API endpoint** `app/api/subscribe/route.tsx`
   - Valida email
   - Verifica si ya existe contacto
   - Crea contacto en Resend
   - Envía email de confirmación

2. **Creado componentes**
   - `components/SubscribeForm.tsx` - Formulario reutilizable
   - `emails/newsletter-confirmation.tsx` - Email de confirmación
   - `emails/newsletter-welcome.tsx` - Email de bienvenida (disponible)

3. **Creado páginas**
   - `app/subscribe/page.tsx` - Página de suscripción
   - `app/subscribe/success/page.tsx` - Página de éxito

4. **Actualizado endpoint send-email** para soportar templates

## API Usage

```bash
# Suscribirse
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","name":"Nombre"}'
```

## Test Results

- Crear contacto ✅
- Enviar email de confirmación ✅
- Verificar si ya existe ✅

## Notes

- No requiere RESEND_AUDIENCE_ID (Contacts es global)
- Los contactos se agregan directamente al account
- Email de confirmación enviado automáticamente