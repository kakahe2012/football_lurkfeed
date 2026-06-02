/**
 * Split article HTML near the 50% mark so an in-article ad sits mid-body.
 * Splits after block-level closings (p, headings, lists, etc.).
 */
export function splitArticleHtmlForInlineAd(html: string): {
  before: string;
  after: string;
} {
  const blockPattern = /<\/(p|h2|h3|h4|ul|ol|blockquote|figure|div)>/gi;
  const splitPoints: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(html)) !== null) {
    splitPoints.push(match.index + match[0].length);
  }

  if (splitPoints.length === 0) {
    return { before: html, after: "" };
  }

  const midBlock = Math.max(1, Math.floor(splitPoints.length / 2));
  const splitAt = splitPoints[midBlock - 1]!;

  return {
    before: html.slice(0, splitAt),
    after: html.slice(splitAt),
  };
}
