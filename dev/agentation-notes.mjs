// Dev-only Vite plugin: receives Agentation annotations from the browser
// (see src/components/DevTools.astro) and persists them in .agentation/
// so they can be read and processed from the repo.
//
//   .agentation/notes.json  source of truth { pages: { [path]: Annotation[] }, resolved: string[] }
//   .agentation/notes.md    human/agent-readable view, regenerated on every change
//
// POST { op: "resolve", page, ids } moves annotations to `resolved` (processed):
// they are then ignored if the browser syncs them again.
import fs from "node:fs";
import path from "node:path";

export const ROUTE = "/__agentation";
const DIR = path.resolve(".agentation");
const JSON_FILE = path.join(DIR, "notes.json");
const MD_FILE = path.join(DIR, "notes.md");

function load() {
  try {
    const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
    return { pages: data.pages ?? {}, resolved: data.resolved ?? [] };
  } catch {
    return { pages: {}, resolved: [] };
  }
}

function write(file, content) {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

function toMarkdown({ pages }) {
  const out = ["# Agentation notes", ""];
  const entries = Object.entries(pages).filter(([, list]) => list.length);
  if (!entries.length) out.push("_No open notes._", "");
  for (const [page, list] of entries) {
    out.push(`## ${page}`, "");
    [...list]
      .sort((a, b) => a.timestamp - b.timestamp)
      .forEach((a, i) => {
        out.push(`${i + 1}. **${a.comment || "(no comment)"}**`);
        out.push(`   - id: \`${a.id}\` · ${new Date(a.timestamp).toISOString()}`);
        out.push(`   - element: \`${a.element}\``);
        if (a.elementPath) out.push(`   - path: \`${a.elementPath}\``);
        if (a.selectedText) out.push(`   - selected text: "${a.selectedText}"`);
        if (a.nearbyText) out.push(`   - nearby text: "${a.nearbyText.slice(0, 200)}"`);
        if (a.kind && a.kind !== "feedback") out.push(`   - kind: ${a.kind}`);
      });
    out.push("");
  }
  return out.join("\n");
}

function apply(store, msg) {
  const { op, page, annotation, annotations } = msg;
  const list = (store.pages[page] ??= []);
  const open = (a) => a && !store.resolved.includes(a.id);
  const upsert = (a) => {
    const i = list.findIndex((x) => x.id === a.id);
    if (i === -1) list.push(a);
    else list[i] = a;
  };
  switch (op) {
    case "add":
    case "update":
      if (open(annotation)) upsert(annotation);
      break;
    case "delete":
      store.pages[page] = list.filter((x) => x.id !== annotation?.id);
      break;
    case "clear": {
      const ids = new Set((annotations ?? []).map((a) => a.id));
      store.pages[page] = list.filter((x) => !ids.has(x.id));
      break;
    }
    case "resolve": { // mark notes as processed: { ids: string[] }
      const ids = new Set(msg.ids ?? []);
      store.resolved.push(...[...ids].filter((id) => !store.resolved.includes(id)));
      store.pages[page] = list.filter((x) => !ids.has(x.id));
      break;
    }
    case "sync": // initial load: merge what the browser already has
      (annotations ?? []).filter(open).forEach(upsert);
      break;
    default:
      throw new Error(`unknown op: ${op}`);
  }
  if (!store.pages[page].length) delete store.pages[page];
}

/** @returns {import("vite").Plugin} */
export function agentationNotes() {
  return {
    name: "agentation-notes",
    apply: "serve",
    // Register before Astro's own dev middleware, which would 404 the route.
    enforce: "pre",
    configureServer(server) {
      server.config.logger.info(`[agentation-notes] writing to ${path.relative(process.cwd(), MD_FILE)}`);
      server.middlewares.use(ROUTE, (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end();
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const msg = JSON.parse(body);
            if (typeof msg.page !== "string") throw new Error("missing page");
            const store = load();
            apply(store, msg);
            fs.mkdirSync(DIR, { recursive: true });
            write(JSON_FILE, JSON.stringify(store, null, 2) + "\n");
            write(MD_FILE, toMarkdown(store));
            res.statusCode = 204;
            res.end();
          } catch (err) {
            server.config.logger.error(`[agentation-notes] ${err.message}`);
            res.statusCode = 400;
            res.end(String(err.message));
          }
        });
      });
    },
  };
}
