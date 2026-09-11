import type { Metadata } from "next";
import { type ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanon",
  description: "A personal component library",
  icons: {
    icon: "/favicon.svg",
  },
};

// Applies the persisted theme before first paint to avoid a flash.
// Default is light; dark applies only when the user has explicitly chosen it.
const themeScript = `(function(){try{if(localStorage.getItem("kanon-theme")==="dark"){document.documentElement.setAttribute("data-theme","dark");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/*
          Applies the persisted theme before first paint (no flash). Some browser
          extensions rewrite <script> tags in <head> before React hydrates, which
          would otherwise trip a hydration mismatch — suppressHydrationWarning on
          this node ignores such extension-injected attribute changes.
        */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
