import { createRoot } from 'react-dom/client';
import CommandPalette, { type PaletteLabels } from './CommandPalette';
import type { PaletteItem } from './palette-types';

export interface PaletteHandle {
  open(): void;
  toggle(): void;
  unmount(): void;
}

/** Monta la paleta leyendo los datos serializados por PaletteTrigger.astro en la página actual. */
export function mountPalette(): Promise<PaletteHandle> {
  const raw = document.querySelector('[data-palette-data]')?.textContent ?? '{"items":[],"labels":{}}';
  const data = JSON.parse(raw) as { items: PaletteItem[]; labels: PaletteLabels };
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  return new Promise((resolve) => {
    root.render(
      <CommandPalette
        items={data.items}
        labels={data.labels}
        onReady={(api) =>
          resolve({
            ...api,
            unmount: () => {
              root.unmount();
              container.remove();
            },
          })
        }
      />,
    );
  });
}
