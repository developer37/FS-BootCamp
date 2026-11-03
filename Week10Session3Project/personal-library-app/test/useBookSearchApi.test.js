import { describe, expect, it, jest } from "@jest/globals";
import { fetchBookResults } from "../src/hooks/useBookSearch";

describe("fetchBookResults endpoint behavior", () => {
  it("returns Google Books results and does not call Open Library when Google has items", async () => {
    // First call succeeds with items, so fallback should never execute.
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "google-1",
            volumeInfo: {
              title: "JavaScript: The Good Parts",
              authors: ["Douglas Crockford"],
              description: "Classic JavaScript reference.",
              imageLinks: { thumbnail: "https://example.com/thumb.jpg" },
              categories: ["Programming"],
            },
          },
        ],
      }),
    });

    const response = await fetchBookResults("javascript", fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain(
      "https://www.googleapis.com/books/v1/volumes?q=javascript",
    );
    expect(response.items).toHaveLength(1);
    expect(response.items[0].details.source).toBe("google-books");
    expect(response.noResults).toBe(false);
  });

  it("calls Open Library when Google Books returns no items", async () => {
    // Empty Google payload should trigger fallback search endpoint.
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          docs: [
            {
              key: "OL123W",
              title: "Eloquent JavaScript",
              author_name: ["Marijn Haverbeke"],
              cover_i: 12345,
              subject: ["Programming"],
              first_sentence: "A modern introduction to programming.",
            },
          ],
        }),
      });

    const response = await fetchBookResults("javascript", fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain(
      "https://www.googleapis.com/books/v1/volumes?q=javascript",
    );
    expect(fetchMock.mock.calls[1][0]).toContain(
      "https://openlibrary.org/search.json?q=javascript",
    );
    expect(response.items).toHaveLength(1);
    expect(response.items[0].details.source).toBe("open-library");
    expect(response.noResults).toBe(false);
  });

  it("calls Open Library when Google Books request fails", async () => {
    // Even a failed primary endpoint should still attempt fallback.
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          docs: [
            {
              key: "OL999W",
              title: "You Don't Know JS",
              author_name: ["Kyle Simpson"],
              cover_i: 67890,
              subject: ["Programming"],
              first_sentence: { value: "Deep dive into JavaScript." },
            },
          ],
        }),
      });

    const response = await fetchBookResults("javascript", fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain(
      "https://openlibrary.org/search.json?q=javascript",
    );
    expect(response.items).toHaveLength(1);
    expect(response.items[0].details.source).toBe("open-library");
    expect(response.items[0].description).toBe("Deep dive into JavaScript.");
  });
});
