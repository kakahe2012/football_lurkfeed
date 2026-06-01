import Link from "next/link";
import { getAllTags } from "@/lib/data/tag-definitions";

export function TagBar() {
  const tags = getAllTags().slice(0, 8);

  return (
    <div className="border-t border-stone-100 bg-[#FAF8F5]/95">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-3 py-2 md:px-6">
        {tags.map((t) => (
          <Link
            key={t.slug}
            href={`/tag/${t.slug}`}
            className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600 transition hover:border-teal-200 hover:text-teal-800"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
