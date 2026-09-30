import Script from "next/script";

/**
 * Loads Plausible and/or GA4 only when configured:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=sl.techcortix.com   (cookieless — recommended)
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX                   (needs a consent banner for EU/UK visitors)
 * Custom events are sent through lib/analytics.ts `track()`.
 */
export function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const plausibleSrc =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim() || "https://plausible.io/js/script.js";
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <>
      {plausibleDomain && (
        <>
          <Script
            src={plausibleSrc}
            data-domain={plausibleDomain}
            strategy="afterInteractive"
          />
          <Script id="plausible-queue" strategy="afterInteractive">
            {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
          </Script>
        </>
      )}
      {gaId && /^G-[A-Z0-9]+$/.test(gaId) && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}
