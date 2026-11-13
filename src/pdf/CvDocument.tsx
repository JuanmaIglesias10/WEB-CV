import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import type { Cv } from '../lib/cv';
import { formatYearMonth } from '../lib/dates';
import { fontFiles } from '../lib/fonts';
import { profile } from '../data/profile';
import type { Locale } from '../i18n/ui';

Font.register({
  family: 'Inter',
  fonts: [
    { src: fontFiles.inter(400), fontWeight: 400 },
    { src: fontFiles.inter(500), fontWeight: 500 },
    { src: fontFiles.inter(600), fontWeight: 600 },
    { src: fontFiles.inter(700), fontWeight: 700 },
    { src: fontFiles.inter(800), fontWeight: 800 },
  ],
});
Font.register({ family: 'Mono', fonts: [{ src: fontFiles.mono(500), fontWeight: 500 }] });
// Sin guiones de corte automático: el texto queda limpio para los ATS.
Font.registerHyphenationCallback((word) => [word]);

const COLOR = { fg: '#0b1220', muted: '#3d4a5c', subtle: '#5b6b80', accent: '#0369a1', line: '#0b1220' };

const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 8.8,
    lineHeight: 1.3,
    color: COLOR.fg,
    paddingTop: 26,
    paddingBottom: 30,
    paddingHorizontal: 38,
  },
  contact: { fontSize: 8.5, color: COLOR.muted },
  contactLink: { color: COLOR.muted, textDecoration: 'underline' },
  name: { fontSize: 26, fontWeight: 800, letterSpacing: -0.6, marginTop: 4, lineHeight: 1.15 },
  title: { fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 2 },
  section: { marginTop: 7 },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    borderTopWidth: 1.2,
    borderTopColor: COLOR.line,
    paddingTop: 3,
    marginBottom: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  itemTitle: { fontWeight: 700, fontSize: 9.5 },
  itemMeta: { fontWeight: 400, color: COLOR.subtle },
  date: { fontWeight: 600, fontSize: 8.5, color: COLOR.fg },
  item: { marginBottom: 4 },
  bullet: { flexDirection: 'row', marginTop: 1, paddingLeft: 4 },
  bulletDot: { width: 9, color: COLOR.fg },
  bulletText: { flex: 1, color: COLOR.muted },
  justify: { textAlign: 'justify', color: COLOR.muted },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 18 },
  skillCell: { width: '47%', marginBottom: 3 },
  skillLabel: { fontWeight: 700, fontSize: 9 },
  link: { color: COLOR.accent, textDecoration: 'underline' },
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 38,
    right: 38,
    fontFamily: 'Mono',
    fontSize: 6.5,
    color: COLOR.subtle,
    textAlign: 'center',
  },
});

const LABELS: Record<Locale, Record<string, string>> = {
  es: {
    profile: 'Perfil',
    experience: 'Experiencia laboral',
    projects: 'Proyectos',
    skills: 'Habilidades técnicas',
    education: 'Educación',
    languages: 'Idiomas',
    present: 'Presente',
    code: 'Código disponible en',
    credential: 'Validación',
    web: 'Versión web interactiva',
    generated: 'PDF generado automáticamente desde el código fuente',
  },
  en: {
    profile: 'Profile',
    experience: 'Work experience',
    projects: 'Projects',
    skills: 'Technical skills',
    education: 'Education',
    languages: 'Languages',
    present: 'Present',
    code: 'Code available on',
    credential: 'Credential',
    web: 'Interactive web version',
    generated: 'PDF generated automatically from source',
  },
};

interface Props {
  cv: Cv;
  webUrl: string;
  commit: string;
}

const Bullet = ({ children }: { children: ReactNode }) => (
  <View style={s.bullet} wrap={false}>
    <Text style={s.bulletDot}>•</Text>
    <Text style={s.bulletText}>{children}</Text>
  </View>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {children}
  </View>
);

export default function CvDocument({ cv, webUrl, commit }: Props) {
  const { locale } = cv;
  const L = LABELS[locale];
  const webLabel = webUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const contacts: { text: string; href?: string }[] = [
    { text: profile.email, href: `mailto:${profile.email}` },
    ...(profile.phone ? [{ text: profile.phone }] : []),
    { text: 'in/jiglesiasarregui', href: profile.links.linkedin },
    { text: 'github.com/JuanmaIglesias10', href: profile.links.github },
    { text: webLabel, href: webUrl },
  ];

  return (
    <Document
      title={`CV — ${profile.name} — ${cv.focus.label}`}
      author={profile.name}
      subject={cv.focus.title}
      keywords={cv.categories.flatMap((c) => c.items.map((i) => i.name)).join(', ')}
      language={locale === 'es' ? 'es-AR' : 'en-US'}
      creator={webLabel}
      producer="@react-pdf/renderer"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.contact}>
          {contacts.map((c, i) => (
            <Text key={c.text}>
              {i > 0 && <Text>{'  ·  '}</Text>}
              {c.href ? (
                <Link src={c.href} style={s.contactLink}>
                  {c.text}
                </Link>
              ) : (
                c.text
              )}
            </Text>
          ))}
        </Text>
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.title}>{cv.focus.title}</Text>

        <Section title={L.profile}>
          <Text style={s.justify}>{cv.focus.summary}</Text>
        </Section>

        <Section title={L.experience}>
          {cv.experience.map((job) => (
            <View key={job.id} style={s.item}>
              <View style={s.row}>
                <Text style={s.itemTitle}>
                  {job.role} — {job.company}
                </Text>
                <Text style={s.date}>
                  {formatYearMonth(job.start, locale)} –{' '}
                  {job.end ? formatYearMonth(job.end, locale) : L.present}
                </Text>
              </View>
              {job.highlights.map((h) => (
                <Bullet key={h.text}>{h.text}</Bullet>
              ))}
            </View>
          ))}
        </Section>

        <Section title={L.projects}>
          {cv.projects.slice(0, 3).map((p) => (
            <View key={p.id} style={s.item}>
              <View style={s.row}>
                <Text style={s.itemTitle}>
                  {p.data.title} <Text style={s.itemMeta}>[{p.data.kind}]</Text>
                </Text>
                <Text style={s.date}>{p.data.period}</Text>
              </View>
              {p.data.highlights.map((h) => (
                <Bullet key={h}>{h}</Bullet>
              ))}
              {p.data.repo && (
                <Bullet>
                  {L.code}{' '}
                  <Link src={p.data.repo} style={s.link}>
                    {p.data.repo.replace('https://', '')}
                  </Link>
                </Bullet>
              )}
            </View>
          ))}
        </Section>

        <Section title={L.skills}>
          <View style={s.skillsGrid}>
            {cv.categories.map((cat) => (
              <View key={cat.id} style={s.skillCell}>
                <Text style={s.skillLabel}>{cat.label}</Text>
                <Text style={{ color: COLOR.muted }}>{cat.items.map((i) => i.name).join(' · ')}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={L.education}>
          {cv.education.map((edu) => (
            <View key={edu.id} style={[s.row, { marginBottom: 2 }]}>
              <Text style={{ flex: 1 }}>
                <Text style={{ fontWeight: 700 }}>{edu.institution}</Text>
                <Text style={{ color: COLOR.muted }}>
                  {' · '}
                  {edu.title} ({edu.detail})
                </Text>
                {edu.credential && (
                  <Text>
                    {' · '}
                    <Link src={edu.credential} style={s.link}>
                      {L.credential}
                    </Link>
                  </Text>
                )}
              </Text>
              <Text style={s.date}>
                {edu.start}
                {edu.end === null ? ` – ${L.present}` : edu.end !== edu.start ? ` – ${edu.end}` : ''}
              </Text>
            </View>
          ))}
        </Section>

        <Section title={L.languages}>
          <Text>
            {cv.languages.map((lang, i) => (
              <Text key={lang.name}>
                {i > 0 ? '        ' : ''}
                <Text style={{ fontWeight: 700 }}>{lang.name}:</Text>{' '}
                <Text style={{ color: COLOR.muted }}>{lang.level}</Text>
              </Text>
            ))}
          </Text>
        </Section>

        <Text style={s.footer} fixed>
          {L.web}: {webLabel} · {L.generated} ({commit})
        </Text>
      </Page>
    </Document>
  );
}
