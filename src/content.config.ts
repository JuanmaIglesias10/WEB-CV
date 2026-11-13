import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.object({ es: z.string(), en: z.string() });
const text = z.union([z.string(), localized]);
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'Formato esperado: YYYY-MM');

const focus = defineCollection({
  loader: file('src/content/focus.yaml'),
  schema: z.object({
    order: z.number(),
    slug: localized,
    label: localized,
    title: localized,
    tagline: localized,
    summary: localized,
    categoryOrder: z.array(z.string()),
    projectOrder: z.array(z.string()),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({
    order: z.number(),
    company: z.string(),
    role: localized,
    start: yearMonth,
    end: yearMonth.nullable(),
    highlights: z.array(localized.extend({ focus: z.array(z.string()).default([]) })),
    skills: z.array(z.string()).default([]),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.yaml'),
  schema: z.object({
    order: z.number(),
    institution: z.string(),
    title: localized,
    detail: localized,
    start: z.number(),
    end: z.number().nullable(),
    progress: z.object({ current: z.number(), total: z.number() }).optional(),
    credential: z.url().optional(),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    label: localized,
    short: localized,
    items: z.array(z.object({ id: z.string(), name: text, short: text.optional() })),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Nombre corto opcional (chips de la topología). */
    short: z.string().optional(),
    kind: z.string(),
    summary: z.string(),
    period: z.string(),
    date: z.coerce.date(),
    status: z.enum(['active', 'wip', 'done']),
    stack: z.array(z.string()),
    skills: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
    repo: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { focus, experience, education, skills, projects };
