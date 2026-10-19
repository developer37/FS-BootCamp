import { describe, expect, it } from "@jest/globals";
import {
  addLibraryItem,
  findLibraryItemById,
  normalizeLibraryItem,
  removeLibraryItem,
  toggleFavoriteById,
  updateLibraryItem,
} from "../src/utils/libraryCrud";

// Factory keeps test setup concise while allowing per-test overrides.
function makeItem(overrides = {}) {
  return {
    id: "abc123",
    title: "Test Driven Development",
    author: "Kent Beck",
    description: "A practical guide to TDD.",
    thumbnail: "",
    isFavorite: false,
    readingStatus: "not-started",
    rating: 3,
    dateAdded: "2026-10-18T00:00:00.000Z",
    details: {
      genre: "Software",
      notes: "",
      source: "manual",
    },
    ...overrides,
  };
}

describe("libraryCrud utilities", () => {
  it("normalizes partial API objects into a complete library item", () => {
    const normalized = normalizeLibraryItem({ id: 42, details: {} });

    expect(normalized.id).toBe("42");
    expect(normalized.title).toBe("Untitled");
    expect(normalized.author).toBe("Unknown author");
    expect(normalized.details.genre).toBe("Uncategorized");
  });

  it("creates by adding a new unique item", () => {
    const start = [makeItem({ id: "1" })];
    const result = addLibraryItem(
      start,
      makeItem({ id: "2", title: "Refactoring" }),
    );

    expect(result.added).toBe(true);
    expect(result.library).toHaveLength(2);
    expect(result.library[1].id).toBe("2");
    expect(start).toHaveLength(1);
  });

  it("does not add duplicates", () => {
    const start = [makeItem({ id: "1" })];
    const result = addLibraryItem(
      start,
      makeItem({ id: "1", title: "Duplicate" }),
    );

    expect(result.added).toBe(false);
    expect(result.library).toHaveLength(1);
  });

  it("reads an item by id", () => {
    const library = [
      makeItem({ id: "1" }),
      makeItem({ id: "2", title: "Clean Code" }),
    ];

    expect(findLibraryItemById(library, "2")?.title).toBe("Clean Code");
    expect(findLibraryItemById(library, "999")).toBeNull();
  });

  it("updates item fields and nested details immutably", () => {
    // This test guards against accidental in-place mutation.
    const start = [makeItem({ id: "1" }), makeItem({ id: "2" })];
    const updated = updateLibraryItem(start, "2", {
      readingStatus: "reading",
      details: {
        notes: "Chapter 3 complete",
      },
    });

    expect(updated[1].readingStatus).toBe("reading");
    expect(updated[1].details.notes).toBe("Chapter 3 complete");
    expect(updated[1].details.genre).toBe("Software");
    expect(start[1].readingStatus).toBe("not-started");
    expect(start[1].details.notes).toBe("");
  });

  it("toggles favorite status", () => {
    const start = [makeItem({ id: "1", isFavorite: false })];
    const toggled = toggleFavoriteById(start, "1");

    expect(toggled[0].isFavorite).toBe(true);
    expect(start[0].isFavorite).toBe(false);
  });

  it("deletes by removing item id", () => {
    const start = [makeItem({ id: "1" }), makeItem({ id: "2" })];
    const removed = removeLibraryItem(start, "1");

    expect(removed).toHaveLength(1);
    expect(removed[0].id).toBe("2");
    expect(start).toHaveLength(2);
  });
});
