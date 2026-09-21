import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import ChatWidget from "@/components/ChatWidget";
import { siteConfig } from "../../content/site.config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100`}
      >
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-4xl border-t border-zinc-200 px-4 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <div className="flex flex-wrap gap-4">
            <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100">GitHub</a>
            <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100">LinkedIn</a>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">Email</a>
          </div>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
