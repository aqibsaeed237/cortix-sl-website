import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { defaultLocale, dirFor, htmlLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { companyName, seoKeywords, siteName, siteUrl } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const t = getDictionary(defaultLocale);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070b14",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: t.meta.title,
    template: `%s | ${siteName}`,
  },
  description: t.meta.description,
  keywords: [...seoKeywords],
  authors: [{ name: companyName, url: "https://techcortix.com" }],
  creator: companyName,
  publisher: companyName,
  category: "Finance",
  applicationName: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    // TODO(i18n): add `languages: { en: "/en", ur: "/ur", ar: "/ar", "x-default": "/" }`
  },
  openGraph: {
    title: t.meta.title,
    description: t.meta.description,
    url: "/",
    siteName,
    type: "website",
    locale: "en_US",
    // og:image comes from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.title,
    description: t.meta.description,
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
  // Icons come from app/icon.png and app/apple-icon.png.
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={htmlLang[defaultLocale]}
      dir={dirFor(defaultLocale)}
      data-theme="dark"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
