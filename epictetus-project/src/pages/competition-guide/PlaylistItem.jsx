export default function PlaylistItem({ video }) {
    return (
        <div
            className="playlist-item"
            key={video}
        >

            ▶ {video}

        </div>
    );
};