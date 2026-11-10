# serlismaldonado.com

Landing personal de Serlis Maldonado: proyectos, blog (Notion), newsletter (Resend) y panel de admin.

- **Astro 7** con render en servidor (adaptador de Vercel) e islas de **React** para lo interactivo.
- **Convex** como backend (`convex/`) y **Better Auth** con login por código (emailOTP), corriendo dentro de Convex.
- **Tailwind CSS 4**.

## Desarrollo

```bash
npm install
npx convex dev      # backend de Convex (otra terminal)
npm run dev         # http://localhost:4321
```

Requiere Node 22.23+ y un `.env.local` con `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`,
`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` y `GITHUB_TOKEN`.
Los nombres `NEXT_PUBLIC_*` se mantienen de la versión anterior (Astro los expone al cliente vía `envPrefix`).

## Admin

Solo entran los emails de `ADMIN_EMAILS` (variable de entorno **de Convex**, separados por coma):

```bash
npx convex env set ADMIN_EMAILS tu@email.com
```

## Estructura

- `src/pages/` — rutas (`.astro`) y APIs (`src/pages/api/*.ts`).
- `src/islands/` — páginas interactivas de React montadas como islas (admin, login, proyecto, perfil).
- `src/components/Hero.astro` — hero de la home.
- `components/` — componentes de React compartidos.
- `lib/` — Notion, auth en servidor, utilidades.

## Comandos

| Comando | |
| --- | --- |
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción (`.vercel/output`) |
| `npm run check` | chequeo de tipos (`astro check`) |
| `npm run lint` | ESLint |
