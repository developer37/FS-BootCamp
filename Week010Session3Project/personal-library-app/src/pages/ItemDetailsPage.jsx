import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useParams } from "react-router-dom";

function ItemDetailsPage({
  library,
  onUpdateItem,
  onToggleFavorite,
  onDeleteItem,
}) {
  const { itemId } = useParams();
  const navigate = useNavigate();

  // Read the selected item directly from shared app state.
  const item = library.find((libraryItem) => libraryItem.id === itemId);
  const [draftNotes, setDraftNotes] = useState(item?.details.notes ?? "");
  const [draftStatus, setDraftStatus] = useState(
    item?.readingStatus ?? "not-started",
  );

  if (!item) {
    return (
      <section className="panel">
        <h2>Item not found</h2>
        <p>This item is not in your local library yet.</p>
        <Link to="/search">Go search for books</Link>
      </section>
    );
  }

  const handleSave = () => {
    // Persist only fields owned by this page.
    onUpdateItem(item.id, {
      readingStatus: draftStatus,
      details: {
        notes: draftNotes,
      },
    });
  };

  const handleDelete = () => {
    // Route back to the library after deletion to avoid dead detail links.
    onDeleteItem(item.id);
    navigate("/library");
  };

  return (
    <section className="panel detail-layout">
      <img
        className="detail-cover"
        src={item.thumbnail || "https://placehold.co/320x460?text=No+Cover"}
        alt={`Cover of ${item.title}`}
      />

      <div>
        <h2>{item.title}</h2>
        <p>
          <strong>Author:</strong> {item.author}
        </p>
        <p>
          <strong>Genre:</strong> {item.details.genre}
        </p>
        <p>
          <strong>Rating:</strong> {item.rating}/5
        </p>
        <p>
          <strong>Status:</strong> {item.readingStatus}
        </p>
        <p>{item.description}</p>

        <div className="detail-controls">
          <label>
            Update status
            <select
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value)}
            >
              <option value="not-started">not-started</option>
              <option value="want-to-read">want-to-read</option>
              <option value="reading">reading</option>
              <option value="completed">completed</option>
            </select>
          </label>

          <label>
            Notes
            <textarea
              value={draftNotes}
              onChange={(event) => setDraftNotes(event.target.value)}
              rows="4"
            />
          </label>
        </div>

        <div className="action-row">
          <button type="button" onClick={handleSave}>
            Save updates
          </button>
          <button type="button" onClick={() => onToggleFavorite(item.id)}>
            {item.isFavorite ? "Remove favorite" : "Mark favorite"}
          </button>
          <button type="button" className="danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}

ItemDetailsPage.propTypes = {
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default ItemDetailsPage;
