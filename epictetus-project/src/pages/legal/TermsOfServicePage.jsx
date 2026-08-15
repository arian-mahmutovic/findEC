import { Link } from "react-router";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./LegalPage.css";

const LAST_UPDATED = "August 15, 2026";
const CONTACT_EMAIL = "hello@epictetusproject.com";

export default function TermsOfServicePage() {
    return (
        <div className="legal-page">
            <SiteHeader />

            <main className="legal-shell">
                <span className="legal-eyebrow">Legal</span>
                <h1 className="legal-title">Terms of Service</h1>
                <p className="legal-updated">Last updated: {LAST_UPDATED}</p>

                <p className="legal-notice">
                    This is a plain-language template written for the Project Epictetus MVP. It is not a
                    substitute for legal advice — have an attorney review it, and fill in a specific
                    governing-law jurisdiction, before relying on it for a public launch.
                </p>

                <div className="legal-body">
                    <h2>1. Agreement to these terms</h2>
                    <p>
                        By creating an account or otherwise using epictetusproject.com (the "Service"), you
                        agree to these Terms of Service. If you don't agree, please don't use the Service.
                    </p>

                    <h2>2. What the Service is</h2>
                    <p>
                        Project Epictetus helps students discover, prepare for, and track academic and
                        extracurricular competitions, and gives school counselors visibility into the
                        students they support. Information about competitions is gathered for convenience —
                        always confirm deadlines, eligibility, and requirements directly with the organizing
                        competition or organization before applying. Project Epictetus is not affiliated with
                        the competitions listed unless explicitly stated.
                    </p>

                    <h2>3. Accounts</h2>
                    <p>
                        You need an account to use most of the Service. You're responsible for the accuracy
                        of the information you provide and for keeping your login credentials secure. If you
                        are under the age of majority in your jurisdiction, you confirm that you have the
                        permission of a parent, guardian, or school to use the Service.
                    </p>

                    <h2>4. Counselor accounts and linking</h2>
                    <p>
                        School counselors may register for a separate counselor account. Students may choose
                        to link their account to a counselor, which lets that counselor view the student's
                        saved competitions, guide progress, preferences, and self-reported results. Students
                        can unlink at any time. Counselors are responsible for using student information only
                        for legitimate advising purposes.
                    </p>

                    <h2>5. Self-reported results</h2>
                    <p>
                        Competition outcomes you submit (e.g. participated, finalist, winner) are
                        self-reported by you and may be reviewed or verified by a linked counselor. We don't
                        independently verify these results and make no guarantee as to their accuracy.
                    </p>

                    <h2>6. Acceptable use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Misrepresent your identity or impersonate someone else</li>
                        <li>Scrape, bulk-extract, or resell data from the Service</li>
                        <li>Interfere with or attempt to disrupt the Service or its infrastructure</li>
                        <li>Use the Service for any unlawful purpose</li>
                    </ul>

                    <h2>7. Termination</h2>
                    <p>
                        You may stop using the Service and delete your account at any time. We may suspend or
                        terminate accounts that violate these terms or that we reasonably believe pose a risk
                        to the Service or other users.
                    </p>

                    <h2>8. Disclaimers</h2>
                    <p>
                        The Service is provided "as is" and "as available," without warranties of any kind.
                        We do our best to keep competition and guide information accurate and current, but we
                        don't guarantee it, and we're not responsible for decisions made based on it.
                    </p>

                    <h2>9. Limitation of liability</h2>
                    <p>
                        To the fullest extent permitted by law, Project Epictetus is not liable for any
                        indirect, incidental, or consequential damages arising from your use of the Service.
                    </p>

                    <h2>10. Changes to these terms</h2>
                    <p>
                        We may update these terms from time to time. If we make material changes, we'll
                        update the date at the top of this page.
                    </p>

                    <h2>11. Governing law</h2>
                    <p>
                        [Add your governing-law jurisdiction here, e.g. "the State of ___," before launch.]
                    </p>

                    <h2>12. Contact</h2>
                    <p>
                        Questions about these terms? Email{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>

                    <Link to="/privacy" className="legal-cross-link">Read our Privacy Policy &rarr;</Link>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
