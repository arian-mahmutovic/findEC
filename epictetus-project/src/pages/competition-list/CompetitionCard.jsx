import { Link } from "react-router";
import { formatDate } from "../../utils/dates";
import SaveStarButton from "../../components/SaveStarButton";


export default function CompetitionCard({
    id,
    slug,
    name,
    organization,
    description,
    category,
    website_url,
    eligibility,
    registration_start_date,
    registration_end_date,
    registration_status,
    active_start_date,
    active_end_date,
    team_requirement,
    location_type,
    prize,
    prestige_level,
    onGuideClick
}) {

    const statusClass =
        registration_status === "Open" ? "open" :
        registration_status === "Closed" ? "closed" : "";

    return (

        <article className="competition-card">

            {(category || prestige_level || registration_status) && (
                <div className="competition-badges">
                    {category && <span className="badge category-badge">{category}</span>}
                    {prestige_level && <span className="badge prestige-badge" title={prestige_level}>{prestige_level}</span>}
                    {registration_status && (
                        <span className={`badge registration-status-badge ${statusClass}`}>
                            {registration_status}
                        </span>
                    )}
                </div>
            )}

            <div className="competition-card-header">
                <div>
                    <h2>{name}</h2>
                    {organization && <p className="competition-organization">{organization}</p>}
                </div>

                {description && <p className="competition-description">{description}</p>}
            </div>

            <div className="competition-info">
                <div className="competition-dates">
                    <div className="competition-registration-dates">
                        <strong>Registration</strong>
                        <p>{formatDate(registration_start_date)} &ndash; {formatDate(registration_end_date)}</p>
                    </div>

                    <div className="competition-period-dates">
                        <strong>Competition period</strong>
                        <p>{formatDate(active_start_date)} &ndash; {formatDate(active_end_date)}</p>
                    </div>
                </div>

                {(eligibility || team_requirement) && (
                    <div className="competition-details">
                        {eligibility && (
                            <div className="competition-eligibility">
                                <strong>Eligibility</strong>
                                <p>{eligibility}</p>
                            </div>
                        )}

                        {team_requirement && (
                            <div className="competition-team-requirement">
                                <strong>Team</strong>
                                <p>{team_requirement}</p>
                            </div>
                        )}
                    </div>
                )}

                {(prize || location_type) && (
                    <div className="competition-details">
                        {prize && (
                            <div className="competition-prize">
                                <strong>Prize</strong>
                                <p title={prize}>{prize}</p>
                            </div>
                        )}

                        {location_type && (
                            <div className="competition-location">
                                <strong>Format</strong>
                                <p>{location_type}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="competition-buttons-container">

                <Link
                    to={`/competitions/${slug}`}
                    onClick={(e) => {
                        if (onGuideClick) {
                            e.preventDefault();
                            onGuideClick();
                        }
                    }}
                >
                    <button type="button" className="competition-card-button">
                        View guide
                    </button>
                </Link>

                {website_url && (
                    <a href={website_url} target="_blank" rel="noopener noreferrer">
                        <button type="button">Official website</button>
                    </a>
                )}

                <SaveStarButton competitionId={id} />

            </div>

        </article>

    );

}
