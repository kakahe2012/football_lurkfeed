/** Extract unique <img src="..."> URLs from article HTML (order preserved). */
export function extractImageSrcs(html: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const re = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const src = m[1];
    if (!seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }
  return out;
}

/** Replace every occurrence of an image URL in HTML (exact string match). */
export function replaceImageSrcInHtml(
  html: string,
  oldSrc: string,
  newSrc: string
): string {
  if (!oldSrc || oldSrc === newSrc) return html;
  return html.split(oldSrc).join(newSrc);
}
