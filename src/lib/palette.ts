import type { PaletteItem } from '../islands/palette-types';
import { profile } from '../data/profile';
import { otherLocale, useTranslations, type Locale } from '../i18n/ui';
import { cvPdfPath, homePath, projectPath, sectionIds, statusPath } from '../i18n/routes';
import { projectSlug, type Cv } from './cv';

/** Arma (en build time) los comandos de la paleta para la página actual. */
export function buildPaletteItems(cv: Cv, alternates: Record<Locale, string>): PaletteItem[] {
  const { locale, focus } = cv;
  const t = useTranslations(locale);
  const home = homePath(locale, focus.slug);
  const g = {
    nav: t('palette.group.nav'),
    focus: t('palette.group.focus'),
    actions: t('palette.group.actions'),
    links: t('palette.group.links'),
    projects: t('palette.group.projects'),
  };

  const sections: [keyof typeof sectionIds, Parameters<typeof t>[0]][] = [
    ['about', 'nav.about'],
    ['experience', 'nav.experience'],
    ['projects', 'nav.projects'],
    ['skills', 'nav.skills'],
    ['education', 'nav.education'],
    ['contact', 'nav.contact'],
  ];

  const lang = otherLocale(locale);

  return [
    ...sections.map<PaletteItem>(([id, key]) => ({
      id: `nav-${id}`,
      group: g.nav,
      label: t(key),
      hint: `#${sectionIds[id]}`,
      action: { kind: 'link', href: `${home}#${sectionIds[id]}` },
    })),
    ...cv.focuses.map<PaletteItem>((f) => ({
      id: `focus-${f.id}`,
      group: g.focus,
      label: f.label,
      hint: f.title,
      keywords: f.id,
      action: { kind: 'link', href: homePath(locale, f.slug) },
    })),
    {
      id: 'action-cv',
      group: g.actions,
      label: t('palette.downloadCv'),
      hint: focus.label,
      keywords: 'cv resume pdf curriculum',
      action: {
        kind: 'download',
        href: cvPdfPath(locale, focus.id),
        filename: `CV-Juan-Manuel-Iglesias-${focus.label.replace(/\s+/g, '-')}-${locale.toUpperCase()}.pdf`,
      },
    },
    {
      id: 'action-email',
      group: g.actions,
      label: t('palette.copyEmail'),
      hint: profile.email,
      keywords: 'email mail correo contacto contact',
      action: { kind: 'copy', value: profile.email, toast: t('contact.copied') },
    },
    {
      id: 'action-theme',
      group: g.actions,
      label: t('palette.toggleTheme'),
      keywords: 'theme tema dark light oscuro claro',
      action: { kind: 'theme' },
    },
    {
      id: 'action-lang',
      group: g.actions,
      label: t('palette.switchLang'),
      hint: lang.toUpperCase(),
      keywords: 'language idioma english español',
      action: { kind: 'link', href: alternates[lang] },
    },
    {
      id: 'link-status',
      group: g.links,
      label: t('palette.goStatus'),
      keywords: 'status estado uptime pipeline lighthouse',
      action: { kind: 'link', href: statusPath(locale) },
    },
    {
      id: 'link-github',
      group: g.links,
      label: 'GitHub',
      hint: 'github.com/JuanmaIglesias10',
      action: { kind: 'link', href: profile.links.github, external: true },
    },
    {
      id: 'link-linkedin',
      group: g.links,
      label: 'LinkedIn',
      hint: 'in/jiglesiasarregui',
      action: { kind: 'link', href: profile.links.linkedin, external: true },
    },
    ...cv.projects.map<PaletteItem>((p) => ({
      id: `project-${projectSlug(p)}`,
      group: g.projects,
      label: p.data.title,
      hint: p.data.kind,
      keywords: p.data.stack.join(' '),
      action: { kind: 'link', href: projectPath(locale, projectSlug(p)) },
    })),
  ];
}
