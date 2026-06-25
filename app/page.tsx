import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import {
  defaultDescription,
  defaultTitle,
  jsonLdOrganization,
  jsonLdSoftwareApplication,
  jsonLdWebSite,
  seoKeywords,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
  keywords: [...seoKeywords],
  alternates: { canonical: "/" },
};

function JsonLd() {
  const blocks = [
    jsonLdSoftwareApplication(),
    jsonLdOrganization(),
    jsonLdWebSite(),
  ];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <LandingPage />
    </>
  );
}
