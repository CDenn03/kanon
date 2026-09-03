import type { Metadata } from "next";
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
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
