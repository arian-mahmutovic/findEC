export default function SearchBar({ openSignPopup }) {
    return (
        <div className="search-container">
          <input
            placeholder="Search 'investment', 'engineering', 'business'..."
          />

          <button onClick={openSignPopup}>
            Search
          </button>
        </div>
    );
};