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

                <div className="legal-body">
                    <h2>Who we are</h2>
                    <p>
                        Project Epictetus ("Epictetus," "we," "us," or "our") operates
                        epictetusproject.com (the "Service"), a platform that helps students discover,
                        prepare for, and track academic and extracurricular competitions, and gives
                        school counselors visibility into the students they support. By accessing or
                        using the Service, you agree to the collection and use of information described
                        in this policy. If you do not agree, please do not use the Service. You can reach
                        us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
                    <p><strong>Analytics and cookies.</strong> We log basic usage events (pages viewed,
                        features used, general referral source) to understand how the product is used. We
                        also use Google Analytics, which sets its own cookies and collects device and usage
                        data under Google's privacy practices. We do not currently respond to browser
                        "Do Not Track" signals. You can limit cookie-based tracking through your browser
                        settings at any time.</p>
                    <p><strong>Newsletter.</strong> If you subscribe, we store your email address for that
                        purpose.</p>
                    <p><strong>Technical data.</strong> Like most online services, our infrastructure
                        providers automatically log standard technical information (such as IP address,
                        browser type, and timestamps) for security, fraud prevention, and service
                        reliability.</p>

                    <h2>How we use this information</h2>
                    <ul>
                        <li>To operate your account and personalize competition recommendations</li>
                        <li>To let a linked school counselor support your competition search and applications</li>
                        <li>To send you the newsletter, if you've opted in</li>
                        <li>To understand product usage and improve the Service</li>
                        <li>To detect, investigate, and prevent fraud, abuse, and security incidents</li>
                        <li>To enforce our <Link to="/terms">Terms of Service</Link> and comply with legal obligations</li>
                    </ul>

                    <h2>How we share it</h2>
                    <p>We don't sell your personal information. We may share it with:</p>
                    <ul>
                        <li>A school counselor you've linked your account to</li>
                        <li>Service providers who help us run the platform, currently Supabase (database,
                            authentication, hosting) and Google (sign-in and analytics), bound to use your
                            information only to provide their services to us</li>
                        <li>Law enforcement, regulators, or other parties when required by law, or when we
                            believe in good faith it's necessary to protect the rights, safety, or property
                            of Epictetus, our users, or the public</li>
                        <li>A successor entity in connection with a merger, acquisition, financing, or sale
                            of assets, subject to this policy or a materially similar one</li>
                    </ul>
                    <p>We may also share aggregated or de-identified information that cannot reasonably be
                        used to identify you, without restriction.</p>

                    <h2>Where your data is stored</h2>
                    <p>
                        Our infrastructure providers operate in the United States, and your information is
                        stored and processed there. By using the Service, you consent to this transfer and
                        processing.
                    </p>

                    <h2>How long we keep it</h2>
                    <p>
                        We keep your account data while your account is active. You can delete your account
                        at any time from your profile, which removes your account and associated personal
                        data, other than a counselor's own archived notes as described above, or copies we
                        are required to retain for legal, security, or fraud-prevention purposes.
                    </p>

                    <h2>Your choices</h2>
                    <ul>
                        <li>Update your profile information at any time from your account settings</li>
                        <li>Delete your account from your profile menu</li>
                        <li>Unsubscribe from the newsletter using the link in any newsletter email, or from your account</li>
                        <li>Unlink your account from a counselor at any time</li>
                        <li>Ask us to remove a counselor's archived record of you by emailing us</li>
                        <li>Control analytics and advertising cookies through your browser settings</li>
                    </ul>

                    <h2>Children's privacy</h2>
                    <p>
                        The Service is intended for use by high-school-aged students, generally 13 and
                        older, with the involvement of a parent, guardian, or school. By creating an
                        account, you represent that you are 13 or older, or that your use of the Service has
                        been authorized and is supervised by a parent, guardian, or school acting on your
                        behalf. We do not knowingly collect personal information from children under 13
                        without such involvement. If we learn that we've collected personal information from
                        a child under 13 without appropriate consent, we will take steps to delete it
                        promptly. A parent or guardian who believes their child has provided us information
                        without proper consent may contact us at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to request its removal.
                    </p>

                    <h2>Third-party links</h2>
                    <p>
                        The Service links to third-party competition websites, registration pages, and
                        videos (including YouTube). We aren't responsible for the privacy practices of those
                        third parties, and we encourage you to review their policies before providing
                        information to them.
                    </p>

                    <h2>Security</h2>
                    <p>
                        We use industry-standard measures — including encrypted connections and database
                        access rules that restrict each user to their own data — to protect your information.
                        No method of transmission or storage is 100% secure, and we cannot guarantee absolute
                        security. You provide information at your own risk.
                    </p>

                    <h2>Changes to this policy</h2>
                    <p>
                        We may update this policy from time to time. Changes are effective as soon as we
                        post the updated policy and update the date at the top of this page. Your continued
                        use of the Service after a change constitutes acceptance of the updated policy.
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
