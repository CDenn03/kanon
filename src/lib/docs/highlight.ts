import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type Highlighter } from "shiki";

/*
 * Docs source loader + syntax highlighter (server-only).
 *
 * - `loadSource(relPath)` reads a file from the repo at build/request time,
 *   so the code shown in the docs is always exactly what's on disk.
 * - `highlight(code, lang)` renders shiki HTML. A single highlighter
 *   instance is cached across calls.
 */

const REPO_ROOT = process.cwd();

/** Read a source file relative to the project root (e.g. "src/components/ui/button.tsx"). */
export async function loadSource(relPath: string): Promise<string> {
  const abs = path.join(REPO_ROOT, relPath);
  const raw = await readFile(abs, "utf8");
  return raw.replace(/\s+$/, "") + "\n";
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["tsx", "typescript", "bash", "css", "json"],
    });
  }
  return highlighterPromise;
}

export type CodeLang = "tsx" | "typescript" | "bash" | "css" | "json";

/** Render code to themed HTML using shiki. Returns a `<pre>…</pre>` string. */
export async function highlight(code: string, lang: CodeLang = "tsx"): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code.replace(/\s+$/, ""), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  });
}
