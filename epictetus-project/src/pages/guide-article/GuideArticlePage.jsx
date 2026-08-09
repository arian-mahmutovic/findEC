import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BackToTop from "../../components/BackToTop";
import { getArticleBySlug, getGeneralArticles, getRelatedArticles } from "../../services/competitions";
import "./GuideArticlePage.css";

export default function GuideArticlePage() {
    const { slug } = useParams();

    const [article, setArticle] = useState(null);
    const [related, setRelated] = useState([]);
    const [relatedLabel, setRelatedLabel] = useState("More guides");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        loadArticle();
    }, [slug]);

    async function loadArticle() {
        setLoading(true);
        setNotFound(false);

        const result = await getArticleBySlug(slug);

        if (result.error || !result.data) {
            setLoading(false);
            setNotFound(true);
            return;
        }

        setArticle(result.data);

        if (result.data.competitions?.id) {
            const relatedResult = await getRelatedArticles(result.data.competitions.id, result.data.id, 3);
            const relatedArticles = relatedResult.data || [];

            if (relatedArticles.length > 0) {
                setRelated(relatedArticles);
                setRelatedLabel(`More on ${result.data.competitions.name}`);
            } else {
                const generalResult = await getGeneralArticles(result.data.id, 3);
                setRelated(generalResult.data || []);
                setRelatedLabel("General guides");
            }
        } else {
            const generalResult = await getGeneralArticles(result.data.id, 3);
            setRelated(generalResult.data || []);
            setRelatedLabel("General guides");
        }

        setLoading(false);
    }

    if (loading) {
        return (
            <>
            <SiteHeader />
            <div className="article-loading-page">
                <span className="article-loading-dot" />
            </div>
            </>
        );
    }

    if (notFound || !article) {
        return (
            <>
            <SiteHeader />
            <div className="article-error-page">
                <span className="guide-article-eyebrow">Guide unavailable</span>
                <h1>Article not found.</h1>
                <p>The guide you requested may have moved or is no longer available.</p>
                <Link to="/competitions" className="article-back-link">Back to competitions</Link>
            </div>
            </>
        );
    }

    return (
        <>
        <SiteHeader />
        <main className="guide-article-page">

            <div className="guide-article-shell">

                <div className="guide-article-breadcrumb">
                    {article.competitions ? (
                        <Link to={`/competitions/${article.competitions.slug}`}>
                            &larr; {article.competitions.name}
                        </Link>
                    ) : (
                        <Link to="/competitions">&larr; All competitions</Link>
                    )}
                </div>

                <span className="guide-article-eyebrow">
                    {article.competitions ? "Competition guide" : "General guide"}
                </span>

                <h1 className="guide-article-title">{article.title}</h1>

                {article.summary && (
                    <p className="guide-article-summary">{article.summary}</p>
                )}

                <article className="guide-article-body">
                    <p>{article.content}</p>
                </article>

                {related.length > 0 && (
                    <section className="guide-article-next">
                        <span className="guide-article-eyebrow">{relatedLabel}</span>
                        <h2>Keep reading</h2>

                        <div className="guide-article-next-grid">
                            {related.map((next) => (
                                <Link
                                    to={`/articles/${next.slug}`}
                                    className="guide-article-next-card"
                                    key={next.id}
                                >
                                    <h3>{next.title}</h3>
                                    <p>{next.summary}</p>
                                    <span className="guide-article-next-cta">
                                        Read guide <span aria-hidden="true">&#8599;</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </div>

        </main>
        <SiteFooter />
        <BackToTop />
        </>
    );
}
