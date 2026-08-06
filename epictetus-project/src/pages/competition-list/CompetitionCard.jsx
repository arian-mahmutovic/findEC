import { Link } from "react-router";
import { formatDate } from "../../utils/dates";


export default function CompetitionCard({
    id,
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
    cost,
    prize,
    prestige_level
}) {

    return (

        <div className="competition-card">


            {/* Top badges */}
            <div className="competition-badges">

                <span className="badge category-badge">
                    {category}
                </span>


                <span className="badge prestige-badge">
                    {prestige_level}
                </span>

                <span className={`badge registration-status-badge ${
                    registration_status === "Open" ? "open" : registration_status === "Closed" && "closed"
                }`}>
                    {registration_status}
                </span>

            </div>



            {/* Main information */}
            <div className="competition-card-header">
                <div>
                    <h2>
                        {name}
                    </h2>
                    
                    <p className="competition-organization">
                        {organization}
                    </p>
                </div>


                <p className="competition-description">
                    {description}
                </p>
            </div>



            {/* Competition information */}

            <div className="competition-info">

                <div className="competition-dates">
                    <div className="competition-registration-dates">
                        <strong>
                            Registration:
                        </strong>

                        <p>
                            {formatDate(registration_start_date)}
                            {" - "}
                            {formatDate(registration_end_date)}
                        </p>
                    </div>

                    <div className="competition-period-dates">
                        <strong>
                            Competition Period:
                        </strong>

                        <p>
                            {formatDate(active_start_date)}
                            {" - "}
                            {formatDate(active_end_date)}
                        </p>
                    </div>
                </div>


                <div className="competition-details">
                    <div className="competition-eligibility">
                        <strong>
                            Eligibility:
                        </strong>

                        <p>
                            {eligibility}
                        </p>
                    </div>

                    <div className="competition-team-requirement">
                        <strong>
                            Team Requirement:
                        </strong>

                        <p>
                            {team_requirement}
                        </p>
                    </div>
                </div>
            </div>



            {/* Actions */}

            <div className="competition-buttons-container">


                <Link to={`/competition/${id}`}>

                    <button className="competition-card-button">
                        View Competition
                    </button>

                </Link>



                <a
                    href={website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    <button>
                        Official Website
                    </button>

                </a>


            </div>


        </div>

    );

}