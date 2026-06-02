import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/utils";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "LurkFeed Football — Football. The fun parts.",
    template: "%s | LurkFeed Football",
  },
  description:
    "Your World Cup gossip, drama & culture corner — built for new fans. Stories, players, fashion, memes, and the messy magic of football.",
  applicationName: "LurkFeed Football",
  authors: [{ name: "LurkFeed Football" }],
  creator: "LurkFeed Football",
  publisher: "LurkFeed Football",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LurkFeed Football",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: getSiteUrl(),
    types: {
      "application/rss+xml": [
        { url: `${getSiteUrl()}/feed.xml`, title: "LurkFeed Football" },
      ],
    },
  },
  verification: {
    google: "google6013b7f094cb44fe",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Site-wide entity graph: Organization (publisher identity) + WebSite (with
  // SearchAction for sitelinks searchbox + AI-engine query template).
  // Emitted on every page so any landing surface gives crawlers the same
  // anchor entities to attach to.
  const orgSchema = buildOrganizationSchema();
  const siteSchema = buildWebSiteSchema();

  return (
    <html lang="en">
      <head>
        {/* Preconnect to image / analytics / ads origins so first-contentful-
            paint isn't blocked by DNS+TLS. Each saves ~80–200 ms on cold mobile. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <meta
          name="google-adsense-account"
          content="ca-pub-8307718514196180"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <GoogleAnalytics />
        <AdSenseScript />
        {children}
      </body>
    </html>
  );
}
