// Build-time helpers reading public data from GitHub.
// Every call is best effort: a network failure must never break the build.

const TIMEOUT_MS = 10_000;

/** Base URL of a file in the default branch of a repository. */
export function rawUrl(repo: string, path = ""): string {
  // SHOWCASE_BASE_URL serves "<owner>/<name>/..." from elsewhere (local preview).
  const base = process.env.SHOWCASE_BASE_URL;
  if (base) return `${base.replace(/\/$/, "")}/${repo}/${path}`;
  return `https://raw.githubusercontent.com/${repo}/HEAD/${path}`;
}

export function repoUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

function apiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "home-site-build",
  };
  // Optional token to lift the anonymous rate limit (60 requests/hour per IP).
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Fetches a text file, returning null on 404 or any error. */
export async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: apiHeaders(), signal: AbortSignal.timeout(TIMEOUT_MS) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export interface RepoMeta {
  language?: string;
  latestVersion?: string;
}

/**
 * Tag of the latest release, read from the redirect of github.com/<repo>/releases/latest
 * (".../releases/tag/<tag>"), which is not subject to the REST API rate limit.
 * Without any release GitHub redirects to ".../releases": undefined.
 */
async function fetchLatestTag(repo: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${repoUrl(repo)}/releases/latest`, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const match = res.headers.get("location")?.match(/\/releases\/tag\/([^/?#]+)$/);
    return match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

/** Primary language and latest release tag of a repository. */
export async function fetchRepoMeta(repo: string): Promise<RepoMeta> {
  const [info, latestVersion] = await Promise.all([
    fetchJson<{ language: string | null }>(`https://api.github.com/repos/${repo}`),
    fetchLatestTag(repo),
  ]);
  return { language: info?.language ?? undefined, latestVersion };
}
