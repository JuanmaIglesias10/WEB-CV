import type { APIRoute, GetStaticPaths } from 'astro';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import CvDocument from '../../pdf/CvDocument';
import { getCv, getFocuses } from '../../lib/cv';
import { buildInfo } from '../../lib/build-info';
import { locales, type Locale } from '../../i18n/ui';
import { cvPdfFile, homePath } from '../../i18n/routes';

export const getStaticPaths = (async () => {
  const focuses = await getFocuses();
  return locales.flatMap((locale) =>
    focuses.map((f) => ({ params: { file: cvPdfFile(locale, f.id) }, props: { locale, focusId: f.id } })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ locale: Locale; focusId: string }> = async ({ props, site }) => {
  const cv = await getCv(props.locale, props.focusId);
  const webUrl = new URL(homePath(props.locale, cv.focus.slug), site).href;
  const element = createElement(CvDocument, {
    cv,
    webUrl,
    commit: buildInfo.shortSha,
  }) as unknown as ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(element);
  return new Response(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf' },
  });
};
