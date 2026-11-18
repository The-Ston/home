# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions follow [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

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

[Unreleased]: https://github.com/The-Ston/home/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/The-Ston/home/releases/tag/v0.1.0
