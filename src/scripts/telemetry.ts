import { vercelRegions } from '../lib/vercel-regions';

export interface TelemetryResult {
  rtt: number | null;
  samples: number[];
  region: string | null;
  city: string | null;
}

let cached: Promise<TelemetryResult> | null = null;

async function probe(): Promise<TelemetryResult> {
  const samples: number[] = [];
  let vercelId: string | null = null;
  for (let i = 0; i < 3; i++) {
    const start = performance.now();
    try {
      const res = await fetch(`/favicon.svg?probe=${Date.now()}-${i}`, { method: 'HEAD', cache: 'no-store' });
      samples.push(performance.now() - start);
      vercelId ??= res.headers.get('x-vercel-id');
    } catch {
      /* sin conexión: se informa "sin datos" */
    }
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const rtt = sorted.length ? Math.round(sorted[Math.floor(sorted.length / 2)]) : null;
  // x-vercel-id: "gru1::iad1::abc-123" → la primera región es el nodo edge que atendió el request.
  const region = vercelId?.split('::')[0] ?? null;
  return { rtt, samples, region, city: region ? (vercelRegions[region] ?? null) : null };
}

/** Mide una sola vez por carga de página (se reutiliza entre el hero y /status). */
export function measure(): Promise<TelemetryResult> {
  cached ??= probe();
  return cached;
}

export function resetMeasurement() {
  cached = null;
}

export function relativeTime(iso: string, locale: string): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit);
  }
  return rtf.format(Math.round(diff), 'second');
}

/** Completa los elementos con [data-telemetry] de la página actual. */
export async function hydrateTelemetry(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>('[data-telemetry]');
  if (!els.length) return;

  els.forEach((el) => {
    if (el.dataset.telemetry === 'deploy' && el.dataset.builtAt) {
      el.textContent = relativeTime(el.dataset.builtAt, document.documentElement.lang);
    }
  });

  const result = await measure();
  els.forEach((el) => {
    const kind = el.dataset.telemetry;
    const fallback = el.dataset.unavailable ?? '—';
    if (kind === 'rtt') el.textContent = result.rtt === null ? fallback : `${result.rtt} ms`;
    if (kind === 'samples')
      el.textContent = result.samples.length
        ? result.samples.map((s) => `${Math.round(s)}`).join(' · ') + ' ms'
        : fallback;
    if (kind === 'region') el.textContent = result.region ?? (el.dataset.local || fallback);
    if (kind === 'city')
      el.textContent =
        result.city ?? (result.region ? result.region.toUpperCase() : (el.dataset.local ?? ''));
  });
}
