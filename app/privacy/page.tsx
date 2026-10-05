import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Cortix SL collects, uses and protects your data — receipts, voice entries, AI processing, storage and deletion.",
  alternates: { canonical: "/privacy" },
};

/*
 * TODO(legal): have this reviewed by counsel before setting `privacy_url` in
 * the admin app_config. Every statement below reflects the current code in
 * cortix-sl (Flutter) and cortix-sl-backend — update it when those change.
 */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="5 October 2026">
      <p>
        This policy explains how <strong>Tech Cortix</strong> (“we”, “us”) handles information in the Cortix SL
        mobile app and on sl.techcortix.com. We wrote it to be read, not skimmed past.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account details</strong> — your email address and name, or your Google account basics if you sign in with Google.</li>
        <li><strong>Expense data you enter</strong> — amounts, merchants, categories, dates, notes, budgets, currency preference and split-bill groups (member names or emails you add).</li>
        <li><strong>Receipt photos</strong> — only when you choose to scan one (see “AI processing” below).</li>
        <li><strong>Text from voice, AI entry, or a bank SMS you paste</strong> — the text of what you typed, said, or pasted. Pasted messages are used to suggest expenses you confirm. We do not read your SMS inbox.</li>
        <li><strong>Device and usage data</strong> — app events, device type and push-notification token, used to run and improve the app. You can turn product analytics off in Settings → Privacy.</li>
        <li><strong>Website waitlist</strong> — the email address you submit, stored so we can contact you about Cortix SL.</li>
        <li><strong>Product feedback</strong> — messages, optional name/email, category and screenshots you choose to send from the website or app, so we can improve Cortix SL.</li>
      </ul>

      <h2>AI processing</h2>
      <ul>
        <li>
          <strong>Receipt scans</strong> are sent from our servers to <strong>Google Gemini</strong> to read the merchant,
          amount, date and category. We store the extracted fields — not the photo.
        </li>
        <li>
          <strong>Voice entry</strong> is transcribed on your phone by your device’s speech engine. Only the resulting
          text is sent to our servers and to Google Gemini to create the expense.
        </li>
        <li><strong>AI search</strong> questions and AI split-bill text are sent to Google Gemini to generate an answer.</li>
      </ul>
      <p>
        Google processes this content under its Gemini API terms. For AI bill splitting, the participant names you
        entered are included so the split can be matched to people.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To provide the app: storing your expenses, budgets, analytics, exports and split bills.</li>
        <li>To send alerts and notifications you’ve enabled.</li>
        <li>To provide support and activate plan upgrades you request.</li>
        <li>For personalised insights, if enabled in Settings → Privacy.</li>
        <li>For marketing emails only if you opt in (off by default).</li>
      </ul>
      <p><strong>We never sell your personal information</strong> and there are no ads in the app.</p>

      <h2>Storage and security</h2>
      <ul>
        <li>Data is stored in a Supabase Postgres database (AWS ap-south-1 region). Our API runs on Render (United States).</li>
        <li>All traffic between the app and our servers is encrypted with HTTPS.</li>
        <li>Row-level security is enabled on every table, so each account can only access its own records.</li>
        <li>Crash reports are collected with Firebase Crashlytics to fix bugs.</li>
      </ul>

      <h2>Your choices and rights</h2>
      <ul>
        <li><strong>Privacy toggles</strong> — turn analytics, personalised insights and marketing emails on or off in Settings → Privacy.</li>
        <li><strong>Export</strong> — Pro and founding members can export their expenses as CSV, Excel or PDF.</li>
        <li>
          <strong>Delete your account</strong> — from the Profile screen. This removes your profile, expenses and settings
          and deletes your sign-in account.
        </li>
        <li>
          <strong>Waitlist</strong> — email us to remove your address from the website waitlist.
        </li>
        <li>To request a copy or correction of your data, contact us at the address below.</li>
      </ul>

      <h2>Retention</h2>
      <p>
        We keep your data while your account is active. When you delete your account, your records are removed.
        {/* TODO(legal): state backup retention period and audit-log retention once defined. */}
      </p>

      <h2>Children</h2>
      <p>Cortix SL is not directed at children under 13, and we don’t knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>If we change this policy in a meaningful way, we’ll update the date above and tell you in the app.</p>

      <h2>Contact</h2>
      <p>
        Tech Cortix · <a href="mailto:contact@techcortix.com">contact@techcortix.com</a> · WhatsApp{" "}
        <a href="https://wa.me/923116124245">+92 311 6124245</a>
      </p>
    </LegalPage>
  );
}
