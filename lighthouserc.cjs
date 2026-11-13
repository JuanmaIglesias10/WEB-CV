/**
 * Lighthouse CI: se ejecuta sobre el build estático (`dist/`) en cada push y pull request.
 * Falla si cualquier categoría queda por debajo de 95.
 * @type {import('@lhci/cli').LighthouseRcFile}
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/', '/redes/', '/en/', '/status/', '/proyectos/serverguard/'],
      numberOfRuns: 3,
      settings: {
        // Las APIs externas del panel /status no forman parte de lo que se mide.
        blockedUrlPatterns: ['*api.github.com*', '*api.uptimerobot.com*'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
