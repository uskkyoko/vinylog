# Vinylog

A music discovery and review platform. Browse albums and artists sourced from Spotify, write reviews, curate lists, follow other users, and get AI-powered album recommendations.

**Live backend:** `https://vinylog.onrender.com`

---

## Getting Started

```bash
npm install
npm run dev
```

The dev server proxies `/api/*` requests to the backend automatically.

---

## Features

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

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Routing | React Router DOM v7 |
| Global state | Redux Toolkit |
| Auth state | React Context + `useReducer` |
| Styling | CSS3, component-scoped files |
| Testing | Vitest + React Testing Library |
| Backend | Custom FastAPI on Render |
| Music data | Spotify Web API (via backend) |

---

## Architecture

### State management

Two separate layers:

- **`AuthContext`** (`src/context/AuthContext.tsx`) — identity only. Owns the current user, JWT token, login / signup / logout, follow / unfollow. Status: `loading | authed | anon`.
- **Redux Toolkit** (`src/store/`) — the current user's mutable data: lists, reviews, favourite albums. Survives navigation and updates reactively.
- **`AppDataLoader`** (`src/context/AppStateContext.tsx`) — bridges auth to Redux. When auth becomes `authed`, dispatches the three initial fetch thunks.

### Data fetching

All read-only / page-local data goes through `useFetch` (`src/hooks/useFetch.ts`) — a generic hook that manages `data`, `loading`, and `error` state, handles async cancellation with an `isMounted` flag, and re-fetches when a dependency array changes.

All backend calls are centralised in `src/api/`, one file per domain (`albums.ts`, `artists.ts`, `lists.ts`, `reviews.ts`, `users.ts`, `search.ts`, `recommend.ts`). Assembled into a single `api` object via `src/api/index.ts`.

### Routing

Protected routes are wrapped in `<ProtectedRoute>`, which redirects unauthenticated users to `/login`. Album links always navigate by `spotify_id`; `AlbumDetail` resolves it to a numeric DB id via `GET /albums/spotify/{id}` and then redirects — this keeps navigation stable even when DB ids shift after a Spotify sync.

---

## Deployment

The frontend is configured for **Vercel**. `vercel.json` proxies `/api/:path*` to `https://vinylog.onrender.com/:path*`, mirroring the local dev proxy. Connect the repo to Vercel, set build command `npm run build` and publish directory `dist` — no other configuration needed.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # Type-check + production build → dist/
npm run preview      # Serve the production build locally
npm run typecheck    # tsc without emit
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch)
npm run verify       # typecheck + lint + test
```

---

## Project 3 — Custom Hook (`useFetch`)

The core of the data layer is `useFetch`. It abstracts asynchronous side effects into a reusable, type-safe interface.

1. **State orchestration** — manages `data`, `loading`, and `error` simultaneously.
2. **Auto-execution** — triggers the fetcher on mount, removing `useEffect` boilerplate from components.
3. **Dependency synchronisation** — re-fetches only when the dependency array changes.
4. **Memory-leak prevention** — uses an `isMounted` flag to cancel state updates on unmounted components.
5. **Manual override** — exposes `setData` for optimistic updates without a server round-trip.

---

## Project 5 — Backend Integration

### Backend

Custom FastAPI on Render (`https://vinylog.onrender.com`). No Firebase or Supabase — all endpoints are JWT-protected REST routes backed by a PostgreSQL database. Music data is synced from the Spotify Web API on demand.

### Auth

- JWT email/password via `AuthContext`
- `getMe` called on app mount — session restored from `localStorage` token across page reloads
- `ProtectedRoute` redirects unauthenticated users to `/login`
- Logout available in Settings


### Feature map

| Feature | Hook / Service | `loading` | `error` |
|---|---|---|---|
| Albums browse | `useAlbums` | ✓ | ✓ |
| Album detail | `useFetch` in `AlbumDetail` | ✓ | ✓ |
| Artists | `useArtistDetail` | ✓ | ✓ |
| Lists browse | `useFetch` in `Lists` | ✓ | ✓ |
| List detail | `useListDetail` | ✓ | ✓ |
| Reviews | `reviewsSlice` (Redux) | ✓ | ✓ |
| Review detail | `useFetch` in `ReviewDetail` | ✓ | ✓ |
| AI Recommend | `api.generateRecommendation` | ✓ | ✓ |
| Profile | `useProfileData` | ✓ | ✓ |
| Search | `useFetch` in `Search` | ✓ | ✓ |
| Settings | `usersSlice` (Redux) | ✓ | ✓ |

---

## AI Usage

- Component decomposition (home page, styles)
- Spotify API synchronisation with the backend
- Memory-leak prevention for `useFetch`
- Adapting Pydantic schemas to TypeScript types
- Architecture review and refactoring (hook extraction, SLA fixes)
- Claude Code used throughout for implementation
