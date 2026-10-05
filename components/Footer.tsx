import { Mail, MessageCircle, Phone } from "lucide-react";
import { fmt } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatPhoneDisplay, telHref, whatsappHref } from "@/lib/api";
import type { Landing } from "@/lib/landing";
import { companyUrl } from "@/lib/seo";
import { StoreBadges } from "./StoreBadges";
import { Logo } from "./ui/Logo";
import { TrackedLink } from "./ui/TrackedLink";

export function Footer({
  t,
  landing,
  privacyHref,
  termsHref,
  onHome = true,
}: {
  t: Dictionary;
  landing: Landing;
  privacyHref: string;
  termsHref: string;
  onHome?: boolean;
}) {
  const c = landing.contact;
  const f = t.footer;
  const base = onHome ? "" : "/";

  const contactLinks = [
    { href: `mailto:${c.email}`, label: c.email, channel: "email", icon: Mail, sr: t.contact.email },
    { href: whatsappHref(c.whatsapp), label: t.contact.whatsapp, channel: "whatsapp", icon: MessageCircle, sr: "" },
    { href: telHref(c.phone), label: formatPhoneDisplay(c.phone), channel: "phone", icon: Phone, sr: t.contact.phone },
  ];

  return (
    <footer className="border-t border-line bg-elevated pb-28 md:pb-0">
      {/* Contact strip */}
      <div className="container-page border-b border-line py-12 md:flex md:items-center md:justify-between md:gap-10">
        <div>
          <h2 className="text-xl font-semibold text-fg">{t.contact.title}</h2>
          <p className="mt-2 text-[15px] text-muted">{t.contact.body}</p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2 md:mt-0">
          {contactLinks.map(({ href, label, channel, icon: Icon, sr }) => (
            <li key={channel}>
              <TrackedLink
                href={href}
                event="contact_click"
                eventProps={{ channel }}
                className="btn btn-secondary"
              >
                <Icon className="size-4 text-accent" aria-hidden />
                {sr && <span className="sr-only">{sr}: </span>}
                {label}
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">{f.tagline}</p>
          <p className="mt-1 text-sm text-muted">{f.madeIn}</p>
          <div className="mt-6">
            <StoreBadges
              location="footer"
              height={40}
              playStoreUrl={c.play_store_url}
              appStoreUrl={c.app_store_url || undefined}
              labels={t.store}
            />
          </div>
        </div>

        <FooterCol title={f.product}>
          <FooterLink href={`${base}#features`}>{t.nav.features}</FooterLink>
          <FooterLink href={`${base}#pricing`}>{t.nav.pricing}</FooterLink>
          <FooterLink href={`${base}#faq`}>{t.nav.faq}</FooterLink>
          <FooterLink href={`${base}#security`}>{t.security.eyebrow}</FooterLink>
        </FooterCol>

        <FooterCol title={f.company}>
          <FooterLink href={companyUrl}>{c.company_name}</FooterLink>
          <FooterLink href="/feedback">{f.feedback}</FooterLink>
          <FooterLink href={`mailto:${c.email}`}>{f.contact}</FooterLink>
        </FooterCol>

        <FooterCol title={f.legal}>
          <FooterLink href={privacyHref}>{f.privacy}</FooterLink>
          <FooterLink href={termsHref}>{f.terms}</FooterLink>
        </FooterCol>
      </div>

      <div className="container-page border-t border-line py-6 text-sm text-subtle">
        {fmt(f.rights, { year: new Date().getFullYear(), company: c.company_name })}
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-fg">{title}</h2>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-fg sm:min-h-9"
      >
        {children}
      </a>
    </li>
  );
}
