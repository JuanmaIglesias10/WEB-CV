import type { Localized } from '../i18n/ui';

/**
 * Datos personales públicos. El teléfono NO se guarda en el repo: si querés que aparezca en los PDFs,
 * definí la variable de entorno CV_PHONE en Vercel (Settings → Environment Variables).
 */
export const profile = {
  name: 'Juan Manuel Iglesias',
  initials: 'JMI',
  email: 'jmiglesias196@gmail.com',
  phone: process.env.CV_PHONE ?? null,
  location: { es: 'Argentina', en: 'Argentina' } satisfies Localized,
  links: {
    github: 'https://github.com/JuanmaIglesias10',
    linkedin: 'https://www.linkedin.com/in/jiglesiasarregui',
  },
  repo: { owner: 'JuanmaIglesias10', name: 'WEB-CV', url: 'https://github.com/JuanmaIglesias10/WEB-CV' },
  languages: [
    { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' } },
    {
      name: { es: 'Inglés', en: 'English' },
      level: { es: 'Avanzado – conversacional', en: 'Advanced – conversational' },
    },
  ] satisfies { name: Localized; level: Localized }[],
} as const;

export const SITE_HOST = 'juanmanueliglesias.vercel.app';
