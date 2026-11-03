import PropTypes from "prop-types";

function SearchResultCard({ item, inLibrary, onAdd }) {
  // Cards stay stateless; parent components own add/search state.
  return (
    <article className="search-card">
      <img
        src={item.thumbnail || "https://placehold.co/180x260?text=No+Cover"}
        alt={`Cover of ${item.title}`}
      />
      <div>
        <h3>{item.title}</h3>
        <p>{item.author}</p>
        <p>{item.description.slice(0, 150)}...</p>
        <button type="button" onClick={() => onAdd(item)} disabled={inLibrary}>
          {inLibrary ? "Already in library" : "Add to library"}
        </button>
      </div>
    </article>
  );
}

SearchResultCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
  }).isRequired,
  inLibrary: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default SearchResultCard;
