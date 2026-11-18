import { defineCollection } from "astro:content";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PROJECTS } from "./projects";
import { fetchRepoMeta, fetchText, rawUrl } from "./lib/github";

const link = z.object({ label: z.string(), url: z.url() });
const screenshot = z.object({
  src: z.string(),
  alt: z.string().default(""),
  caption: z.string().optional(),
});

// Frontmatter of `showcase/project.md` (or of the local fallback), plus the
// fields computed by the loader (repo, order, source).
const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  links: z.array(link).default([]),
  /** Card / hero visual. Relative paths resolve against the showcase folder. */
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  /** Square app icon shown on the hero. */
  icon: z.string().optional(),
  screenshots: z.array(screenshot).default([]),
  technologies: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  status: z.string().optional(),
  version: z.string().optional(),
  repo: z.string(),
  order: z.number(),
  source: z.enum(["showcase", "local"]),
});

export type ProjectData = z.infer<typeof projectSchema>;

/** Makes a relative asset path absolute against the showcase base URL. */
function resolveAsset(path: string | undefined, base: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
  return new URL(path.replace(/^\.\//, ""), base).href;
}

/** Rewrites relative src/href attributes of rendered Markdown against the base URL. */
function rebaseHtml(html: string, base: string): string {
  return html.replace(/\b(src|href)="(?!https?:|\/|#|mailto:)([^"]+)"/g, (_m, attr: string, path: string) => {
    return `${attr}="${new URL(path.replace(/^\.\//, ""), base).href}"`;
  });
}

const showcaseLoader: Loader = {
  name: "github-showcase",
  async load({ store, parseData, renderMarkdown, generateDigest, logger }) {
    store.clear();
    for (const [order, ref] of PROJECTS.entries()) {
      let text = await fetchText(rawUrl(ref.repo, "showcase/project.md"));
      let source: "showcase" | "local" = "showcase";
      let base = rawUrl(ref.repo, "showcase/");
      if (text === null) {
        source = "local";
        base = "https://local.invalid/";
        try {
          text = await readFile(join(process.cwd(), "src/content/fallback", `${ref.slug}.md`), "utf8");
        } catch {
          logger.warn(`${ref.slug}: no showcase/project.md in ${ref.repo} and no local fallback, skipped`);
          continue;
        }
        logger.info(`${ref.slug}: using local fallback`);
      } else {
        logger.info(`${ref.slug}: using showcase from ${ref.repo}`);
      }

      const rendered = await renderMarkdown(text);
      const fm = (rendered.metadata?.frontmatter ?? {}) as Record<string, any>;
      const meta = await fetchRepoMeta(ref.repo);
      const assetBase = source === "showcase" ? base : undefined;
      const resolve = (p?: string) => (assetBase ? resolveAsset(p, assetBase) : p);

      const data = await parseData({
        id: ref.slug,
        data: {
          ...fm,
          cover: resolve(fm.cover),
          icon: resolve(fm.icon),
          screenshots: (fm.screenshots ?? []).map((s: Record<string, any>) => ({ ...s, src: resolve(s.src) })),
          technologies: fm.technologies ?? (meta.language ? [meta.language] : []),
          version: fm.version ?? meta.latestVersion,
          repo: ref.repo,
          order,
          source,
        },
      });

      if (assetBase) rendered.html = rebaseHtml(rendered.html, assetBase);
      store.set({ id: ref.slug, data, rendered, digest: generateDigest(text + JSON.stringify(meta)) });
    }
  },
};

export const collections = {
  projects: defineCollection({ loader: showcaseLoader, schema: projectSchema }),
};
