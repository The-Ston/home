// Registry of the projects shown on the home page, in display order.
//
// At build time, each project's content is read from `showcase/project.md` in its
// GitHub repository (see README). When that file does not exist yet, the local
// fallback `src/content/fallback/<slug>.md` is used instead.
export interface ProjectRef {
  /** URL segment of the project page: /projets/<slug>/ */
  slug: string;
  /** GitHub repository, "owner/name". */
  repo: string;
}

export const PROJECTS: ProjectRef[] = [
  { slug: "pilalheur", repo: "The-Ston/Pilalheur-releases" },
  { slug: "jensuisla", repo: "The-Ston/Jensuisla" },
  { slug: "ubchaos", repo: "The-Ston/UBChaos" },
];

export const PROFILE = {
  name: "The-Ston",
  github: "https://github.com/The-Ston",
  // Public GitHub avatar of The-Ston (user id 209157140).
  githubAvatar: "https://avatars.githubusercontent.com/u/209157140?v=4",
  tagline:
    "Mes projets perso : applis, outils et expérimentations. Le code est public, les retours sont les bienvenus.",
};
