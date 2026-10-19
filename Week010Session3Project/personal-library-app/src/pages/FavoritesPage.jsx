import PropTypes from "prop-types";
import LibraryItem from "../components/LibraryItem";

function FavoritesPage({
  library,
  onToggleFavorite,
  onDeleteItem,
  onUpdateItem,
}) {
  // Derived subset keeps this page read-only and predictable.
  const favorites = library.filter((item) => item.isFavorite);

  return (
    <section className="panel">
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p className="empty-state">
          No favorites yet. Mark an item with the star button.
        </p>
      ) : (
        <div className="library-grid">
          {favorites.map((item) => (
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

FavoritesPage.propTypes = {
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
};

export default FavoritesPage;
