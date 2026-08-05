import FeaturedVideo from './FeaturedVideo'
import PlaylistItem from './PlaylistItem'
export default function VideoSection({ videos }) {
    return (
        <section className="video-section">

            <FeaturedVideo />

            <aside className="video-playlist">

                <h3>
                    Course Playlist
                </h3>

                {videos.map(video => (

                   <PlaylistItem video={video} />

                ))}

            </aside>

        </section>
    );
};