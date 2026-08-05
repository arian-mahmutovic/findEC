import { useEffect, useState } from "react";
import { getCompetitions } from "../services/competitions";


function CompetitionList() {

    const [competitions, setCompetitions] = useState([]);


    useEffect(() => {

        async function load() {

            const result = await getCompetitions();

            setCompetitions(result.data);

        }

        load();

    }, []);



    return (
        <>
            {
                competitions.map((competition) => (

                    <div key={competition.id}>

                        <h3>
                            {competition.name}
                        </h3>

                        <p>
                            {competition.organization}
                        </p>

                        <p>
                            {competition.category}
                        </p>

                    </div>

                ))
            }


        </>

    )

}


export default CompetitionList;