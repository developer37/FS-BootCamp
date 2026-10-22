export function normalizeLibraryItem(item) {
  // Ensure all items always have the fields required by the UI.
  return {
    id: String(item.id),
    title: item.title ?? "Untitled",
    author: item.author ?? "Unknown author",
    description: item.description ?? "No description available.",
    thumbnail: item.thumbnail ?? "",
    isFavorite: Boolean(item.isFavorite),
    readingStatus: item.readingStatus ?? "not-started",
    rating: Number(item.rating) || 0,
    dateAdded: item.dateAdded ?? new Date().toISOString(),
    details: {
      genre: item.details?.genre ?? "Uncategorized",
      notes: item.details?.notes ?? "",
      source: item.details?.source ?? "manual",
    },
  };
}

export function addLibraryItem(library, itemToAdd) {
  // Prevent duplicate IDs from being added to persisted state.
  const normalizedItem = normalizeLibraryItem(itemToAdd);
  const alreadyExists = library.some((item) => item.id === normalizedItem.id);

  if (alreadyExists) {
    return {
      library,
      added: false,
    };
  }

  return {
    library: [...library, normalizedItem],
    added: true,
  };
}

export function findLibraryItemById(library, id) {
  return library.find((item) => item.id === String(id)) ?? null;
}

export function updateLibraryItem(library, id, updates) {
  return library.map((item) => {
    if (item.id !== String(id)) {
      return item;
    }

    return {
      ...item,
      ...updates,
      // Merge nested details immutably to preserve unchanged keys.
      details: updates.details
        ? {
            ...item.details,
            ...updates.details,
          }
        : item.details,
    };
  });
}

export function removeLibraryItem(library, id) {
  return library.filter((item) => item.id !== String(id));
}

export function toggleFavoriteById(library, id) {
  // Toggle only the targeted item and return a new array.
  return library.map((item) => {
    if (item.id !== String(id)) {
      return item;
    }

    return {
      ...item,
      isFavorite: !item.isFavorite,
    };
  });
}
