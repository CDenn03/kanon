import { LibraryShell } from "@/components/docs/library-shell";
import { buildNav } from "@/lib/docs/registry";

/**
 * Docs layout — renders the persistent shell (Sidebar + Navbar + search)
 * once for every page in this group, so navigating between the overview and
 * component pages is a client-side content swap (no shell remount / refresh,
 * sidebar collapse state preserved).
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = buildNav();
  return <LibraryShell nav={nav}>{children}</LibraryShell>;
}
