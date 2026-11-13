export type PaletteAction =
  | { kind: 'link'; href: string; external?: boolean }
  | { kind: 'download'; href: string; filename: string }
  | { kind: 'copy'; value: string; toast: string }
  | { kind: 'theme' };

export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  action: PaletteAction;
}
