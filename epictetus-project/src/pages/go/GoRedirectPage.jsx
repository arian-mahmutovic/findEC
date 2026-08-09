import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { resolveTrackableLink } from "../../services/trackableLinks";
import { trackEvent, setStoredAcquisitionSource } from "../../services/analytics";
import "./GoRedirectPage.css";

export default function GoRedirectPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;

        resolveTrackableLink(slug).then((result) => {
            if (cancelled) return;

            const link = result.data;

            if (!link) {
                setNotFound(true);
                setTimeout(() => navigate("/", { replace: true }), 1500);
                return;
            }

            setStoredAcquisitionSource(link.slug);
            trackEvent("link_visited", { metadata: { slug: link.slug, label: link.label } });

            const params = new URLSearchParams();
            if (link.utm_source) params.set("utm_source", link.utm_source);
            if (link.utm_medium) params.set("utm_medium", link.utm_medium);
            if (link.utm_campaign) params.set("utm_campaign", link.utm_campaign);

            const query = params.toString();
            const separator = link.destination_path.includes("?") ? "&" : "?";
            const destination = query ? `${link.destination_path}${separator}${query}` : link.destination_path;

            navigate(destination, { replace: true });
        });

        return () => { cancelled = true; };
    }, [slug, navigate]);

    return (
        <div className="go-redirect-page">
            <span className="go-redirect-dot" />
            <p>{notFound ? "That link isn't valid — taking you home instead." : "Redirecting…"}</p>
        </div>
    );
}
