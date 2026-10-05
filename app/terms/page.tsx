import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for using the Cortix SL app and website.",
  alternates: { canonical: "/terms" },
};

/*
 * TODO(legal): review with counsel (governing law, liability caps, refunds
 * once paid billing exists) before setting `terms_url` in app_config.
 */
export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="5 October 2026">
      <p>
        These terms cover your use of the Cortix SL app and sl.techcortix.com, provided by <strong>Tech Cortix</strong>.
        By creating an account you agree to them.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Keep your sign-in details secure. You’re responsible for activity on your account.</li>
        <li>Give accurate information and don’t use someone else’s account.</li>
      </ul>

      <h2>Plans</h2>
      <ul>
        <li><strong>Free</strong> includes a monthly expense limit and core features, as described on our pricing section.</li>
        <li><strong>Pro</strong> is PKR 1,499 per month or PKR 14,990 per year (two months free). You choose the plan in the app. We activate it after payment is confirmed. Store checkout is not available yet.</li>
        <li>
          <strong>Founding member</strong> access is assigned automatically to a limited number of early sign-ups and gives
          Pro-level features for the stated period. Afterwards your account moves to Free unless you upgrade.
        </li>
        <li>Features and limits may change; we’ll give notice of material changes to paid features.</li>
      </ul>

      <h2>AI features</h2>
      <p>
        Receipt scanning, voice/AI entry and AI answers are generated automatically and can be wrong. Always review
        amounts and categories before relying on them. Cortix SL is a tracking tool and does not provide financial,
        tax or legal advice.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don’t misuse the service, attempt to access other users’ data, or overload our systems.</li>
        <li>Don’t upload content you don’t have the right to use.</li>
      </ul>

      <h2>Your content</h2>
      <p>
        You own the data you add. You give us permission to store and process it only to provide the service, as
        described in our <a href="/privacy">privacy policy</a>.
      </p>

      <h2>Termination</h2>
      <p>
        You can delete your account at any time from the app. We may suspend accounts that break these terms.
      </p>

      <h2>Disclaimer and liability</h2>
      <p>
        The service is provided “as is”. To the extent permitted by law, Tech Cortix is not liable for indirect or
        consequential losses arising from your use of the service.
        {/* TODO(legal): governing law / jurisdiction clause. */}
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:contact@techcortix.com">contact@techcortix.com</a>
      </p>
    </LegalPage>
  );
}
