import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { getCv, getFocuses } from '../../lib/cv';
import { fontFiles, readFont } from '../../lib/fonts';
import { profile, SITE_HOST } from '../../data/profile';
import { locales, type Locale } from '../../i18n/ui';

export const getStaticPaths = (async () => {
  const focuses = await getFocuses();
  return locales.flatMap((locale) =>
    focuses.map((f) => ({ params: { file: `${locale}-${f.id}` }, props: { locale, focusId: f.id } })),
  );
}) satisfies GetStaticPaths;

const fonts = [
  { name: 'Inter', data: readFont(fontFiles.inter(400)), weight: 400 as const },
  { name: 'Inter', data: readFont(fontFiles.inter(700)), weight: 700 as const },
  { name: 'Inter', data: readFont(fontFiles.inter(800)), weight: 800 as const },
  { name: 'Mono', data: readFont(fontFiles.mono(500)), weight: 500 as const },
];

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

const C = {
  bg: '#070b12',
  panel: '#0c121c',
  line: '#1f2c3d',
  fg: '#e6edf5',
  muted: '#a3b1c2',
  accent: '#38bdf8',
  ok: '#34d399',
};

export const GET: APIRoute<{ locale: Locale; focusId: string }> = async ({ props }) => {
  const cv = await getCv(props.locale, props.focusId);
  const es = props.locale === 'es';
  const job = cv.experience[0];
  const panels = [
    { label: es ? 'EXPERIENCIA' : 'EXPERIENCE', value: job ? job.company : '—' },
    { label: es ? 'FORMACIÓN' : 'EDUCATION', value: es ? 'UTN FRBA · 5º año' : 'UTN FRBA · 5th year' },
    { label: es ? 'ENFOQUE' : 'FOCUS', value: cv.focus.label },
  ];

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      boxSizing: 'border-box',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingBottom: 60,
      paddingLeft: 72,
      paddingRight: 72,
      backgroundColor: C.bg,
      backgroundImage: `radial-gradient(circle at 50% -10%, rgba(56,189,248,0.22), transparent 55%)`,
      fontFamily: 'Inter',
      color: C.fg,
    },
    [
      h('div', { justifyContent: 'space-between', alignItems: 'center' }, [
        h(
          'div',
          {
            alignItems: 'center',
            gap: 12,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 999,
            border: `1px solid rgba(52,211,153,0.35)`,
            backgroundColor: 'rgba(52,211,153,0.10)',
            color: C.ok,
            fontFamily: 'Mono',
            fontSize: 20,
          },
          [
            h('div', { width: 12, height: 12, borderRadius: 999, backgroundColor: C.ok }),
            es ? 'Todos los sistemas operativos' : 'All systems operational',
          ],
        ),
        h('div', { fontFamily: 'Mono', fontSize: 20, color: C.muted }, SITE_HOST),
      ]),
      h('div', { flexDirection: 'column' }, [
        h('div', { fontSize: 84, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05 }, profile.name),
        h(
          'div',
          {
            marginTop: 22,
            fontFamily: 'Mono',
            fontSize: 26,
            color: C.accent,
            letterSpacing: 1,
            textTransform: 'uppercase',
          },
          cv.focus.title,
        ),
      ]),
      h(
        'div',
        { gap: 18 },
        panels.map((p) =>
          h(
            'div',
            {
              flex: 1,
              flexDirection: 'column',
              gap: 8,
              paddingTop: 18,
              paddingBottom: 18,
              paddingLeft: 22,
              paddingRight: 22,
              borderRadius: 14,
              border: `1px solid ${C.line}`,
              backgroundColor: C.panel,
            },
            [
              h('div', { fontFamily: 'Mono', fontSize: 16, color: C.muted, letterSpacing: 2 }, p.label),
              h('div', { fontSize: 28, fontWeight: 700 }, p.value),
            ],
          ),
        ),
      ),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
