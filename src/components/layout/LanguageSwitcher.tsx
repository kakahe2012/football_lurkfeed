"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const onChange = (next: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="lang-select">
        {t("language")}
      </label>
      <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white pl-2 pr-1 shadow-sm">
        <Globe size={14} className="text-stone-400" aria-hidden />
        <select
          id="lang-select"
          value={locale}
          disabled={pending}
          onChange={(e) => onChange(e.target.value as Locale)}
          className="cursor-pointer border-0 bg-transparent py-1.5 pr-6 text-xs font-medium text-stone-700 focus:outline-none focus:ring-0"
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {localeNames[l]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
