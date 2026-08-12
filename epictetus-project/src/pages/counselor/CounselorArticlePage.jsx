import "./CounselorArticlePage.css";
import { Link, useParams } from "react-router";
import { COUNSELOR_ARTICLES } from "./counselorArticles";
import ParticleBackground from "../../components/ParticleBackground";
import CounselorFooter from "../../components/CounselorFooter";
import ThemeToggle from "../../components/ThemeToggle";

export default function CounselorArticlePage() {
    const { slug } = useParams();
    const article = COUNSELOR_ARTICLES.find((a) => a.slug === slug);

    const otherArticles = COUNSELOR_ARTICLES.filter((a) => a.slug !== slug);

    if (!article) {
        return (
            <main className="counselor-page counselor-article-page">
                <ParticleBackground />

                <div className="counselor-article-content">
                    <Link to="/counselor/dashboard" className="counselor-article-back">&larr; Back to dashboard</Link>
                    <h1>Article not found</h1>
                    <p>That article doesn&rsquo;t exist. Head back to your dashboard to find the right one.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="counselor-page counselor-article-page">

            <ParticleBackground />

            <nav className="counselor-nav">
                <div className="counselor-nav-brand">
                    <Link to="/counselor/dashboard">Epictetus Project</Link>
                    <span>Counselor Portal</span>
                </div>

                <div className="counselor-nav-user">
                    <ThemeToggle className="counselor-theme-toggle" />
                </div>
            </nav>

            <div className="counselor-article-content">

                <Link to="/counselor/dashboard" className="counselor-article-back">&larr; Back to dashboard</Link>

                <span className="counselor-article-eyebrow">Counselor Guide</span>
                <h1>{article.title}</h1>

                <div className="counselor-article-body">
                    {article.body.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                <div className="counselor-article-other">
                    <h2>More guides</h2>
                    <ul>
                        {otherArticles.map((other) => (
                            <li key={other.slug}>
                                <Link to={`/counselor/articles/${other.slug}`}>{other.title}</Link>
                                <p>{other.teaser}</p>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <CounselorFooter />

        </main>
    );
}
