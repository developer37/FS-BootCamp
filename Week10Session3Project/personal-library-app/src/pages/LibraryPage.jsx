import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import LibraryItem from "../components/LibraryItem";

function LibraryPage({
  library,
  onToggleFavorite,
  onDeleteItem,
  onUpdateItem,
  storageError,
}) {
  // Local UI controls for filtering and sorting the persisted library.
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("date-newest");

  const genres = useMemo(() => {
    // Build a dynamic genre dropdown from current items.
    const genreSet = new Set(library.map((item) => item.details.genre));
    return ["all", ...genreSet];
  }, [library]);

  const filteredLibrary = useMemo(() => {
    // Apply all active filters before sorting the display list.
    const filtered = library.filter((item) => {
      const statusMatch =
        statusFilter === "all" || item.readingStatus === statusFilter;
      const genreMatch =
        genreFilter === "all" || item.details.genre === genreFilter;
      const favoriteMatch = !favoriteOnly || item.isFavorite;
      const ratingMatch = item.rating >= minRating;

      return statusMatch && genreMatch && favoriteMatch && ratingMatch;
    });

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "date-oldest") {
        return (
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      }

      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

    return sorted;
  }, [library, statusFilter, genreFilter, favoriteOnly, minRating, sortBy]);

  return (
    <section className="panel">
      <h2>My Library</h2>
      <p>Saved books: {library.length}</p>
      {storageError && <p className="error">{storageError}</p>}

      <div className="filters">
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">all</option>
            <option value="not-started">not-started</option>
            <option value="want-to-read">want-to-read</option>
            <option value="reading">reading</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label>
          Genre
          <select
            value={genreFilter}
            onChange={(event) => setGenreFilter(event.target.value)}
          >
            {genres.map((genre) => (
              <option value={genre} key={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Min rating
          <select
            value={minRating}
            onChange={(event) => setMinRating(Number(event.target.value))}
          >
            <option value="0">0+</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
        </label>

        <label>
          Sort
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="date-newest">date (newest)</option>
            <option value="date-oldest">date (oldest)</option>
            <option value="title">title</option>
            <option value="author">author</option>
            <option value="rating">rating</option>
          </select>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={favoriteOnly}
            onChange={(event) => setFavoriteOnly(event.target.checked)}
          />
          Favorites only
        </label>
      </div>

      {filteredLibrary.length === 0 ? (
        <p className="empty-state">
          No library items match your current filters.
        </p>
      ) : (
        <div className="library-grid">
          {filteredLibrary.map((item) => (
            <LibraryItem
              item={item}
              key={item.id}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDeleteItem}
              onUpdate={onUpdateItem}
            />
          ))}
        </div>
      )}
    </section>
  );
}

LibraryPage.propTypes = {
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  storageError: PropTypes.string.isRequired,
};

export default LibraryPage;
