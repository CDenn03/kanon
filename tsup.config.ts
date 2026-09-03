import { defineConfig } from "tsup";
import { preserveDirectivesPlugin } from "esbuild-plugin-preserve-directives";
import path from "node:path";

/*
 * Package build for Kanon.
 *
 * - Multiple entries (barrel + each component/hook/util) so consumers can
 *   deep-import or use the barrel.
 * - `@/*` is aliased to `src/*` so bundled output has no unresolved aliases.
 * - preserveDirectivesPlugin keeps the "use client" directive on client
 *   component files.
 * - ESM + .d.ts. React / React DOM / lucide-react are peers.
 */
export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/ui/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
    "src/lib/utils.ts",
    "src/lib/tokens.ts",
  ],
  format: ["esm"],
  dts: { compilerOptions: { incremental: false, composite: false } },
  clean: true,
  outDir: "dist",
  target: "es2022",
  splitting: true,
  outExtension() {
    return { js: ".js" };
  },
  external: ["react", "react-dom", "lucide-react"],
  esbuildOptions(options) {
    options.alias = { "@": path.resolve(process.cwd(), "src") };
  },
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ["use client", "use server"],
      include: /\.(js|ts|jsx|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
});
