/**
 * Build-time knowledge ingestion.
 *
 * Reads content/**\/*.md and the allowlisted GitHub repos from site.config.ts,
 * and emits:
 *   - src/generated/knowledge.json     (full knowledge pack, used by the chat API)
 *   - src/generated/citation-map.json  (id -> {title,url}, used by the chat UI)
 *
 * Run: npm run ingest   (also runs automatically via predev/prebuild)
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { siteConfig } from "../content/site.config";
import type { CitationMap, KnowledgeChunk } from "../src/lib/knowledge-types";

const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "src", "generated");

const README_MAX_CHARS = 4000;

function readMarkdown(file: string) {
  return matter(fs.readFileSync(file, "utf8"));
}

function listMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function stripHtmlComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function collectContentChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  const profile = readMarkdown(path.join(CONTENT, "profile.md"));
  chunks.push({
    id: String(profile.data.id ?? "profile"),
    type: "profile",
    title: String(profile.data.title ?? "Profile"),
    url: "/about",
    text: stripHtmlComments(profile.content),
  });

  const faq = readMarkdown(path.join(CONTENT, "faq.md"));
  chunks.push({
    id: String(faq.data.id ?? "faq"),
    type: "faq",
    title: String(faq.data.title ?? "FAQ"),
    url: "/about",
    text: stripHtmlComments(faq.content),
  });

  for (const file of listMarkdown(path.join(CONTENT, "experience"))) {
    const { data, content } = readMarkdown(file);
    const id = String(data.id ?? `exp-${path.basename(file, ".md")}`);
    const meta = [
      data.company && `Company: ${data.company}`,
      data.role && `Role: ${data.role}`,
      (data.start || data.end) && `Period: ${data.start ?? "?"} – ${data.end ?? "?"}`,
      Array.isArray(data.stack) && `Stack: ${data.stack.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");
    chunks.push({
      id,
      type: "experience",
      title: String(data.title ?? id),
      url: `/experience#${id}`,
      text: `${meta}\n\n${stripHtmlComments(content)}`,
    });
  }

  for (const file of listMarkdown(path.join(CONTENT, "projects"))) {
    const { data, content } = readMarkdown(file);
    const id = String(data.id ?? `proj-${path.basename(file, ".md")}`);
    const meta = [
      Array.isArray(data.stack) && `Stack: ${data.stack.join(", ")}`,
      data.repo && `Repository: https://github.com/${data.repo}`,
      data.link && `Link: ${data.link}`,
    ]
      .filter(Boolean)
      .join("\n");
    chunks.push({
      id,
      type: "project",
      title: String(data.title ?? id),
      url: `/projects#${id}`,
      text: `${meta}\n\n${stripHtmlComments(content)}`,
    });
  }

  return chunks;
}

async function githubGet(url: string, accept: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ai-portfolio-ingest",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return fetch(url, { headers });
}

async function fetchRepoChunk(fullName: string): Promise<KnowledgeChunk | null> {
  const repoRes = await githubGet(
    `https://api.github.com/repos/${fullName}`,
    "application/vnd.github+json",
  );
  if (!repoRes.ok) {
    console.warn(`[ingest] skipping repo ${fullName}: HTTP ${repoRes.status}`);
    return null;
  }
  const repo = (await repoRes.json()) as {
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    topics?: string[];
    stargazers_count: number;
  };

  let readme = "";
  const readmeRes = await githubGet(
    `https://api.github.com/repos/${fullName}/readme`,
    "application/vnd.github.raw+json",
  );
  if (readmeRes.ok) {
    readme = (await readmeRes.text()).slice(0, README_MAX_CHARS);
  }

  const meta = [
    repo.description && `Description: ${repo.description}`,
    repo.language && `Primary language: ${repo.language}`,
    repo.topics?.length && `Topics: ${repo.topics.join(", ")}`,
    `Stars: ${repo.stargazers_count}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: `repo-${fullName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
    type: "repo",
    title: `GitHub: ${repo.full_name}`,
    url: repo.html_url,
    text: `${meta}\n\nREADME:\n${readme}`,
  };
}

async function main() {
  const chunks = collectContentChunks();

  for (const fullName of siteConfig.githubRepos) {
    try {
      const chunk = await fetchRepoChunk(fullName);
      if (chunk) chunks.push(chunk);
    } catch (err) {
      console.warn(`[ingest] skipping repo ${fullName}:`, err);
    }
  }

  const duplicate = chunks.map((c) => c.id).find((id, i, ids) => ids.indexOf(id) !== i);
  if (duplicate) {
    throw new Error(`Duplicate chunk id "${duplicate}" — ids must be unique across content files.`);
  }

  const citationMap: CitationMap = Object.fromEntries(
    chunks.map((c) => [c.id, { title: c.title, url: c.url }]),
  );

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "knowledge.json"), JSON.stringify(chunks, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "citation-map.json"), JSON.stringify(citationMap, null, 2));

  const bytes = fs.statSync(path.join(OUT_DIR, "knowledge.json")).size;
  console.log(`[ingest] wrote ${chunks.length} chunks (${(bytes / 1024).toFixed(1)} KB) to src/generated/`);
}

main().catch((err) => {
  console.error("[ingest] failed:", err);
  process.exit(1);
});
