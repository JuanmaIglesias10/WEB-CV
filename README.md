# Web personal / CV — Juan Manuel Iglesias

Sitio personal bilingüe (ES/EN) a modo de CV, con estética de **NOC / observabilidad**. Se opera como un servicio en
producción: CI con Lighthouse, PDFs del CV generados desde el código y una página de estado propia.

**Producción:** https://juanmanueliglesias.vercel.app

## Qué tiene

| Funcionalidad             | Detalle                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Enfoques de CV**        | `General`, `Redes`, `Seguridad`, `DevOps`, cada uno con su URL (`/redes/`, `/en/networking/`…) y su PDF.     |
| **Bilingüe**              | Español sin prefijo (`/`) e inglés bajo `/en/`, con `hreflang`, switch de idioma y PDFs en ambos idiomas.    |
| **Telemetría en el hero** | Latencia real navegador → sitio, nodo edge de Vercel que sirvió la página y antigüedad del último deploy.    |
| **Topología de skills**   | Mapa interactivo según el modelo jerárquico de Cisco (core → distribución → acceso), filtrable por proyecto. |
| **Paleta de comandos**    | `Ctrl/⌘ + K`: navegar, cambiar enfoque o idioma, alternar tema, copiar el email, descargar el CV.            |
| **CV en PDF como código** | `@react-pdf/renderer` genera 8 PDFs (4 enfoques × 2 idiomas) en cada build, a partir del mismo contenido.    |
| **/status**               | Commit y build, últimas ejecuciones del pipeline (API de GitHub), uptime (UptimeRobot) y Lighthouse semanal. |
| **Calidad**               | Lighthouse ≥ 95 en todas las categorías, exigido en CI. Modo claro/oscuro, accesible y responsive.           |

## Stack

Astro 7 (output estático) · TypeScript strict · Tailwind CSS 4 · islas de React (topología y paleta) · Content
Collections (YAML + Markdown) · `@react-pdf/renderer` (PDFs) · `satori` + `sharp` (imágenes Open Graph) · GitHub
Actions · Lighthouse CI · Vercel.

## Desarrollo

Requisitos: Node 24 (ver `.nvmrc`) y npm.

```bash
npm install
npm run dev          # http://localhost:4321
```

| Script                  | Qué hace                                                  |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo                                    |
| `npm run build`         | Build estático en `dist/` (incluye PDFs e imágenes OG)    |
| `npm run preview`       | Sirve el build localmente                                 |
| `npm run lint`          | ESLint                                                    |
| `npm run format`        | Formatea con Prettier (`format:check` solo verifica)      |
| `npm run check`         | Chequeo de tipos con `astro check`                        |
| `npm run verify`        | Lint + formato + tipos + build (lo mismo que corre el CI) |
| `npx @lhci/cli autorun` | Lighthouse CI local sobre `dist/` (requiere Chrome)       |

## Editar el contenido

Todo el contenido del CV vive en `src/content/` y alimenta a la vez la web, la topología, la paleta y los PDFs.

| Archivo                             | Contenido                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `src/content/focus.yaml`            | Enfoques: slug por idioma, título, tagline, perfil, orden de skills y de proyectos. |
| `src/content/experience.yaml`       | Experiencia laboral. Cada highlight indica en qué enfoques va primero.              |
| `src/content/education.yaml`        | Educación y certificaciones.                                                        |
| `src/content/skills.yaml`           | Skills por categoría (`short` es la etiqueta corta del mapa).                       |
| `src/content/projects/{es,en}/*.md` | Un archivo por proyecto e idioma, con el mismo nombre en ambas carpetas.            |
| `src/data/profile.ts`               | Nombre, email, links e idiomas.                                                     |
| `src/i18n/ui.ts`                    | Textos de la interfaz en ES/EN.                                                     |

- **Agregar un enfoque:** sumar una entrada en `focus.yaml`. Se crean solas la página en ambos idiomas, el PDF, la
  imagen OG y la opción en el selector y en la paleta.
- **Agregar un proyecto:** crear `src/content/projects/es/<slug>.md` y `src/content/projects/en/<slug>.md`, y sumar
  `<slug>` al `projectOrder` de cada enfoque. Con `draft: true` no se publica.
- Los esquemas de `src/content.config.ts` validan todo en build: un campo faltante o mal escrito hace fallar el build.

### Teléfono en los PDFs

El teléfono **no** está en el repositorio. Para incluirlo en los PDFs, definí la variable `CV_PHONE` en Vercel
(Settings → Environment Variables), por ejemplo `+54 9 11 1234-5678`, y volvé a desplegar.

## CI/CD

### `.github/workflows/ci.yml` (cada push a `main` y cada pull request)

1. `npm ci`
2. ESLint y Prettier
3. `astro check`
4. `astro build`, que genera las páginas, los PDFs y las imágenes OG
5. Lighthouse CI sobre `dist/` (3 corridas por URL, mínimo **95** en Performance, Accessibility, Best Practices y SEO)
6. Artifacts: PDFs del CV y reporte de Lighthouse

### `.github/workflows/lighthouse-prod.yml` (semanal y manual)

Mide producción con Lighthouse y commitea `src/data/lighthouse.json`; la página `/status` lo muestra. El commit
dispara un redeploy, que de paso actualiza los contadores de tiempo ("En servicio · N meses").

### Vercel

Vercel está conectado al repositorio: deploy de producción desde `main` y previews automáticas por pull request. No
hace falta adapter, porque el output es estático. `vercel.json` define headers de seguridad y cache.

## Deploy (primera vez)

1. Subir el repo a GitHub (`git push -u origin main`). El repo tiene que ser **público** para que `/status` pueda
   leer el estado del pipeline con la API de GitHub.
2. En [vercel.com/new](https://vercel.com/new), importar `JuanmaIglesias10/WEB-CV`. Astro se detecta solo; no hay
   que tocar comandos ni directorio de salida.
3. En Settings → Domains, usar el subdominio `juanmanueliglesias.vercel.app` (o el que asigne Vercel). Si cambia,
   actualizar `SITE_URL` en `astro.config.mjs` o la variable de entorno `SITE_URL`, y `PRODUCTION_URL` en
   `lighthouse-prod.yml`.
4. Verificar HTTPS (automático en Vercel).
5. Opcional: correr a mano el workflow **Lighthouse producción** (Actions → Run workflow) para poblar `/status`.

### Uptime (opcional)

1. Crear una cuenta gratis en [UptimeRobot](https://uptimerobot.com) y un monitor HTTP(s) para la URL de producción
   (intervalo de 5 minutos).
2. En el monitor, generar una **Monitor-specific API key**, que es de solo lectura y se puede exponer.
3. Cargarla en Vercel como `PUBLIC_UPTIMEROBOT_KEY` y volver a desplegar. Sin la key, el panel muestra "pendiente".

### Dominio propio (más adelante)

Comprar el dominio (Cloudflare, Namecheap o NIC Argentina para `.com.ar`), agregarlo en Vercel → Settings → Domains,
cargar los registros DNS que indique Vercel y actualizar `SITE_URL`.

## Estructura

```
src/
  content/            contenido del CV (YAML + Markdown por idioma)
  content.config.ts   esquemas de las colecciones (Zod)
  i18n/               textos de la UI y helpers de rutas
  lib/                cv.ts (fuente única de datos), topology.ts, palette.ts, fechas, build-info
  islands/            React: Topology, CommandPalette (se monta bajo demanda)
  components/         layout, secciones y UI
  pdf/                CvDocument.tsx (PDF del CV)
  pages/              rutas ES (/) y EN (/en/), /status, /cv/*.pdf, /og/*.png, robots.txt
  scripts/            telemetría del navegador
.github/workflows/    ci.yml y lighthouse-prod.yml
docs/especificacion.md  especificación original del proyecto
```
