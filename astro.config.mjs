// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://home.theston.workers.dev",
  output: "static",
  image: {
    // Remote images fetched and optimized at build time.
    domains: ["raw.githubusercontent.com", "avatars.githubusercontent.com"],
  },
});
