// Lee los reportes de `lhci collect` (.lighthouseci/lhr-*.json) y escribe la mediana por categoría
// en src/data/lighthouse.json, que consume la página /status.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const url = process.argv[2] ?? 'https://juanmanueliglesias.vercel.app/';
const dir = '.lighthouseci';
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

const reports = readdirSync(dir)
  .filter((f) => /^lhr-.*\.json$/.test(f))
  .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));

if (!reports.length) {
  console.error('No se encontraron reportes de Lighthouse en .lighthouseci/');
  process.exit(1);
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const scores = Object.fromEntries(
  categories.map((cat) => [
    cat,
    Math.round(median(reports.map((r) => (r.categories[cat]?.score ?? 0) * 100))),
  ]),
);

const summary = { measuredAt: new Date().toISOString(), url, scores };
writeFileSync('src/data/lighthouse.json', `${JSON.stringify(summary, null, 2)}\n`);
console.log(`Lighthouse (${reports.length} corridas):`, scores);
