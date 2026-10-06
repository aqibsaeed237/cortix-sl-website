import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Delete your account",
  description:
    "How to delete your Cortix SL account and data — in the app from the Profile screen, or by sending us a deletion request.",
  alternates: { canonical: "/delete-account" },
};

/*
 * Google Play requires a publicly reachable URL that explains account deletion
 * for any app that lets people create an account, and the Data safety form's
 * "You can request that data be deleted" declaration points at this page.
 * Keep it in step with the in-app flow in cortix-sl (Profile → Delete account)
 * and with /privacy.
 */
export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account" updated="7 October 2026">
      <p>
        You can delete your Cortix SL account yourself, at any time, from inside the app. You do not need to ask
        us, and you do not need to explain why.
      </p>

      <h2>In the app — the fastest way</h2>
      <ul>
        <li>Open Cortix SL and go to the <strong>Profile</strong> screen.</li>
        <li>Choose <strong>Delete account</strong>.</li>
        <li>Confirm. The account and its data are removed, and you are signed out.</li>
      </ul>

      <h2>If you cannot open the app</h2>
      <p>
        If you have lost the phone, cannot sign in, or have already uninstalled Cortix SL, send us a deletion
        request from the email address on the account and we will delete it for you:
      </p>
      <ul>
        <li>
          Email <a href="mailto:contact@techcortix.com?subject=Delete%20my%20Cortix%20SL%20account">contact@techcortix.com</a>{" "}
          with the subject “Delete my Cortix SL account”.
        </li>
        <li>
          Or message us on WhatsApp at <a href="https://wa.me/923116124245">+92 311 6124245</a>.
        </li>
      </ul>
      <p>
        We reply to confirm, and we complete the deletion within <strong>30 days</strong> of a verified request. We
        only ask for the account email address — never a password.
      </p>

      <h2>What is deleted</h2>
      <ul>
        <li>Your profile — name, email address and your sign-in account.</li>
        <li>Every expense, budget, recurring bill and category preference on the account.</li>
        <li>Your settings, including notification and email preferences, and your push-notification token.</li>
        <li>The extracted details of any receipt you scanned. The receipt photo itself was never stored.</li>
      </ul>

      <h2>What is kept, and for how long</h2>
      <ul>
        <li>
          <strong>Split-bill groups</strong> — expenses you added to a shared group stay visible to the other
          members, so their balances still add up. Your name is removed from the group.
        </li>
        <li>
          <strong>Feedback you sent us</strong> — kept as product feedback, detached from your account. Ask us in
          the same message and we will delete it too.
        </li>
        <li>
          <strong>Records we are required to keep</strong> — if you paid for Pro, the payment record is kept for as
          long as tax law requires. It holds the transaction, not your expense data.
        </li>
        <li>
          <strong>Encrypted backups</strong> — deleted records can persist in routine database backups for a short
          period before those backups roll over. They are not used to restore a deleted account.
        </li>
      </ul>

      <h2>Deleting the app is not deleting the account</h2>
      <p>
        Uninstalling Cortix SL removes it from your phone but leaves the account on our servers. Use the steps
        above if you want the data gone.
      </p>

      <h2>Just want to export it first?</h2>
      <p>
        Pro and founding members can export everything to CSV, Excel or PDF from the app before deleting. Deletion
        cannot be undone, so take the export first if you want a copy.
      </p>

      <h2>Questions</h2>
      <p>
        Tech Cortix · <a href="mailto:contact@techcortix.com">contact@techcortix.com</a> · WhatsApp{" "}
        <a href="https://wa.me/923116124245">+92 311 6124245</a> · see also our{" "}
        <a href="/privacy">privacy policy</a>.
      </p>
    </LegalPage>
  );
}
