import { execSync } from 'node:child_process';

function git(command: string): string | null {
  try {
    return (
      execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim() || null
    );
  } catch {
    return null;
  }
}

const env = process.env;

const sha = env.VERCEL_GIT_COMMIT_SHA || env.GITHUB_SHA || git('rev-parse HEAD') || 'local';

/** Información del build, calculada una sola vez (en build time) y compartida por todas las páginas. */
export const buildInfo = {
  sha,
  shortSha: sha === 'local' ? 'local' : sha.slice(0, 7),
  message: env.VERCEL_GIT_COMMIT_MESSAGE || git('log -1 --pretty=%s') || '',
  branch: env.VERCEL_GIT_COMMIT_REF || env.GITHUB_REF_NAME || git('rev-parse --abbrev-ref HEAD') || '',
  environment: env.VERCEL_ENV || (env.CI ? 'ci' : 'local'),
  builtAt: new Date().toISOString(),
} as const;
