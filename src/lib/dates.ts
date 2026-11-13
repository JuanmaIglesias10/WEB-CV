import { htmlLang, type Locale } from '../i18n/ui';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** '2025-12' → 'Diciembre 2025' / 'December 2025'. */
export function formatYearMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const formatted = new Intl.DateTimeFormat(htmlLang[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace(' de ', ' ');
  return capitalize(formatted);
}

/** Meses completos entre 'YYYY-MM' y una fecha (por defecto, el momento del build). Mínimo 1. */
export function monthsSince(value: string, now = new Date()): number {
  const [year, month] = value.split('-').map(Number);
  const months = (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - month);
  return Math.max(1, months);
}

export function formatDateTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(iso));
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], {
    dateStyle: 'medium',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(iso));
}
