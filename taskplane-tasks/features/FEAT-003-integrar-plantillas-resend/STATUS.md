task: FEAT-003
status: done
created: 2026-05-01
size: S
review_level: 2
task_name: "Integrar Plantillas de Email al Endpoint"
completed: 2026-05-01

## Changes Made

1. **Renombrado endpoint** a `route.tsx` para soportar JSX

2. **Modificado endpoint** `/api/send-email`:
   - Ahora acepta `template` + `data` para usar plantillas
   - Mantiene backward compatibility con `html` directo
   - Subjects automáticos por template

3. **Actualizado plantillas** para compatibilidad:
   - Removido Preview (causaba error)
   - Agregado `import React from "react"`
   - Estilos simplificados (sin "as const")

4. **Corregido imports** en base-template.tsx

## API Usage

```bash
# Con plantilla
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"user@email.com","template":"welcome","data":{"name":"Juan"}}'

# Con plantilla contact
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"user@email.com","template":"contact","data":{"name":"Juan","email":"juan@test.com","message":"Hola"}}'

# Directo (mantiene backward compatibility)
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"user@email.com","html":"<p>Hola</p>"}'
```

## Test Results

- welcome template ✅ (ID: ec9456c9-7567-4903-a655-1611a5a63833)
- contact template ✅ (ID: bc91490d-bb80-43e6-846e-6ad356dda1d8)