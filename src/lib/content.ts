import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content");

export interface ProjectEntry {
  id: string;
  title: string;
  repo: string;
  link: string;
  stack: string[];
  featured: boolean;
  order: number;
  body: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  role: string;
  start: string;
  end: string;
  stack: string[];
  order: number;
  body: string;
}

function stripHtmlComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function readDir(dir: string) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => matter(fs.readFileSync(path.join(full, f), "utf8")));
}

export function getProjects(): ProjectEntry[] {
  return readDir("projects")
    .map(({ data, content }) => ({
      id: String(data.id ?? data.title),
      title: String(data.title ?? "Untitled project"),
      repo: String(data.repo ?? ""),
      link: String(data.link ?? ""),
      stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
      featured: Boolean(data.featured),
      order: Number(data.order ?? 99),
      body: stripHtmlComments(content),
    }))
    .sort((a, b) => a.order - b.order);
}

export function getExperience(): ExperienceEntry[] {
  return readDir("experience")
    .map(({ data, content }) => ({
      id: String(data.id ?? data.title),
      title: String(data.title ?? "Untitled role"),
      company: String(data.company ?? ""),
      role: String(data.role ?? ""),
      start: String(data.start ?? ""),
      end: String(data.end ?? ""),
      stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
      order: Number(data.order ?? 99),
      body: stripHtmlComments(content),
    }))
    .sort((a, b) => a.order - b.order);
}

export function getProfile(): { title: string; body: string } {
  const { data, content } = matter(
    fs.readFileSync(path.join(CONTENT, "profile.md"), "utf8"),
  );
  return { title: String(data.title ?? "About"), body: stripHtmlComments(content) };
}

export function getFaq(): { title: string; body: string } {
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT, "faq.md"), "utf8"));
  return { title: String(data.title ?? "FAQ"), body: stripHtmlComments(content) };
}
