/**
 * generate-registry.mjs
 *
 * Emits a shadcn-style copy-in registry to public/registry/:
 *   - registry.json          — index of all components + metadata
 *   - <slug>.json            — one file per component with file contents
 *
 * Source of truth is the docs registry (slug, sourcePath, dependsOn,
 * requires, exports). Component source is read from disk so the published
 * registry always matches the code.
 *
 * Run:  node scripts/generate-registry.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "registry");

// Minimal parse of the docs registry: pull slug + sourcePath + dependsOn +
// requires + exports without importing TSX. We read the registry file text
// and extract the fields via a tolerant regex per entry object.
async function loadEntries() {
  const src = await readFile(path.join(ROOT, "src/lib/docs/registry.tsx"), "utf8");
  const entries = [];
  // Split on "  {\n    slug:" boundaries within the array.
  const blocks = src.split(/\n {2}\{\n {4}slug: /).slice(1);
  for (const block of blocks) {
    const slug = block.match(/^"([^"]+)"/)?.[1];
    if (!slug) continue;
    const name = block.match(/name:\s*"([^"]+)"/)?.[1] ?? slug;
    const description = block.match(/description:\s*"([^"]+)"/)?.[1] ?? "";
    const category = block.match(/category:\s*"([^"]+)"/)?.[1] ?? "";
    const sourcePath = block.match(/sourcePath:\s*"([^"]+)"/)?.[1];
    const exportsM = block.match(/exports:\s*\[([^\]]*)\]/s);
    const exportsArr = exportsM
      ? [...exportsM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : [];
    const dependsOnM = block.match(/dependsOn:\s*\[([^\]]*)\]/s);
    const dependsOn = dependsOnM ? [...dependsOnM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
    const requiresM = block.match(/requires:\s*\[([^\]]*)\]/s);
    const requires = requiresM ? [...requiresM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
    if (!sourcePath) continue;
    entries.push({ slug, name, description, category, sourcePath, exports: exportsArr, dependsOn, requires });
  }
  return entries;
}

async function readIfExists(rel) {
  try {
    return await readFile(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

async function main() {
  const entries = await loadEntries();
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  await mkdir(OUT, { recursive: true });

  const index = [];

  for (const e of entries) {
    // Collect all files: the component + its non-component requires + the
    // source of each direct dependency component + their requires.
    const filePaths = new Set([e.sourcePath, ...e.requires]);
    for (const dep of e.dependsOn) {
      const d = bySlug.get(dep);
      if (d) {
        filePaths.add(d.sourcePath);
        d.requires.forEach((r) => filePaths.add(r));
      }
    }

    const files = [];
    for (const p of filePaths) {
      const content = await readIfExists(p);
      if (content != null) files.push({ path: p, content });
    }

    const componentJson = {
      slug: e.slug,
      name: e.name,
      description: e.description,
      category: e.category,
      exports: e.exports,
      dependsOn: e.dependsOn,
      files,
    };
    await writeFile(path.join(OUT, `${e.slug}.json`), JSON.stringify(componentJson, null, 2));

    index.push({
      slug: e.slug,
      name: e.name,
      description: e.description,
      category: e.category,
      dependsOn: e.dependsOn,
      fileCount: files.length,
    });
  }

  const registry = {
    name: "kanon",
    homepage: "https://kanon.local",
    style: "pine",
    tailwind: { css: "src/app/globals.css" },
    components: index.sort((a, b) => a.slug.localeCompare(b.slug)),
  };
  await writeFile(path.join(OUT, "registry.json"), JSON.stringify(registry, null, 2));

  console.log(`registry: ${entries.length} components -> ${path.relative(ROOT, OUT)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
