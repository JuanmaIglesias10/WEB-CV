---
title: Esta web
kind: Sitio personal · CI/CD · Observabilidad
summary: Mi CV como un servicio en producción, con pipeline de CI, PDFs generados desde el contenido y una página de estado propia.
period: Noviembre 2026
date: 2026-11-01
status: active
stack: [Astro, TypeScript, Tailwind CSS, React, GitHub Actions, Lighthouse CI, Vercel]
skills: [git, javascript]
repo: https://github.com/JuanmaIglesias10/WEB-CV
highlights:
  - Sitio estático bilingüe (ES/EN) con Astro, TypeScript estricto, Tailwind CSS e islas de React solo donde hace falta interactividad.
  - 'Pipeline de CI en GitHub Actions: lint, formato, chequeo de tipos, build y Lighthouse CI con umbral mínimo de 95 en cada push y pull request.'
  - Los CVs en PDF de cada enfoque e idioma se generan en el build desde el mismo contenido que la web.
---

## Idea

Un CV que demuestre en la práctica lo que dice: la web se construye, se prueba y se despliega como un servicio en
producción, y expone su propio estado en [/status](/status/).

## Stack

- **Astro** con TypeScript estricto y Content Collections: experiencia, proyectos y skills viven en archivos YAML y
  Markdown, una sola fuente de verdad.
- **Tailwind CSS** con tema claro y oscuro.
- **Islas de React** solo para lo interactivo: el mapa de topología de skills y la paleta de comandos (Ctrl+K).
- **Vercel** para el hosting, con previews automáticas por pull request.

## Pipeline

Cada push y pull request ejecuta en GitHub Actions: instalación, **ESLint**, **Prettier**, **astro check**, build y
**Lighthouse CI**, que falla si alguna categoría baja de 95. Un workflow semanal mide producción y publica los
resultados en la página de estado.

## CV como código

Los PDFs del CV (uno por enfoque y por idioma) se generan durante el build con `@react-pdf/renderer` a partir del mismo
contenido que la web, así que nunca quedan desactualizados.
