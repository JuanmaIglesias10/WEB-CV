import type { Locale } from './ui';

const prefix = (locale: Locale) => (locale === 'es' ? '' : '/en');

/** `/` o `/redes/` en español; `/en/` o `/en/networking/` en inglés. */
export function homePath(locale: Locale, focusSlug = ''): string {
  return `${prefix(locale)}/${focusSlug ? `${focusSlug}/` : ''}`;
}

export function projectPath(locale: Locale, slug: string): string {
  return `${prefix(locale)}/${locale === 'es' ? 'proyectos' : 'projects'}/${slug}/`;
}

export function statusPath(locale: Locale): string {
  return `${prefix(locale)}/status/`;
}

export function cvPdfFile(locale: Locale, focusId: string): string {
  return `juan-manuel-iglesias-cv-${locale}-${focusId}`;
}

export function cvPdfPath(locale: Locale, focusId: string): string {
  return `/cv/${cvPdfFile(locale, focusId)}.pdf`;
}

export function ogImagePath(locale: Locale, focusId: string): string {
  return `/og/${locale}-${focusId}.png`;
}

export const sectionIds = {
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  skills: 'skills',
  education: 'education',
  contact: 'contact',
} as const;
