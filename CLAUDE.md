# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. App Overview

**Vinylog** is a music discovery and review platform. Users log in, write reviews for albums, curate lists, and discover music.

Core entities:
- **User** — authenticated identity; has a profile, favourite albums, followers/following
- **Album** — music release with cover art, artist, tracklist (sourced from Spotify)
- **Artist** — musician/band; has albums synced from Spotify on first visit
- **Review** — a user's rating + comment on an album
- **List** — a user-curated collection of albums

This repo is the **React + TypeScript frontend** (Vite) that talks to a FastAPI backend deployed at `https://vinylog.onrender.com`. `src/backend/templates/` contains Jinja2 templates kept for reference — not part of the Vite build.

## Commands

```bash
npm run dev          # start Vite dev server (proxies /api/* to vinylog.onrender.com)
npm run build        # type-check + production build → dist/
npm run preview      # serve the production build locally (after npm run build)
npm run lint         # ESLint
npm run typecheck    # tsc without emit
npm run test         # Vitest once
npm run test:watch   # Vitest watch mode
npm run verify       # typecheck + lint + test (full pre-commit check)
```

Run a single test file:
```bash
npx vitest run src/hooks/useFetch.test.ts
```

## 2. State Management Approach

Two separate layers — chosen to keep identity concerns out of Redux and avoid unnecessary re-fetching:

**`AuthContext`** (`src/context/AuthContext.tsx`) — identity only, backed by `useReducer`
- Owns: current user object, auth token, login/signup/logout, follow/unfollow
- `status: 'loading' | 'authed' | 'anon'`
- **Import the hook from `src/context/useAuth.ts`**, not `AuthContext.tsx` — the hook and context object live there so react-refresh can HMR the provider without breaking the context reference. Always: `import { useAuth } from "../../context/useAuth"`

**Redux Toolkit** (`src/store.ts` + `src/store/`) — current user's *mutable* data
- Owns: the user's lists, reviews, favourite albums — data that must survive navigation and update reactively
- Store file: `src/store.ts`
- Typed hooks: `src/hooks/hooks.ts` → `useAppSelector`, `useAppDispatch`

**`AppDataLoader`** (`src/context/AppStateContext.tsx`) — bridges auth → Redux
- When `status` becomes `'authed'`, dispatches the three initial fetch thunks

Provider nesting in `main.tsx`:
```
<Provider store> → <AuthProvider> → <AppDataLoader> → <BrowserRouter> → <App>
```

## 3. State Shape

```ts
// src/store.ts
export type RootState = {
  lists:   { items: ListOut[] };          // current user's lists
  reviews: { items: ReviewOut[] };        // current user's reviews
  users:   { favouriteAlbums: AlbumOut[] }; // current user's favourite albums
};
```

Thunks per slice (`src/store/`):
- `listsSlice`: `fetchMyLists`, `createList`, `updateList`, `deleteList`, `addAlbumToList`, `removeAlbumFromList`
- `reviewsSlice`: `fetchReviews`, `createReview`, `updateReview`, `deleteReview`
- `usersSlice`: `fetchFavouriteAlbums`, `saveFavouriteAlbums`

## 4. API Conventions

All backend communication lives in `src/api/`, split by domain:

```
src/api/
  http.ts       — fetch primitives: get<T>, mutateJSON<T>, mutateVoid, mutateFormData<T>,
                  authHeaders, setAuthToken, UnauthorizedError
  auth.ts       — login, signup, getMe, logout
  users.ts      — getCurrentUser, updateUser, uploadAvatar, getFavouriteAlbums,
                  updateFavouriteAlbums, followUser, unfollowUser
  albums.ts     — getAllAlbums, getAlbumDetails, getAlbumBySpotifyId, getTrendingAlbums,
                  getFeaturedAlbums, getFeedAlbums, searchAlbums, getAlbumTracks
  artists.ts    — getArtists, getArtistsDetails, getSpotifyArtist
  lists.ts      — getLists, getMyLists, getUserLists, createList, updateList, deleteList
  reviews.ts    — getReview, getReviews, createReview, updateReview, deleteReview
  search.ts     — search(q)
  recommend.ts  — generateRecommendation
  index.ts      — assembles all domain objects into a single `api` export
```

**Rules:**
- Import as `import { api } from "../../api"` — never import from individual domain files
- `setAuthToken(token)` writes a module-level variable; `authHeaders()` injects it on every request
- On 401, `http.ts` throws `UnauthorizedError` — `AuthContext` catches this and logs out
- No `axios`, no TanStack Query — native `fetch` via the primitives in `http.ts`

**Trailing slash rule** — applies only to top-level collection endpoints that FastAPI redirects (e.g. `/albums/`, `/reviews/`, `/lists/`). Sub-resource paths do **not** use trailing slashes (e.g. `/albums/details/${id}`, `/albums/trending`, `/artists/spotify/${id}`). Adding a trailing slash to a sub-resource path that the backend doesn't define will cause a 404.


## 5. Key Patterns

### Trending / Spotify ID resolution

The `/albums/trending` endpoint returns a lightweight `TrendingAlbumOut` shape — no numeric `id`, flat `artist_name` string, no nested `artist` object. Clicking a trending album navigates to `/albums/${spotify_id}`. `AlbumDetail` detects a non-numeric URL param and calls `GET /albums/spotify/${spotifyId}` first, which looks up or creates the album in the DB and returns its numeric `id`, then redirects to `/albums/${numericId}`.

### Artist Spotify sync

When `ArtistDetail` loads, `useArtistDetail` fetches `getArtistsDetails(id)`. If the artist has a `spotify_id` **and no albums yet** (`albums.length === 0`), it calls `getSpotifyArtist(spotify_id)` to sync albums from Spotify, then re-fetches. The "only when empty" guard is critical — re-syncing reassigns DB IDs and breaks existing reviews and lists.

### Profile data refresh

`useProfileData(username)` returns a `refresh()` function that re-fetches the public user profile. After `followUser` / `unfollowUser` (context), call `await refresh()` — do not call `api.getCurrentUser()` directly in the page component.

### AlbumCard accepts AlbumCardData

`AlbumCard` accepts `AlbumCardData` (not `AlbumOut`) — a minimal interface satisfied by both `AlbumOut` and `TrendingAlbumOut`. It resolves the artist display as `album.artist?.name ?? album.artist_name` and the link target as `album.id ?? album.spotify_id`. `AlbumCarousel` likewise accepts `AlbumCardData[]`.

## 6. Types of Note

```ts
// src/types/album.ts
TrendingAlbumOut   // shape returned by /albums/trending: {spotify_id, title, artist_name, cover_url, release_date}
SpotifyAlbumLookup // shape returned by /albums/spotify/{id}: {id, title, spotify_id, cover_url, release_date}
AlbumCardData      // common interface for AlbumCard: satisfies both AlbumOut and TrendingAlbumOut

// src/types/recommend.ts
RecommendRequest   // {user_input?: string | null}
RecommendResponse  // {artist_name, album_title, reason, original_prompt, album_id?, spotify_id?, cover_url?}
```

All types are re-exported from `src/types/index.ts`.

## 7. File Structure

```
src/
├── api/              One file per domain + http.ts primitives
├── context/          AuthContext.tsx (provider), useAuth.ts (hook + context), AppStateContext.tsx (AppDataLoader)
├── hooks/            useFetch.ts (primitive), domain hooks, hooks.ts (typed Redux)
├── store/            listsSlice.ts, reviewsSlice.ts, usersSlice.ts
├── store.ts          configureStore + RootState + AppDispatch exports
├── types/            One file per domain, all re-exported from index.ts
├── components/       Shared components used across 2+ pages
│   ├── NavBar/
│   ├── ReviewCard/
│   ├── AlbumPickerField/
│   ├── StarRatingField/
│   └── Button.tsx, FormField.tsx, AppLayout.tsx, AlbumCard.tsx, ArtistCard.tsx …
├── pages/            One folder per route
│   ├── Home/
│   ├── Albums/
│   ├── AlbumDetail/
│   ├── ArtistDetail/
│   ├── Profile/
│   ├── Reviews/
│   ├── ReviewDetail/
│   ├── CreateReview/
│   ├── EditReview/
│   ├── Settings/
│   ├── Lists/
│   ├── Search/
│   ├── Recommend/
│   └── Auth/
├── App.tsx           Route definitions + ProtectedRoute
└── main.tsx          Provider nesting + app entry point
```

**Naming patterns:**
- Page shell: `PageName.tsx` (default export)
- Co-located sub-components: separate files in the same folder (named exports) — never define multiple components in one file
- Shared components: `ComponentName.tsx` or `ComponentName/ComponentName.tsx`
- Slices: `domainSlice.ts`, reducer export: `domainReducer`
- Types: `src/types/domain.ts`, one interface per concept

## 8. Adding New Features

Follow these steps in order when adding any new operation (e.g. "bookmark an album"):

### Step 1 — Add the type

In `src/types/<domain>.ts`, add the request/response interface:
```ts
export interface BookmarkCreate { album_id: number; }
export interface BookmarkOut { id: number; album: AlbumOut; created_at: string; }
```
Re-export from `src/types/index.ts` if it's a new file.

### Step 2 — Add the API function

In the relevant `src/api/<domain>.ts` file:
```ts
createBookmark: (data: BookmarkCreate): Promise<BookmarkOut> =>
  mutateJSON<BookmarkOut>("/bookmarks/", "POST", data),
deleteBookmark: (id: number): Promise<void> =>
  mutateVoid(`/bookmarks/${id}/`, "DELETE"),
```
Add it to the `api` export object in `src/api/index.ts`.

### Step 3 — Add a Redux slice (if data is mutable and survives navigation)

In `src/store/bookmarksSlice.ts`:
```ts
export const fetchBookmarks = createAsyncThunk("bookmarks/fetch", () => api.getBookmarks());
export const createBookmark = createAsyncThunk("bookmarks/create", (data: BookmarkCreate) => api.createBookmark(data));
export const deleteBookmark = createAsyncThunk("bookmarks/delete", async (id: number) => { await api.deleteBookmark(id); return id; });

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: { items: [] as BookmarkOut[] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(createBookmark.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(deleteBookmark.fulfilled, (state, action) => { state.items = state.items.filter((b) => b.id !== action.payload); });
  },
});
export const bookmarksReducer = bookmarksSlice.reducer;
```

Register in `src/store.ts` and dispatch initial fetch in `AppDataLoader`.

### Step 4 — Skip Redux for read-only / page-local data

If the data doesn't need to survive navigation, use a domain hook:
```ts
// src/hooks/useBookmarks.ts
export function useBookmarks(userId: number) {
  return useFetch(() => api.getBookmarks(userId), [] as BookmarkOut[], [userId]);
}
```

### Step 5 — Build the UI

- Add `src/pages/Bookmarks/Bookmarks.tsx` (thin shell) + co-located sub-components in separate files
- Page shell pattern:
  ```tsx
  export default function Bookmarks() {
    const bookmarks = useAppSelector((state) => state.bookmarks.items);
    return (
      <AppLayout>
        <BookmarksHeader />
        <BookmarksList bookmarks={bookmarks} />
      </AppLayout>
    );
  }
  ```
- Register the route in `App.tsx`; wrap in `<ProtectedRoute>` if auth-required

### Step 6 — Verify

```bash
npm run verify   # typecheck + lint + test must all pass
```

---

## Component Conventions (enforced)

- **Pages contain no raw HTML** — every block is a named component
- **All buttons** → `<Button>` or `<ButtonLink>`. Never `<button className="...">` directly
- **All form fields** → wrapped in `<FormField label="..." htmlFor="...">`
- **All pages** → compose `<AppLayout>` themselves (never at router level)
- **CSS** → co-located `.css` file per page/component; global base in `src/index.css`
- **One component per file** — co-located sub-components go in their own file, even if small

## Routes

| Page | Route | Auth required |
|---|---|---|
| Home | `/` | Yes |
| Albums | `/albums` | No |
| Album detail | `/albums/:id` | No |
| Artist detail | `/artists/:id` | No |
| Search | `/search` | No |
| Lists | `/lists` | No |
| List detail | `/lists/:id` | No |
| Create / Edit list | `/lists/new`, `/lists/:id/edit` | Yes |
| Reviews | `/reviews` | Yes |
| Review detail | `/reviews/:id` | Yes |
| Create / Edit review | `/reviews/new`, `/reviews/:id/edit` | Yes |
| AI Recommend | `/recommend` | Yes |
| Profile | `/profile/:username` | No |
| Settings | `/settings` | Yes |
| About | `/about` | No |

## Deployment

`vercel.json` is checked in and proxies `/api/:path*` → `https://vinylog.onrender.com/:path*` in production, replicating the Vite dev proxy. Vercel handles SPA routing automatically (no separate fallback rule needed). Build command: `npm run build`, publish directory: `dist`.

All API calls in `src/api/http.ts` use relative `/api${path}` URLs — this works in both dev (Vite proxy) and production (Vercel rewrite). Do not change these to absolute URLs.

## Testing

Tests use **Vitest** + **@testing-library/react**. Test environment is `jsdom` (configured in `package.json`). Currently only `src/hooks/useFetch.test.ts` exists. New tests: use `renderHook` + `waitFor`, mock with `vi.fn()`, restore in `afterEach`.
