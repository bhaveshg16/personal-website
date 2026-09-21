import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import ChatWidget from "@/components/ChatWidget";
import { siteConfig } from "../../content/site.config";

const inter = Inter({ variable: "--font-body", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-5 py-12">{children}</main>
        <footer className="mx-auto max-w-3xl px-5 py-10">
          <div className="border-t border-stone-200 pt-6 text-sm text-stone-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-display text-base text-stone-600">
                {siteConfig.name}
              </span>
              <div className="flex gap-5">
                <a href={siteConfig.socials.github} target="_blank" rel="noreferrer" className="hover:text-stone-900">GitHub</a>
                <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-stone-900">LinkedIn</a>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-stone-900">Email</a>
              </div>
            </div>
          </div>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
