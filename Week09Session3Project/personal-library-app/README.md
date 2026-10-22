# Personal Library App

A React + Vite application for searching books, managing a personal collection, and persisting that collection in local storage.

## Architecture Diagram

```mermaid
flowchart TD
	U[User] --> UI[React UI Pages]

	subgraph Pages[Page Layer]
		NAV[Navigation]
		LIB[Library Page]
		SEA[Search Page]
		FAV[Favorites Page]
		DET[Item Details Page]
		NF[Not Found Page]
	end

	UI --> NAV
	UI --> LIB
	UI --> SEA
	UI --> FAV
	UI --> DET
	UI --> NF

	subgraph Router[Routing Layer]
		RR[react-router-dom]
	end

	UI <--> RR

	subgraph State[State + Domain Layer]
		APP[App.jsx]
		LS[useLocalStorage]
		CRUD[libraryCrud utils]
		BS[useBookSearch]
	end

	LIB --> APP
	SEA --> APP
	FAV --> APP
	DET --> APP

	APP --> LS
	APP --> CRUD
	SEA --> BS

	LS <--> LOCAL[(Browser localStorage)]

	BS --> GB[Google Books API]
	BS -->|Fallback when empty/fails| OL[Open Library API]

	GB --> BS
	OL --> BS
```

### Search Request Lifecycle (Sequence)

```mermaid
sequenceDiagram
	autonumber
	actor User
	participant SearchPage
	participant useBookSearch
	participant GoogleBooks
	participant OpenLibrary

	User->>SearchPage: Submit search query
	SearchPage->>useBookSearch: searchBooks(query)
	useBookSearch->>GoogleBooks: GET volumes?q=query

	alt Google returns items
		GoogleBooks-->>useBookSearch: items[]
		useBookSearch-->>SearchPage: setResults(googleItems)
	else Google empty or fails
		useBookSearch->>OpenLibrary: GET search.json?q=query
		OpenLibrary-->>useBookSearch: docs[]
		useBookSearch-->>SearchPage: setResults(openLibraryItems)
	end

	SearchPage-->>User: Render results / no-results / error
```

## Application Flow

### 1. App Boot

1. `main.jsx` mounts the app inside `BrowserRouter`.
2. `App.jsx` initializes shared library state with `useLocalStorage("personal-library-items", [])`.
3. `useLocalStorage` reads from `window.localStorage`, parses JSON, and recovers gracefully from corrupted data.

### 2. Routing and Navigation

1. `Navigation.jsx` provides links to `/library`, `/search`, and `/favorites`.
2. `App.jsx` defines routes:
   - `/` redirects to `/library`
   - `/library` shows full collection and filters
   - `/search` performs API search and add-to-library
   - `/favorites` shows favorite items
   - `/item/:itemId` shows detail and update/delete actions
   - `*` shows 404 page

### 3. Search Flow (with API Fallback)

1. User submits a query on `SearchPage`.
2. `useBookSearch.searchBooks` calls `fetchBookResults`.
3. `fetchBookResults` behavior:
   - Calls Google Books first.
   - If Google returns items, map and return those.
   - If Google returns no items or fails, call Open Library.
   - Map Open Library docs into the same internal item shape.
4. UI renders results, no-results message, or user-friendly error message.

### 4. CRUD Flow

1. `App.jsx` owns the library state and passes handlers to pages/components.
2. Operations are implemented in `src/utils/libraryCrud.js`:
   - Create: `addLibraryItem`
   - Read: `findLibraryItemById` and page-level rendering
   - Update: `updateLibraryItem` (includes nested `details` merge)
   - Delete: `removeLibraryItem`
   - Favorite toggle: `toggleFavoriteById`
3. All state changes are immutable (map/filter/spread patterns).

### 5. Persistence Flow

1. Any library update triggers `useLocalStorage` effect.
2. Updated data is serialized and saved back to local storage.
3. Refreshing the page restores the saved collection.

## Implementation Details

### Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- PropTypes for runtime prop validation
- Jest for unit testing
- ESLint for linting

### Project Structure

```text
src/
	App.jsx
	main.jsx
	App.css
	index.css
	components/
		Navigation.jsx
		LibraryItem.jsx
		SearchResultCard.jsx
	hooks/
		useLocalStorage.js
		useBookSearch.js
	pages/
		LibraryPage.jsx
		SearchPage.jsx
		FavoritesPage.jsx
		ItemDetailsPage.jsx
		NotFoundPage.jsx
	utils/
		libraryCrud.js
test/
	libraryCrud.test.js
	useBookSearchApi.test.js
```

### Data Model

Each library item uses a normalized shape:

- `id`, `title`, `author`, `description`, `thumbnail`
- `isFavorite`, `readingStatus`, `rating`, `dateAdded`
- `details`: `genre`, `notes`, `source`

### Error Handling

- Empty search input returns a friendly validation message.
- Search API failures show a user-friendly error in UI.
- Local storage parse failures reset to defaults with a storage warning.

### Testing

Unit tests are located in `test/`:

- `libraryCrud.test.js` validates CRUD and immutability behavior.
- `useBookSearchApi.test.js` validates endpoint order and fallback behavior.

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Lint

```bash
npm run lint
```

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Endpoints

- Google Books: `https://www.googleapis.com/books/v1/volumes?q=<query>&maxResults=20`
- Open Library fallback: `https://openlibrary.org/search.json?q=<query>`

## Notes for Deployment

- This project is a static Vite app and can be deployed to Netlify or Vercel.
- Browser local storage is per-user and per-browser; data does not sync across devices.
