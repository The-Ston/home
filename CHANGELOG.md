# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions follow [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Fixed
- Project versions are read from the github.com release redirect instead of the REST API, whose
  anonymous rate limit left the deployed pages showing "Aucune version publiée".

## [0.2.0] - 2026-11-23

### Added
- Watercolor cover illustration on the home profile (a workbench facing a frosted window onto
  night mountains), whose palette follows the light and dark themes.
- `iconBackground` field in `showcase/project.md`: color behind a project's icon.
- "Signaler / suggérer" button in the feedback section of project pages.
- The profile picture is used as the tab icon and the home screen icon.
- Development only: Agentation annotation toolbar in `astro dev`, with notes saved to `.agentation/`.
- `LICENSE` file stating all rights are reserved (`"license": "UNLICENSED"` in `package.json`).

### Changed
- Real project icons sit on a neutral background instead of the generated gradient.
- The GitHub avatar in the GitHub button sits on a background that contrasts with the button.
- The repository name in the project info sheet is shown under its label.
- Page titles use a plain hyphen instead of an em dash.
- Profile tagline says the code is public rather than open.

### Removed
- "Étiquettes" counter in the home profile.
- Decorative circles on the home cover.

### Fixed
- Repository names no longer wrap mid-name in the project info sheet.

## [0.1.0] - 2026-11-18

First numbered version, covering everything built since the project started.

### Added
- Home page listing the projects as cards, with search and tag filters.
- One page per project: cover, icon, screenshot gallery with a viewer, long description and info sheet.
- Project content read at build time from the `showcase/` folder of each GitHub repository,
  with a local fallback when a repository has none.
- Latest version and main language read from GitHub.
- Projects: Pilalheur, Jensuisla and UBChaos.
- Light and dark themes, following the system by default, with a remembered toggle.
- Profile picture, and a GitHub profile button showing the GitHub avatar.
- `SHOWCASE_BASE_URL` to preview showcase folders before publishing them.
- Version number in the footer, linked to this changelog.

### Fixed
- Remote images are no longer cropped when resized.

[Unreleased]: https://github.com/The-Ston/home/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/The-Ston/home/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/The-Ston/home/releases/tag/v0.1.0
