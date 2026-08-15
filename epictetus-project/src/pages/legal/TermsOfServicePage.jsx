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

                <div className="legal-body">
                    <h2>1. Agreement to these terms</h2>
                    <p>
                        These Terms of Service ("Terms") are a binding agreement between you and Project
                        Epictetus ("Epictetus," "we," "us," or "our") governing your access to and use of
                        epictetusproject.com and related services (the "Service"). By creating an account or
                        otherwise using the Service, you agree to these Terms. If you don't agree, don't use
                        the Service.
                    </p>

                    <h2>2. Eligibility and accounts</h2>
                    <p>
                        You need an account to use most of the Service. You're responsible for the accuracy
                        of the information you provide and for keeping your login credentials secure, and
                        for all activity that occurs under your account. If you are a minor in your
                        jurisdiction, you represent that a parent, guardian, or school has authorized and
                        supervises your use of the Service, and that they accept these Terms on your behalf
                        to the extent required by law.
                    </p>

                    <h2>3. Description of the Service</h2>
                    <p>
                        Project Epictetus helps students discover, prepare for, and track academic and
                        extracurricular competitions, and gives school counselors visibility into the
                        students they support. Competition information is gathered for convenience only.
                        Always confirm deadlines, eligibility, and requirements directly with the organizing
                        competition or organization before applying or relying on anything in the Service.
                        Epictetus is not affiliated with, and does not endorse, any competition or
                        organization listed unless explicitly stated.
                    </p>

                    <h2>4. Counselor accounts and linking</h2>
                    <p>
                        School counselors may register for a separate counselor account. Students may choose
                        to link their account to a counselor, which lets that counselor view the student's
                        saved competitions, guide progress, preferences, and self-reported results. Students
                        may unlink at any time. Counselors agree to use student information only for
                        legitimate advising purposes and to comply with all applicable laws governing student
                        data.
                    </p>

                    <h2>5. Self-reported results</h2>
                    <p>
                        Competition outcomes you submit (e.g. participated, finalist, winner) are
                        self-reported by you and may be reviewed by a linked counselor. We do not
                        independently verify these results and make no representations or warranties as to
                        their accuracy. Neither Epictetus nor any linked counselor is responsible for
                        decisions made in reliance on self-reported results.
                    </p>

                    <h2>6. Acceptable use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Misrepresent your identity, age, or affiliation, or impersonate any person or entity</li>
                        <li>Provide false information about competition results or your account</li>
                        <li>Scrape, bulk-extract, reverse-engineer, or resell any part of the Service or its data</li>
                        <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Service or its infrastructure</li>
                        <li>Use the Service for any unlawful, fraudulent, or harmful purpose</li>
                    </ul>

                    <h2>7. Intellectual property</h2>
                    <p>
                        The Service, including its design, text, graphics, and underlying software (excluding
                        information you submit), is owned by Epictetus or its licensors and protected by
                        applicable intellectual property laws. We grant you a limited, revocable,
                        non-exclusive, non-transferable license to access and use the Service for your
                        personal, non-commercial use, subject to these Terms.
                    </p>

                    <h2>8. Third-party content and links</h2>
                    <p>
                        The Service may link to or embed third-party websites, videos, and registration
                        pages that we don't control. We're not responsible for the content, accuracy, or
                        practices of any third-party site, and linking to it doesn't imply our endorsement.
                    </p>

                    <h2>9. Changes to or discontinuation of the Service</h2>
                    <p>
                        We may modify, suspend, or discontinue any part of the Service at any time, with or
                        without notice, and without liability to you for doing so.
                    </p>

                    <h2>10. Termination</h2>
                    <p>
                        You may stop using the Service and delete your account at any time. We may suspend or
                        terminate your access to the Service at any time, with or without notice or cause,
                        including for violation of these Terms. Sections of these Terms that by their nature
                        should survive termination (including Sections 5, 7, 11, 12, 13, and 14) will
                        survive.
                    </p>

                    <h2>11. Disclaimer of warranties</h2>
                    <p>
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND,
                        WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION WARRANTIES OF
                        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO
                        NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ANY
                        COMPETITION OR GUIDE INFORMATION IS ACCURATE, COMPLETE, OR CURRENT.
                    </p>

                    <h2>12. Limitation of liability</h2>
                    <p>
                        TO THE FULLEST EXTENT PERMITTED BY LAW, EPICTETUS AND ITS OFFICERS, AFFILIATES, AND
                        SERVICE PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                        CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, OPPORTUNITY, OR GOODWILL,
                        ARISING FROM YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
                        DAMAGES. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE
                        SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS
                        BEFORE THE CLAIM AROSE, OR (B) $100. SOME JURISDICTIONS DON'T ALLOW THESE
                        LIMITATIONS, SO SOME OF THEM MAY NOT APPLY TO YOU.
                    </p>

                    <h2>13. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold Epictetus harmless from any claims, damages, losses,
                        and expenses (including reasonable attorneys' fees) arising from your use of the
                        Service, your violation of these Terms, or your violation of any rights of a third
                        party.
                    </p>

                    <h2>14. Governing law and venue</h2>
                    <p>
                        These Terms are governed by the laws of the State of Florida, without regard to its
                        conflict-of-laws principles. Any dispute arising from these Terms or the Service will
                        be brought exclusively in the state or federal courts located in Florida, and you
                        consent to personal jurisdiction there.
                    </p>

                    <h2>15. Dispute resolution</h2>
                    <p>
                        Before filing a claim, you agree to first contact us at{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and give us a reasonable
                        opportunity to resolve the dispute informally.
                    </p>

                    <h2>16. General provisions</h2>
                    <p>
                        These Terms, together with our <Link to="/privacy">Privacy Policy</Link>, are the
                        entire agreement between you and Epictetus regarding the Service and supersede any
                        prior agreements. If any provision of these Terms is found unenforceable, the
                        remaining provisions will remain in full effect. Our failure to enforce any provision
                        isn't a waiver of it. You may not assign these Terms; we may assign them in
                        connection with a merger, acquisition, or sale of assets.
                    </p>

                    <h2>17. Changes to these terms</h2>
                    <p>
                        We may update these Terms from time to time. Changes are effective as soon as we
                        post them and update the date at the top of this page. Your continued use of the
                        Service after a change constitutes acceptance of the updated Terms.
                    </p>

                    <h2>18. Contact</h2>
                    <p>
                        Questions about these Terms? Email{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    </p>

                    <Link to="/privacy" className="legal-cross-link">Read our Privacy Policy &rarr;</Link>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
