import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        {/*
          Applies the persisted theme before first paint (no flash). Uses
          beforeInteractive strategy to ensure the script runs before hydration,
          preventing a flash of wrong theme on page load.
        */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
