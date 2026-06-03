import fs from "node:fs";
import path from "node:path";
import { sanitizeHtml, htmlToText, stripLeadingContentImage } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import type { EmotionType } from "@/types";

export interface ParsedMarkdownArticle {
  title: string;
  slug: string;
  content: string;
  intro_hook: string;
  hero_image: string | null;
  seo_title: string;
  seo_description: string;
  read_time_minutes: number;
  emotion_type: EmotionType;
  tags: string[];
  published_at: string | null;
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function isValidImageUrl(url: string | null): boolean {
  if (!url?.trim()) return false;
  if (!/^https?:\/\//i.test(url)) return false;
  if (/placeholder/i.test(url)) return false;
  return true;
}

function parseOriginalComment(line: string): string | null {
  const m = line.match(/<!--\s*original:\s*(.+?)\s*-->/i);
  return m ? m[1].trim() : null;
}

/** `001-final-rosters-locked-world-cup-2026-06-03.md` → `final-rosters-locked-world-cup` */
export function slugFromMdFilename(filename: string): string {
  const base = path.basename(filename, ".md");
  const m = base.match(/^\d{3}-(.+)-\d{4}-\d{2}-\d{2}$/);
  return m ? m[1] : slugify(base);
}

function dateFromFilename(filename: string): string | null {
  const m = path.basename(filename, ".md").match(/-(\d{4}-\d{2}-\d{2})$/);
  if (!m) return null;
  return new Date(`${m[1]}T12:00:00.000Z`).toISOString();
}

function inferEmotion(title: string, body: string): EmotionType {
  const t = `${title} ${body}`.toLowerCase();
  if (/probability|prediction|odds|rank|ranking|top \d+|valuable|stats/.test(t)) {
    return "hype";
  }
  if (/snub|drama|controversy|heartbreak/.test(t)) return "heartbreak";
  if (/messi|ronaldo|yamal|mbapp|haaland|neymar/.test(t)) return "icons";
  return "culture";
}

function markdownBodyToHtml(lines: string[]): string {
  const out: string[] = [];
  let pendingOriginal: string | null = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    const original = parseOriginalComment(trimmed);
    if (original) {
      pendingOriginal = original;
      i++;
      continue;
    }

    const img = trimmed.match(/^!\[([^\]]*)\]\([^)]+\)/);
    if (img) {
      const url = pendingOriginal;
      pendingOriginal = null;
      if (isValidImageUrl(url)) {
        out.push(
          `<img src="${escapeAttr(url!)}" alt="${escapeAttr(img[1])}" loading="lazy">`
        );
      }
      i++;
      continue;
    }
    pendingOriginal = null;

    if (!trimmed) {
      i++;
      continue;
    }
    if (trimmed === "---") {
      i++;
      continue;
    }
    if (trimmed.startsWith("**Source:**")) {
      break;
    }

    if (trimmed.startsWith("### ")) {
      out.push(`<h3>${inlineMd(trimmed.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      out.push(`<h2>${inlineMd(trimmed.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (trimmed.startsWith("> ")) {
      out.push(`<blockquote><p>${inlineMd(trimmed.slice(2))}</p></blockquote>`);
      i++;
      continue;
    }
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines.filter((r) => !/^\|[\s\-:|]+\|$/.test(r));
      if (rows.length) {
        const cells = rows.map((r) =>
          r
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );
        const head = cells[0];
        const body = cells.slice(1);
        out.push("<table><thead><tr>");
        head.forEach((c) => out.push(`<th>${inlineMd(c)}</th>`));
        out.push("</tr></thead><tbody>");
        body.forEach((row) => {
          out.push("<tr>");
          row.forEach((c) => out.push(`<td>${inlineMd(c)}</td>`));
          out.push("</tr>");
        });
        out.push("</tbody></table>");
      }
      continue;
    }
    if (trimmed.startsWith("- ")) {
      out.push("<ul>");
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        out.push(`<li>${inlineMd(lines[i].trim().slice(2))}</li>`);
        i++;
      }
      out.push("</ul>");
      continue;
    }

    out.push(`<p>${inlineMd(trimmed)}</p>`);
    i++;
  }

  return out.join("\n");
}

export function parseMarkdownFile(
  filePath: string,
  defaultEmotion: EmotionType = "culture"
): ParsedMarkdownArticle {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const filename = path.basename(filePath);

  const titleLine = lines.find((l) => /^#\s+/.test(l));
  const title = titleLine
    ? titleLine.replace(/^#\s+/, "").trim()
    : slugFromMdFilename(filename);

  const readM = raw.match(/⏳\s*(\d{1,2})\s*min\s*read/i);
  const read_time_minutes = readM ? Math.max(1, parseInt(readM[1], 10)) : 5;

  const introM = raw.match(
    /\*\*The short version:\*\*\s*([\s\S]*?)(?=\n---|\n##|\n\*\*Source:)/i
  );
  const intro_hook = introM
    ? introM[1].replace(/\n+/g, " ").trim().slice(0, 280)
    : htmlToText(raw, 200).slice(0, 200);

  const firstHr = lines.findIndex((l) => l.trim() === "---");
  const bodyLines =
    firstHr >= 0 ? lines.slice(firstHr + 1) : lines.slice(1);
  let content = sanitizeHtml(markdownBodyToHtml(bodyLines));

  const imgUrls: string[] = [];
  const imgRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let im: RegExpExecArray | null;
  while ((im = imgRe.exec(content)) !== null) {
    imgUrls.push(im[1]);
  }
  const hero_image = imgUrls[0] || null;

  content = stripLeadingContentImage(content);

  const slug = slugFromMdFilename(filename);
  const tags = [
    slug,
    "world-cup-2026",
    "worldcup2026",
    ...slug.split("-").filter((w) => w.length > 3).slice(0, 4),
  ].slice(0, 8);

  const emotion = inferEmotion(title, content) || defaultEmotion;
  const seo_description = intro_hook.slice(0, 200);

  return {
    title,
    slug,
    content,
    intro_hook,
    hero_image,
    seo_title: title.slice(0, 70),
    seo_description,
    read_time_minutes,
    emotion_type: emotion,
    tags: [...new Set(tags.map((t) => slugify(t) || t).filter(Boolean))],
    published_at: dateFromFilename(filename),
  };
}
