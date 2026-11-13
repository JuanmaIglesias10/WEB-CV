---
title: This website
kind: Personal site · CI/CD · Observability
summary: My resume run as a production service, with a CI pipeline, PDFs generated from the content and its own status page.
period: November 2026
date: 2026-11-01
status: active
stack: [Astro, TypeScript, Tailwind CSS, React, GitHub Actions, Lighthouse CI, Vercel]
skills: [git, javascript]
repo: https://github.com/JuanmaIglesias10/WEB-CV
highlights:
  - Bilingual (ES/EN) static site built with Astro, strict TypeScript, Tailwind CSS and React islands only where interactivity is needed.
  - 'CI pipeline on GitHub Actions: linting, formatting, type checking, build and Lighthouse CI with a minimum score of 95 on every push and pull request.'
  - Resume PDFs for every focus and language are generated at build time from the same content as the website.
---

## Idea

A resume that proves what it says: the site is built, tested and deployed like a production service, and it exposes its
own health at [/status](/en/status/).

## Stack

- **Astro** with strict TypeScript and Content Collections: experience, projects and skills live in YAML and Markdown
  files, a single source of truth.
- **Tailwind CSS** with light and dark themes.
- **React islands** only where things are interactive: the skills topology map and the command palette (Ctrl+K).
- **Vercel** for hosting, with automatic previews for every pull request.

## Pipeline

Every push and pull request runs on GitHub Actions: install, **ESLint**, **Prettier**, **astro check**, build and
**Lighthouse CI**, which fails if any category drops below 95. A weekly workflow measures production and publishes the
results on the status page.

## Resume as code

The resume PDFs (one per focus and language) are generated during the build with `@react-pdf/renderer` from the same
content as the website, so they never go stale.
