/** Admin API fetch — sends session cookie. */
export async function adminFetch(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
}

/** Upload image (multipart) — do not set Content-Type manually. */
export async function adminUpload(
  file: File,
  slug: string
): Promise<{ url?: string; storage?: string; error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("slug", slug);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error || "上传失败" };
  return data;
}
