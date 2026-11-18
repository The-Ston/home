# Home

Page d'accueil listant les projets de [The-Ston](https://github.com/The-Ston).
Site statique (HTML/CSS/JS, sans build) servi par un Worker Cloudflare : https://home.theston.workers.dev

## Ajouter un projet

Éditer `public/projects.json` et ajouter une entrée :

```json
{
  "name": "MonProjet",
  "description": "Une phrase qui explique le projet.",
  "tags": ["Rust", "CLI"],
  "repo": "https://github.com/The-Ston/MonProjet",
  "links": [{ "label": "Voir le site", "url": "https://..." }]
}
```

- `repo` génère les boutons **Code** et **Signaler / suggérer** (onglet Issues).
- `links` (optionnel) ajoute des boutons mis en avant (démo, téléchargement…).

Chaque push sur `main` redéploie automatiquement le site.

## Tester en local

```sh
npx wrangler dev
```

Ou n'importe quel serveur statique sur le dossier `public/`.
