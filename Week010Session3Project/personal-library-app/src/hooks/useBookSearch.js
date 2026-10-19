import { useState } from "react";

// Open Library sometimes returns sentence objects instead of raw strings.
function toDescription(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && typeof value.value === "string") {
    return value.value;
  }

  return "No description available.";
}

// Normalize Google Books records into app item shape.
function toLibraryItem(googleBook) {
  const volumeInfo = googleBook.volumeInfo ?? {};
  const imageLinks = volumeInfo.imageLinks ?? {};
  const authors = Array.isArray(volumeInfo.authors)
    ? volumeInfo.authors.join(", ")
    : "Unknown author";
  const categories = Array.isArray(volumeInfo.categories)
    ? volumeInfo.categories
    : ["Uncategorized"];

  return {
    id: googleBook.id,
    title: volumeInfo.title ?? "Untitled",
    author: authors,
    description: volumeInfo.description ?? "No description available.",
    thumbnail: imageLinks.thumbnail ?? imageLinks.smallThumbnail ?? "",
    isFavorite: false,
    readingStatus: "not-started",
    rating: 0,
    dateAdded: new Date().toISOString(),
    details: {
      genre: categories[0],
      notes: "",
      source: "google-books",
    },
  };
}

// Normalize Open Library records into the same app item shape.
function toLibraryItemFromOpenLibrary(openLibraryBook) {
  const authors = Array.isArray(openLibraryBook.author_name)
    ? openLibraryBook.author_name.join(", ")
    : "Unknown author";
  const subjects = Array.isArray(openLibraryBook.subject)
    ? openLibraryBook.subject
    : ["Uncategorized"];
  const coverUrl = openLibraryBook.cover_i
    ? `https://covers.openlibrary.org/b/id/${openLibraryBook.cover_i}-M.jpg`
    : "";

  return {
    id: `openlib-${openLibraryBook.key ?? crypto.randomUUID()}`,
    title: openLibraryBook.title ?? "Untitled",
    author: authors,
    description: toDescription(openLibraryBook.first_sentence),
    thumbnail: coverUrl,
    isFavorite: false,
    readingStatus: "not-started",
    rating: 0,
    dateAdded: new Date().toISOString(),
    details: {
      genre: subjects[0],
      notes: "",
      source: "open-library",
    },
  };
}

export async function fetchBookResults(query, fetchImpl = fetch) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      items: [],
      noResults: false,
      error: "Please enter a search term.",
    };
  }

  // Track first-endpoint failure so fallback errors are more explicit.
  let googleFailed = false;

  try {
    const googleResponse = await fetchImpl(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmedQuery)}&maxResults=20`,
    );

    if (!googleResponse.ok) {
      googleFailed = true;
    } else {
      const googleData = await googleResponse.json();
      const googleRawItems = Array.isArray(googleData.items)
        ? googleData.items
        : [];
      const googleMappedItems = googleRawItems.map(toLibraryItem);

      if (googleMappedItems.length > 0) {
        return {
          items: googleMappedItems,
          noResults: false,
          error: "",
        };
      }
    }
  } catch {
    googleFailed = true;
  }

  // Fallback endpoint is attempted for empty/failed Google results.
  let openLibraryResponse;
  try {
    openLibraryResponse = await fetchImpl(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmedQuery)}`,
    );
  } catch {
    throw new Error("Open Library request failed.");
  }

  if (!openLibraryResponse.ok) {
    if (googleFailed) {
      throw new Error("Google and Open Library requests failed.");
    }

    throw new Error("Open Library request failed.");
  }

  const openLibraryData = await openLibraryResponse.json();
  const openLibraryRawItems = Array.isArray(openLibraryData.docs)
    ? openLibraryData.docs
    : [];
  const openLibraryMappedItems = openLibraryRawItems
    .slice(0, 20)
    .map(toLibraryItemFromOpenLibrary);

  return {
    items: openLibraryMappedItems,
    noResults: openLibraryMappedItems.length === 0,
    error: "",
  };
}

export default function useBookSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noResults, setNoResults] = useState(false);

  const searchBooks = async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setNoResults(false);
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError("");
    setNoResults(false);

    try {
      // Keep hook state updates separate from fetch orchestration logic.
      const response = await fetchBookResults(trimmedQuery, fetch);

      if (response.error) {
        setError(response.error);
        setResults([]);
        setNoResults(false);
        return;
      }

      setResults(response.items);
      setNoResults(response.noResults);
    } catch {
      setError("Could not load books. Please try again in a moment.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    noResults,
    searchBooks,
  };
}
