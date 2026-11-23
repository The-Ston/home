// @ts-check
import { defineConfig } from "astro/config";
import { agentationNotes } from "./dev/agentation-notes.mjs";

export default defineConfig({
  site: "https://home.theston.workers.dev",
  output: "static",
  vite: {
    // Dev server only: persists Agentation notes to .agentation/.
    plugins: [agentationNotes()],
  },
  image: {
    // Remote images fetched and optimized at build time.
    domains: [
      "raw.githubusercontent.com",
      "avatars.githubusercontent.com",
      // Local preview of showcase folders (see SHOWCASE_BASE_URL).
      ...(process.env.SHOWCASE_BASE_URL ? [new URL(process.env.SHOWCASE_BASE_URL).hostname] : []),
    ],
  },
});
