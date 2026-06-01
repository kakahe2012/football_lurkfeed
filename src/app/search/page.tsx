"use client";

import { useState } from "react";
import { StoryLink } from "@/components/navigation/StoryLink";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { title: string; slug: string; intro_hook: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-lg font-semibold text-stone-900">Search stories</h1>
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="search"
            placeholder="Players, countries, tags…"
            className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-100"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>
        {loading && <p className="mt-6 text-center text-sm text-stone-400">Searching…</p>}
        <ul className="mt-6 space-y-3">
          {results.map((r) => (
            <li key={r.slug}>
              <StoryLink
                href={`/story/${r.slug}`}
                className="block rounded-2xl bg-white p-4 ring-1 ring-stone-200/80 transition hover:ring-teal-200"
              >
                <h2 className="font-medium text-stone-900">{r.title}</h2>
                <p className="mt-1 text-sm text-stone-500">{r.intro_hook}</p>
              </StoryLink>
            </li>
          ))}
        </ul>
        {!loading && query && results.length === 0 && (
          <p className="mt-8 text-center text-sm text-stone-400">No stories found</p>
        )}
      </div>
    </main>
  );
}
