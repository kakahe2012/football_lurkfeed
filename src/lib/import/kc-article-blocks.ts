/** Build KC v3-style HTML blocks for SEO / GEO extraction. */

export function buildTakeaways(items: string[]): string {
  const lis = items.map((t) => `<li>${t}</li>`).join("\n");
  return `<div class="takeaways">\n<h3>Key Takeaways</h3>\n<ul>\n${lis}\n</ul>\n</div>`;
}

export function buildFaqSection(
  faqs: { question: string; answer: string }[]
): string {
  const items = faqs
    .map(
      (f) =>
        `<div class="faq-item">\n<h3>${f.question}</h3>\n<p>${f.answer}</p>\n</div>`
    )
    .join("\n");
  return `<div class="faq-section">\n<h2>Frequently Asked Questions</h2>\n${items}\n</div>`;
}

export function buildPullQuote(text: string): string {
  return `<div class="pull-quote">${text}</div>`;
}

export function buildSourceNote(text: string): string {
  return `<div class="source-note">${text}</div>`;
}

export function buildDisclaimer(text: string): string {
  return `<div class="disclaimer-box">${text}</div>`;
}

export function imgTag(url: string, alt: string): string {
  const u = url.replace(/&/g, "&amp;");
  return `<img src="${u}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy">`;
}

export function wrapArticleBody(inner: string): string {
  return `<div class="article-body">\n${inner.trim()}\n</div>`;
}

export function assembleKcContent(parts: {
  disclaimer?: string;
  takeaways: string[];
  lead: string;
  bodyInner: string;
  faqs: { question: string; answer: string }[];
  sourceNote: string;
}): string {
  const chunks: string[] = [];
  if (parts.disclaimer) chunks.push(buildDisclaimer(parts.disclaimer));
  chunks.push(buildTakeaways(parts.takeaways));
  chunks.push(`<p class="article-lead">${parts.lead}</p>`);
  chunks.push(wrapArticleBody(parts.bodyInner));
  chunks.push(buildFaqSection(parts.faqs));
  chunks.push(buildSourceNote(parts.sourceNote));
  return chunks.join("\n\n");
}
