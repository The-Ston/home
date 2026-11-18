# Home

Page d'accueil listant les projets de [The-Ston](https://github.com/The-Ston), avec une page par projet.
Site statique généré par [Astro](https://astro.build) et servi par un Worker Cloudflare : https://home.theston.workers.dev

## Ajouter un projet

1. Ajouter une ligne dans `src/projects.ts` :

   ```ts
   { slug: "monprojet", repo: "The-Ston/MonProjet" },
   ```

2. Dans le dépôt du projet (qui doit être public), créer un dossier `showcase/` :

   ```
   showcase/
     project.md          fiche du projet (voir ci-dessous)
     cover.png           visuel de la carte et de l'en-tête (16:9 conseillé)
     icon.png            icône carrée (optionnelle)
     screenshots/*.png   captures pour la galerie
   ```

   `showcase/project.md` :

   ```markdown
   ---
   name: MonProjet
   description: Une phrase qui présente le projet.
   tags: [Rust, CLI]
   links:                       # boutons mis en avant (optionnel)
     - label: Télécharger
       url: https://github.com/The-Ston/MonProjet/releases/latest
   cover: cover.png             # chemins relatifs au dossier showcase/
   coverAlt: Écran principal de MonProjet
   icon: icon.png
   screenshots:
     - src: screenshots/accueil.png
       alt: Écran d'accueil
       caption: L'écran d'accueil
   technologies: [Rust]         # par défaut : langage principal du dépôt
   platforms: [Windows, Linux]
   status: Actif
   ---

   Description longue en Markdown, affichée dans « Présentation » sur la page du projet.
   ```

   La dernière version est lue automatiquement depuis les releases GitHub.
   Les boutons **Code** et **Signaler / suggérer** (onglet Issues) sont ajoutés automatiquement.

Tant qu'un dépôt n'a pas de `showcase/project.md`, le build utilise la fiche locale
`src/content/fallback/<slug>.md` (même format) et un visuel généré.

## Photo de profil

Déposer l'image dans `src/assets/avatar.png` (ou `.jpg` / `.webp`). Sans elle, le monogramme « TS » est affiché.

## Développement

```sh
npm install
npm run dev       # serveur de dev Astro
npm run build     # génère dist/
npm run preview   # sert dist/ avec Wrangler, comme en production
npm run check     # vérification des types
```

Variable d'environnement optionnelle au build : `GITHUB_TOKEN` (relève la limite de l'API GitHub, 60 requêtes/heure sans).

## Déploiement

Cloudflare Workers Builds, branché sur ce dépôt : chaque push sur `main` lance `npm run build` puis `npx wrangler deploy`.
