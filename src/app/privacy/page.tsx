import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-stone-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-stone-500">Last updated: May 2026</p>
        <section className="mt-8 space-y-4 text-sm leading-relaxed text-stone-600">
          <p>
            LurkFeed Football collects anonymous usage data to improve content and advertising.
            We use Google Analytics and Google AdSense. Third parties may use cookies.
          </p>
          <p>Contact: privacy@feelfootball.com</p>
        </section>
        <Link href="/" className="mt-8 inline-block text-sm font-medium text-teal-700 hover:underline">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
