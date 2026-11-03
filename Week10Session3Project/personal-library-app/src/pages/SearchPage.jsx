import { useState } from "react";
import PropTypes from "prop-types";
import SearchResultCard from "../components/SearchResultCard";
import useBookSearch from "../hooks/useBookSearch";

function SearchPage({ library, onAddItem }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const { results, loading, error, noResults, searchBooks } = useBookSearch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Clear transient notices for each new search attempt.
    setNotice("");
    await searchBooks(query);
  };

  const handleAddItem = (item) => {
    // addItem returns false when the item already exists.
    const added = onAddItem(item);
    setNotice(
      added
        ? `Added "${item.title}" to your library.`
        : "That item is already in your library.",
    );
  };

  return (
    <section className="panel">
      <h2>Search Books</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="book-search">Search term</label>
        <input
          id="book-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: JavaScript design patterns"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {notice && <p className="notice">{notice}</p>}
      {noResults && (
        <p className="empty-state">No results found for that search.</p>
      )}

      <div className="search-grid">
        {results.map((item) => (
          <SearchResultCard
            item={item}
            key={item.id}
            inLibrary={library.some(
              (libraryItem) => libraryItem.id === item.id,
            )}
            onAdd={handleAddItem}
          />
        ))}
      </div>
    </section>
  );
}

SearchPage.propTypes = {
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddItem: PropTypes.func.isRequired,
};

export default SearchPage;
