import CompetitionCard from "./CompetitionCard";
import './CompetitionListPage.css';
import { useEffect, useState } from "react";
import { getCompetitions } from "../../services/competitions";

export default function CompetitionListPage() {
    const [competitions, setCompetitions] = useState([]);


    useEffect(() => {

        async function loadCompetitionsData() {

            const result = await getCompetitions();

            setCompetitions(result.data);

        }

        loadCompetitionsData();

    }, []);


    return (

        <main className="competition-page">


            <section className="competition-header">

                <h1>
                    Explore Competitions
                </h1>

                <p>
                    Find academic competitions, scholarships,
                    and opportunities built for ambitious students.
                </p>

            </section>


            <section className="competition-grid">

                {competitions.map((competition) => (

                    <CompetitionCard
                        key={competition.name}
                        {...competition}
                    />

                ))}

            </section>


        </main>

    );
}