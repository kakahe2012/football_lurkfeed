/** Serves Google Search Console HTML-file verification (also in /public). */
export function GET() {
  return new Response("google-site-verification: google6013b7f094cb44fe.html", {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
