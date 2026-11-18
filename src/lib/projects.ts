import { getCollection, type CollectionEntry } from "astro:content";
import { repoUrl } from "./github";

export type Project = CollectionEntry<"projects">;

// Hue rotation for the per-project generated visuals.
const HUES = [14, 262, 168, 335, 205, 48, 96];

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection("projects");
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const hueOf = (p: Project) => HUES[p.data.order % HUES.length];
export const initialOf = (p: Project) => p.data.name.charAt(0).toUpperCase();
export const pageUrl = (p: Project) => `/projets/${p.id}/`;
export const codeUrl = (p: Project) => repoUrl(p.data.repo);
export const issuesUrl = (p: Project) => `${repoUrl(p.data.repo)}/issues`;
export const linkIcon = (label: string) => (/apk|t[ée]l[ée]charg|download/i.test(label) ? "download" : "arrow");
export const pad = (n: number) => String(n).padStart(2, "0");
