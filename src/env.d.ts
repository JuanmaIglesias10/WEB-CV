interface ThemeController {
  get(): 'light' | 'dark';
  set(theme: 'light' | 'dark'): void;
  toggle(): void;
}

interface Window {
  __theme?: ThemeController;
}

interface ImportMetaEnv {
  /** API key de solo lectura de un monitor de UptimeRobot (opcional). */
  readonly PUBLIC_UPTIMEROBOT_KEY?: string;
}
