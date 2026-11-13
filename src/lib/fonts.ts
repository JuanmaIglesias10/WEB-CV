import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Fuentes WOFF estáticas (de @fontsource) para el PDF y las imágenes OG, que no soportan WOFF2. */
const dir = (pkg: string) => join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files');

export const fontFiles = {
  inter: (weight: 400 | 500 | 600 | 700 | 800) => join(dir('inter'), `inter-latin-${weight}-normal.woff`),
  mono: (weight: 400 | 500 | 600 | 700) =>
    join(dir('jetbrains-mono'), `jetbrains-mono-latin-${weight}-normal.woff`),
};

export const readFont = (path: string): Buffer => readFileSync(path);
