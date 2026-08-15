import { Link } from "react-router";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./LegalPage.css";

const LAST_UPDATED = "August 15, 2026";
const CONTACT_EMAIL = "hello@epictetusproject.com";

export default function PrivacyPolicyPage() {
    return (
        <div className="legal-page">
            <SiteHeader />

            <main className="legal-shell">
                <span className="legal-eyebrow">Legal</span>
                <h1 className="legal-title">Privacy Policy</h1>
                <p className="legal-updated">Last updated: {LAST_UPDATED}</p>

                <p className="legal-notice">
                    This is a plain-language policy written for the Project Epictetus MVP. It is not a
                    substitute for legal advice. Because this service is used by high school students,
                    have it reviewed by an attorney familiar with student-data and privacy law (COPPA,
                    FERPA, and applicable state student-privacy laws) before relying on it.
                </p>

                <div className="legal-body">
                    <h2>Who we are</h2>
                    <p>
                        Project Epictetus ("Epictetus", "we", "us") operates epictetusproject.com, a
                        platform that helps students find, prepare for, and track academic and
                        extracurricular competitions, and gives school counselors visibility into the
                        students they support. You can reach us at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>

                    <h2>Information we collect</h2>
                    <p><strong>Account information.</strong> When you sign up, we collect your name and email
                        address, and a password (handled by our authentication provider, Supabase — we never
                        see or store your raw password). If you sign in with Google, we receive your name,
                        email, and profile info from Google. We also store your school and grade level, and
                        whether you've opted in to our newsletter.</p>
                    <p><strong>Profile preferences.</strong> Interests and goals you select in the app, used to
                        recommend relevant competitions.</p>
                    <p><strong>Activity data.</strong> Competitions you save, guide articles and videos you
                        view, roadmap tasks you complete, competition results you choose to self-report, and
                        registration-link clicks.</p>
                    <p><strong>Counselor-linked data.</strong> If you link your account to a school counselor,
                        that counselor can see your saved competitions, guide progress, preferences, and
                        self-reported results. If a linked account is later removed, the counselor's copy of
                        your school, grade, interests, saved competitions, and any notes they added may be
                        kept in their own records for their advising purposes.</p>
                    <p><strong>Analytics.</strong> We log basic usage events (pages viewed, features used,
                        general referral source) to understand how the product is used. We also use Google
                        Analytics, which sets its own cookies and collects device/usage data under Google's
                        privacy practices.</p>
                    <p><strong>Newsletter.</strong> If you subscribe, we store your email address for that
                        purpose.</p>

                    <h2>How we use this information</h2>
                    <ul>
                        <li>To operate your account and personalize competition recommendations</li>
                        <li>To let a linked school counselor support your competition search and applications</li>
                        <li>To send you the newsletter, if you've opted in</li>
                        <li>To understand product usage and improve the site</li>
                        <li>To keep the service secure and prevent misuse</li>
                    </ul>

                    <h2>Who we share it with</h2>
                    <p>
                        We don't sell your personal information. We share it only with: a school counselor
                        you've linked your account to; service providers that run the platform, namely
                        Supabase (database, authentication, hosting) and Google (sign-in and analytics); and
                        anyone we're required to share it with by law.
                    </p>

                    <h2>How long we keep it</h2>
                    <p>
                        We keep your account data while your account is active. You can delete your account
                        at any time from your profile, which removes your account and associated personal
                        data, other than a counselor's own archived notes as described above.
                    </p>

                    <h2>Your choices</h2>
                    <ul>
                        <li>Update your profile information at any time from your account settings</li>
                        <li>Delete your account from your profile menu</li>
                        <li>Unsubscribe from the newsletter using the link in any newsletter email, or from your account</li>
                        <li>Unlink your account from a counselor at any time</li>
                        <li>Ask us to remove a counselor's archived record of you by emailing us</li>
                        <li>Control analytics/advertising cookies through your browser settings</li>
                    </ul>

                    <h2>Students under 13</h2>
                    <p>
                        Project Epictetus is intended for high-school-aged students. If you are under 13, you
                        should only use this service with a parent, guardian, or school's involvement. If you
                        believe a child under 13 has created an account without appropriate consent, contact
                        us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will remove it.
                    </p>

                    <h2>Security</h2>
                    <p>
                        We use industry-standard measures — including encrypted connections and database
                        access rules that restrict each user to their own data — to protect your information.
                        No online service can guarantee perfect security.
                    </p>

                    <h2>Changes to this policy</h2>
                    <p>
                        If we make material changes to this policy, we'll update the date at the top of this
                        page and, where appropriate, notify you directly.
                    </p>

                    <h2>Contact us</h2>
                    <p>
                        Questions about this policy or your data? Email{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>

                    <Link to="/terms" className="legal-cross-link">Read our Terms of Service &rarr;</Link>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
