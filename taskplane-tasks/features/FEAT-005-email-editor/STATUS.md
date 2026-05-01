task: FEAT-005
status: done
created: 2026-05-01
size: L
review_level: 1
task_name: "Instalar e Integrar React Email Editor 6.0"
completed: 2026-05-01

## Changes Made

1. **Instalado dependencias**
   - react-email
   - @react-email/ui
   - @react-email/editor

2. **Creado tabla emailTemplates en Convex**
   - convex/emailTemplates/schema.ts
   - convex/emailTemplates/mutations.ts (create, update, remove)
   - convex/emailTemplates/queries.ts (list, getById)

3. **Creado API endpoint** `/api/email-templates`
   - GET: lista templates
   - POST: guarda template

4. **Creado página admin** `/admin/email-editor`
   - Editor visual con EmailEditor de @react-email/editor
   - Sidebar con campos para nombre, subject, tipo
   - Lista de templates guardados
   - Tema dark

5. **Actualizado schema.ts** para incluir emailTemplates

## API Usage

```bash
# GET templates
curl http://localhost:3000/api/email-templates

# POST guardar template
curl -X POST http://localhost:3000/api/email-templates \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","subject":"Test Subject","content":"<p>Content</p>","type":"custom"}'
```

## Test Results

- Página carga correctamente ✅
- Redirige a login si no está auth ✅
- Dependencias instaladas ✅

## Notes

- Requiere login para acceder (auth de convex-dev/better-auth)
- Content del editor es JSON que se guarda como string