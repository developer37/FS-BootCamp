import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import useLocalStorage from "./hooks/useLocalStorage";
import FavoritesPage from "./pages/FavoritesPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import LibraryPage from "./pages/LibraryPage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";
import {
  addLibraryItem,
  removeLibraryItem,
  toggleFavoriteById,
  updateLibraryItem,
} from "./utils/libraryCrud";

function App() {
  // Shared library state persists in localStorage via custom hook.
  const [library, setLibrary, storageError] = useLocalStorage(
    "personal-library-items",
    [],
  );

  const addItem = (itemToAdd) => {
    let wasAdded = false;

    setLibrary((previousLibrary) => {
      const result = addLibraryItem(previousLibrary, itemToAdd);
      wasAdded = result.added;
      return result.library;
    });

    return wasAdded;
  };

  const updateItem = (id, updates) => {
    setLibrary((previousLibrary) =>
      updateLibraryItem(previousLibrary, id, updates),
    );
  };

  const removeItem = (id) => {
    setLibrary((previousLibrary) => removeLibraryItem(previousLibrary, id));
  };

  const toggleFavorite = (id) => {
    setLibrary((previousLibrary) => toggleFavoriteById(previousLibrary, id));
  };

  return (
    <div className="app-shell">
      <Navigation />

      <main>
        {/* Route-level page composition for the full CRUD flow. */}
        <Routes>
          <Route path="/" element={<Navigate replace to="/library" />} />
          <Route
            path="/library"
            element={
              <LibraryPage
                library={library}
                onToggleFavorite={toggleFavorite}
                onDeleteItem={removeItem}
                onUpdateItem={updateItem}
                storageError={storageError}
              />
            }
          />
          <Route
            path="/search"
            element={<SearchPage library={library} onAddItem={addItem} />}
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                library={library}
                onToggleFavorite={toggleFavorite}
                onDeleteItem={removeItem}
                onUpdateItem={updateItem}
              />
            }
          />
          <Route
            path="/item/:itemId"
            element={
              <ItemDetailsPage
                library={library}
                onUpdateItem={updateItem}
                onToggleFavorite={toggleFavorite}
                onDeleteItem={removeItem}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
