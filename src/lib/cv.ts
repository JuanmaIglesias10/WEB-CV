import { getCollection, type CollectionEntry } from 'astro:content';
import { profile } from '../data/profile';
import { l, type Locale } from '../i18n/ui';

export type FocusEntry = CollectionEntry<'focus'>;
export type ProjectEntry = CollectionEntry<'projects'>;

export interface SkillItem {
  id: string;
  name: string;
  short: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  short: string;
  items: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string | null;
  highlights: { text: string; relevant: boolean }[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  title: string;
  detail: string;
  start: number;
  end: number | null;
  progress?: { current: number; total: number };
  credential?: string;
}

export interface FocusInfo {
  id: string;
  slug: string;
  label: string;
  title: string;
  tagline: string;
  summary: string;
}

export interface Cv {
  locale: Locale;
  focus: FocusInfo;
  focuses: FocusInfo[];
  experience: ExperienceItem[];
  education: EducationItem[];
  categories: SkillCategory[];
  projects: ProjectEntry[];
  /** Nombre visible de cada skill por id (para etiquetas). */
  skillNames: Record<string, string>;
  languages: { name: string; level: string }[];
  location: string;
}

const projectSlug = (entry: ProjectEntry) => entry.id.split('/').slice(1).join('/');
export { projectSlug };

function toFocusInfo(entry: FocusEntry, locale: Locale): FocusInfo {
  const d = entry.data;
  return {
    id: entry.id,
    slug: d.slug[locale],
    label: d.label[locale],
    title: d.title[locale],
    tagline: d.tagline[locale],
    summary: d.summary[locale],
  };
}

/** Ordena `items` según la posición de su id en `order`; los que no figuran van al final. */
function sortByOrder<T>(items: T[], order: string[], getId: (item: T) => string): T[] {
  const rank = (item: T) => {
    const i = order.indexOf(getId(item));
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

export async function getFocuses(): Promise<FocusEntry[]> {
  return (await getCollection('focus')).sort((a, b) => a.data.order - b.data.order);
}

export async function getProjects(locale: Locale): Promise<ProjectEntry[]> {
  return (await getCollection('projects', (p) => p.id.startsWith(`${locale}/`) && !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

/** Arma el CV completo para un idioma y un enfoque. Es la única fuente para páginas, topología, paleta y PDF. */
export async function getCv(locale: Locale, focusId: string): Promise<Cv> {
  const focusEntries = await getFocuses();
  const focusEntry = focusEntries.find((f) => f.id === focusId);
  if (!focusEntry) throw new Error(`Enfoque desconocido: ${focusId}`);
  const { categoryOrder, projectOrder } = focusEntry.data;

  const experience = (await getCollection('experience'))
    .sort((a, b) => a.data.order - b.data.order)
    .map<ExperienceItem>((e) => {
      const highlights = e.data.highlights.map((h) => ({
        text: h[locale],
        relevant: h.focus.includes(focusId),
      }));
      // Los highlights relevantes para el enfoque van primero (orden estable).
      highlights.sort((a, b) => Number(b.relevant) - Number(a.relevant));
      return {
        id: e.id,
        company: e.data.company,
        role: e.data.role[locale],
        start: e.data.start,
        end: e.data.end,
        highlights,
        skills: e.data.skills,
      };
    });

  const education = (await getCollection('education'))
    .sort((a, b) => a.data.order - b.data.order)
    .map<EducationItem>((e) => ({
      id: e.id,
      institution: e.data.institution,
      title: e.data.title[locale],
      detail: e.data.detail[locale],
      start: e.data.start,
      end: e.data.end,
      progress: e.data.progress,
      credential: e.data.credential,
    }));

  const skillNames: Record<string, string> = {};
  const categories = sortByOrder(
    await getCollection('skills'),
    categoryOrder,
    (c) => c.id,
  ).map<SkillCategory>((c) => ({
    id: c.id,
    label: c.data.label[locale],
    short: c.data.short[locale],
    items: c.data.items.map((item) => {
      const name = l(locale, item.name);
      skillNames[item.id] ??= name;
      return { id: item.id, name, short: item.short ? l(locale, item.short) : name };
    }),
  }));

  const projects = sortByOrder(await getProjects(locale), projectOrder, projectSlug);

  return {
    locale,
    focus: toFocusInfo(focusEntry, locale),
    focuses: focusEntries.map((f) => toFocusInfo(f, locale)),
    experience,
    education,
    categories,
    projects,
    skillNames,
    languages: profile.languages.map((lang) => ({ name: lang.name[locale], level: lang.level[locale] })),
    location: profile.location[locale],
  };
}
