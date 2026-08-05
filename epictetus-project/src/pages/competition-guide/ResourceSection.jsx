import ResourceCard from './ResourceCard'

export default function ResourceSection({ resources }) {
    return (
        <section className="resource-section">

            <h2>
                Recommended Resources
            </h2>

            <div className="resource-grid">

                {resources.map(resource => (

                   <ResourceCard resource={resource} key={resource.title} />

                ))}

            </div>

        </section>
    )
}