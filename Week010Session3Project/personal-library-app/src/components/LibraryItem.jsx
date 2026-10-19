import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function LibraryItem({ item, onToggleFavorite, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  // Local draft state keeps edits isolated until the user saves.
  const [draft, setDraft] = useState({
    title: item.title,
    author: item.author,
    readingStatus: item.readingStatus,
    genre: item.details.genre,
    rating: item.rating,
    notes: item.details.notes,
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setDraft((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    // Clamp rating into supported bounds before persisting.
    const safeRating = Math.max(0, Math.min(5, Number(draft.rating) || 0));

    onUpdate(item.id, {
      title: draft.title.trim() || item.title,
      author: draft.author.trim() || item.author,
      readingStatus: draft.readingStatus,
      rating: safeRating,
      details: {
        genre: draft.genre.trim() || "Uncategorized",
        notes: draft.notes,
      },
    });

    setEditing(false);
  };

  const handleCancel = () => {
    // Rebuild draft from source item to discard unsaved edits.
    setDraft({
      title: item.title,
      author: item.author,
      readingStatus: item.readingStatus,
      genre: item.details.genre,
      rating: item.rating,
      notes: item.details.notes,
    });
    setEditing(false);
  };

  return (
    <article className="library-item">
      <img
        className="cover"
        src={item.thumbnail || "https://placehold.co/220x320?text=No+Cover"}
        alt={`Cover of ${item.title}`}
      />
      <div className="item-content">
        <div className="item-head">
          <h3>{item.title}</h3>
          <button type="button" onClick={() => onToggleFavorite(item.id)}>
            {item.isFavorite ? "★ Favorite" : "☆ Favorite"}
          </button>
        </div>

        {!editing ? (
          <>
            <p>
              <strong>Author:</strong> {item.author}
            </p>
            <p>
              <strong>Status:</strong> {item.readingStatus}
            </p>
            <p>
              <strong>Genre:</strong> {item.details.genre}
            </p>
            <p>
              <strong>Rating:</strong> {item.rating}/5
            </p>
            {item.details.notes && (
              <p>
                <strong>Notes:</strong> {item.details.notes}
              </p>
            )}
          </>
        ) : (
          <form className="edit-form" onSubmit={handleSave}>
            <label>
              Title
              <input
                name="title"
                value={draft.title}
                onChange={handleFieldChange}
              />
            </label>
            <label>
              Author
              <input
                name="author"
                value={draft.author}
                onChange={handleFieldChange}
              />
            </label>
            <label>
              Status
              <select
                name="readingStatus"
                value={draft.readingStatus}
                onChange={handleFieldChange}
              >
                <option value="not-started">not-started</option>
                <option value="want-to-read">want-to-read</option>
                <option value="reading">reading</option>
                <option value="completed">completed</option>
              </select>
            </label>
            <label>
              Genre
              <input
                name="genre"
                value={draft.genre}
                onChange={handleFieldChange}
              />
            </label>
            <label>
              Rating (0-5)
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="1"
                value={draft.rating}
                onChange={handleFieldChange}
              />
            </label>
            <label>
              Notes
              <textarea
                name="notes"
                value={draft.notes}
                onChange={handleFieldChange}
                rows="3"
              />
            </label>
            <div className="action-row">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="action-row">
          <Link to={`/item/${item.id}`}>Details</Link>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
          <button
            type="button"
            className="danger"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

LibraryItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    isFavorite: PropTypes.bool.isRequired,
    readingStatus: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    dateAdded: PropTypes.string.isRequired,
    details: PropTypes.shape({
      genre: PropTypes.string.isRequired,
      notes: PropTypes.string.isRequired,
      source: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default LibraryItem;
