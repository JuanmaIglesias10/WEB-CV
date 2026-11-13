# Web personal / CV — Juan Manuel Iglesias

Especificación del proyecto para desarrollar con Claude Code.

## Objetivo

Sitio web personal a modo de currículum y presentación profesional. Tiene que ser moderno y demostrar manejo de tecnologías actuales, sin ser excesivamente complejo. Enfoque profesional: infraestructura de redes, monitoreo y DevOps.

## Stack

- **Framework:** Astro (última versión estable)
- **Lenguaje:** TypeScript (modo strict)
- **Estilos:** Tailwind CSS
- **Interactividad:** islas de Astro con React solo donde haga falta
- **Contenido:** Content Collections de Astro (Markdown/MDX) para proyectos y experiencia
- **Repositorio:** GitHub
- **CI:** GitHub Actions
- **Hosting:** Vercel
- **Dominio:** subdominio gratuito de Vercel (juanmanueliglesias.vercel.app) para arrancar; dominio propio (.com o .com.ar) opcional más adelante

## Secciones

1. **Inicio / Hero:** nombre, título profesional, frase corta, botones a CV en PDF, GitHub y LinkedIn.
2. **Sobre mí:** breve presentación.
3. **Experiencia:** Celsur Logística, infraestructura de red desde diciembre de 2025 (monitoreo con WhatsUp Gold, redes LAN/WAN, equipamiento Cisco, automatización, reportes en Power BI).
4. **Educación:** Ingeniería en Sistemas de Información, UTN FRBA (desde 2021, 5to año). Curso de DevOps certificado por la universidad.
5. **Proyectos:** tarjetas cargadas desde Content Collections (por ejemplo: home lab de infraestructura y monitoreo, dashboard en Grafana, automatizaciones). Cada proyecto con página propia.
6. **Skills:** agrupadas por categoría (Redes, Monitoreo, DevOps, Programación, Datos).
7. **Contacto:** email y redes. Sin backend obligatorio.

## Requisitos de diseño

- Responsive, mobile first
- Modo claro y oscuro con toggle y preferencia del sistema
- Estética limpia y técnica, con animaciones sutiles
- Accesible (contraste, navegación por teclado, etiquetas semánticas)
- Idioma principal español; opcional versión en inglés con i18n de Astro

## Calidad y SEO

- Lighthouse 95+ en todas las categorías
- Meta tags, Open Graph e imagen para compartir
- Sitemap y robots.txt
- Imágenes optimizadas con el componente Image de Astro

## CI/CD

Workflow de GitHub Actions en cada push y pull request:

1. Instalar dependencias
2. Lint (ESLint) y formato (Prettier)
3. Chequeo de tipos (astro check)
4. Build
5. Lighthouse CI con umbrales mínimos

Vercel conectado al repositorio: deploy de producción desde main y previews por pull request.

## Deploy y dominio

1. Crear repositorio en GitHub y subir el proyecto.
2. Importar el repositorio en Vercel.
3. Usar el subdominio gratuito que asigna Vercel (por ejemplo juanmanueliglesias.vercel.app).
4. Más adelante (opcional): comprar un dominio propio (Cloudflare, Namecheap o NIC Argentina para .com.ar), agregarlo en Vercel y cargar los registros DNS que indique.
5. Verificar HTTPS automático.

## Entregables para Claude Code

- Proyecto Astro inicializado con la estructura de carpetas
- Componentes por sección y layout base
- Content Collections configuradas con proyectos de ejemplo
- Workflow de GitHub Actions
- README con instrucciones de desarrollo y deploy
