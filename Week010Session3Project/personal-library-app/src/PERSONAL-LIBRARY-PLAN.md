# Personal Library App (Simplified Plan)

## Overview

Build a personal library app where users search for books or movies, add them to a collection, edit details, mark favorites, and track reading status. Use React Router for navigation, hooks (and optionally Context) for state, and at least one public API.

## Suggested Structure

```text
src/
├── context/     LibraryContext.jsx, ThemeContext.jsx (both optional)
├── hooks/       useLocalStorage.js, useLibrary.js, useAPI.js
├── pages/       Library.jsx, Search.jsx, Favorites.jsx, ItemDetails.jsx
├── components/  Navigation.jsx, LibraryItem.jsx, SearchResults.jsx
├── App.jsx      routes and providers
└── main.jsx
```

## State to Plan

- **Library:** items, loading, error, favorites (array of IDs)
- **Theme (optional):** theme (`light` or `dark`), preferences
- **Item:** id, title, author, thumbnail, description, isFavorite, readingStatus (`want-to-read`, `reading`, `completed`, `not-started`), genre, rating (optional), dateAdded

## Requirements

1. **Routing:** Routes for Library, Search, Favorites, and Details. Use `Link`/`NavLink`, `useNavigate`, `useParams` for the item ID, and a catch-all 404 route.
2. **State:** Share state through Context or lifted props. Update immutably: spread for objects, `map`/`filter`/`[...arr, x]` for arrays, and `setState(prev => ...)` when depending on previous state.
3. **Custom hook:** At least one reusable hook (`useLocalStorage`, `useLibrary`, or `useAPI`).
4. **API (required):** Fetch book or movie data with async functions, show loading and error states, and parse the response into your item shape.
5. **Library (CRUD):**
   - Create: add items from search results
   - Read: show the library as a grid or list
   - Update: edit title, author, notes, and status
   - Delete: remove items immutably
   - Also: mark favorites, filter by status, genre, favorites, and rating, and sort by title, author, date added, and rating
6. **Search:** Search form, API request on submit, results with add buttons, and a no-results message.
7. **Details page:** Looks up the item by URL ID, shows the full description and larger image, and offers add, favorite, and remove actions.
8. **Persistence:** Save the library to localStorage on every update and load it on startup. Handle empty or corrupted storage.

## Build Order

1. **Foundation:** Vite + React, install `react-router`, create folders, stub pages, wire routes.
2. **State:** Build the library provider (add, remove, toggle favorite) and confirm values reach components.
3. **Hooks:** `useLocalStorage`, `useLibrary`, `useAPI`.
4. **Display:** `LibraryItem` component, map items, empty-state message. Use hardcoded items first.
5. **Manual add:** Temporary form on the Search page to test add, remove, and favorite without an API.
6. **API:** Test the endpoint in the browser, build `useAPI`, handle loading and errors with try/catch, parse results.
7. **Persistence:** Wire `useLocalStorage` into the library state.
8. **Polish:** Styling, favorites filter, details page, duplicate and empty-search handling.
9. **Deploy:** Deploy early, then redeploy as you go.

## Guidelines

- Keep components small and single-purpose. Separate presentation from container components.
- Pass only the props a component needs, and destructure them.
- Name handlers descriptively (`handleAddItem`, `handleSearch`) and keep them in the component that owns the state.
- Keep API keys in environment variables, not in code.
- Include every dependency in `useEffect` dependency arrays.
- Don't forget the Provider, mutate state directly, skip loading and error states, or skip saving to localStorage.

## APIs

| API | Endpoint | Key |
| --- | --- | --- |
| Google Books (recommended) | `https://www.googleapis.com/books/v1/volumes?q=javascript` | None |
| Open Library | `https://openlibrary.org/search.json?q=javascript` | None |
| OMDB (movies) | `http://www.omdbapi.com/?apikey=KEY&s=term` | Free key |

Google Books returns an `items` array. Each item has a `volumeInfo` object with title, authors, description, and imageLinks.

## Testing

- **Tools:** React DevTools for context and state, and the DevTools Application tab for localStorage.
- **Full run:** Search, add, view the library, favorite, filter to favorites, open details, remove, refresh (data should persist).
- **Routes:** Check that URLs change, back and forward work, and invalid routes show the 404.
- **Edge cases:**
  - Empty search
  - Search with no results
  - Duplicate item
  - Empty library
  - Invalid item ID in the URL
  - Mobile screen size
  - Cleared localStorage

## Submission Checklist

### React and state

- [ ] `useState` and `useEffect` used correctly
- [ ] At least one custom hook
- [ ] State shared across components via Context or lifting
- [ ] Immutable updates, with functional updates where needed

### Routing

- [ ] Multiple pages with working navigation
- [ ] URL parameter for item details
- [ ] 404 page for invalid routes

### API

- [ ] Search calls the API
- [ ] Loading and error states handled
- [ ] Response parsed and displayed

### Features

- [ ] Create, read, update, and delete work
- [ ] Favorites and reading status
- [ ] Filter and sort
- [ ] Details page
- [ ] localStorage persistence

### Quality

- [ ] Single-responsibility components
- [ ] No unused code, console errors, or unhandled errors shown to the user
- [ ] Responsive design

### Docs and deployment

- [ ] README covers everything in the outline below
- [ ] Deployed to Netlify or Vercel and working
- [ ] `npm run build` succeeds, and env variables are set if an API key is used

## README Outline

1. Title and one-line description
2. Live demo link
3. Features
4. Technologies used
5. Setup (clone, `npm install`, optional `.env`, `npm run dev`)
6. API documentation (endpoint, key instructions, rate limits)
7. Project structure
8. Future enhancements, author, license

## Deployment (Netlify)

1. Run `npm run build`.
2. Drag the `dist` folder into Netlify, or connect your GitHub repo.
3. Set build command `npm run build` and publish directory `dist`.
4. Add API keys under Site settings > Environment variables.

For Vercel, run `npm i -g vercel`, then `vercel`.

## Bonus Ideas

Search history, star ratings, custom tags, personal notes, `React.memo`/`useMemo`/`useCallback`, `React.lazy` code splitting, TypeScript, dark mode via Context, JSON/CSV export, sharing. Finish the requirements first.
