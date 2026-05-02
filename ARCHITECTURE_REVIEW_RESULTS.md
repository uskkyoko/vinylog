# Architecture Review Results

> Analyzed on: 2026-04-30
> Project: Vinylog — music discovery and review platform
> Total components analyzed: 95 (pages, features, shared, hooks, context, store)
> Issues found: 6

---

## Summary

Vinylog's architecture is genuinely solid for a project of this size. Every page correctly composes `AppLayout`, the two-layer state system (AuthContext + Redux) is clean and well-bridged by `AppDataLoader`, `FormPageShell` and `SearchResultsSection` are excellent reuse patterns, and nearly every page reads like a single sentence of named components. The main issues are: two pages call the API directly instead of delegating to a domain hook, two non-page components also bypass the hook layer, and a "not found" error state is copy-pasted as raw HTML across five pages. The one-component-per-file rule (stated in CLAUDE.md) is also broken in three files.

---

## Issues

### ARCH-01: `ReviewDetail` bypasses the hook layer with a direct `useFetch` + `api` call

**Severity**: High
**Principle**: Missing API Abstraction / SLA Violation
**Location**: `src/pages/ReviewDetail/ReviewDetail.tsx`

`ReviewDetail` calls `useFetch(() => api.getReview(reviewId))` directly in the page component rather than delegating to a domain hook. Every other page that loads data (AlbumDetail aside) uses a domain hook — this page is an inconsistent exception, and it makes the data-fetching logic impossible to test or reuse in isolation.

#### Current (Bad)

```tsx
// ReviewDetail.tsx — page owns the fetch, imports api directly
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../api";

export default function ReviewDetail() {
  const reviewId = Number(id);
  const { data: review, loading, error } =
    useFetch(() => api.getReview(reviewId), null, [reviewId]);
  // ...
}
```

#### Recommended (Good)

```tsx
// src/hooks/useReviewDetail.ts — extract to a domain hook
export function useReviewDetail(reviewId: number) {
  return useFetch<ReviewOut | null>(
    () => api.getReview(reviewId),
    null,
    [reviewId],
  );
}

// ReviewDetail.tsx — page only knows about the hook
import { useReviewDetail } from "../../hooks/useReviewDetail";

export default function ReviewDetail() {
  const { data: review, loading, error } = useReviewDetail(reviewId);
  // ...
}
```

**Why this is better**: The hook layer is now consistent — every page delegates data fetching to a domain hook, and the fetch logic can be tested in isolation the same way `useArtistDetail` is.

---

### ARCH-02: Non-page components call `api` directly, bypassing the hook layer

**Severity**: High
**Principle**: Improper Layering / Missing API Abstraction
**Locations**: `src/pages/Recommend/RecommendForm.tsx`, `src/pages/Search/SearchArtistCard.tsx`

Two non-page components import and call `api` directly — one for a form submission, one for a navigation-on-click action. The intended layer order is **API → hooks → components**. When components skip the hook layer, the API is called in two different ways (hooks vs. direct), the call is not reusable, and it cannot be tested via the hook pattern the rest of the app uses.

#### Current (Bad)

```tsx
// RecommendForm.tsx — component owns the API call
import { api } from "../../api";

export function RecommendForm({ onResult }: RecommendFormProps) {
  async function handleSubmit(e: React.FormEvent) {
    const result = await api.generateRecommendation({ user_input: ... });
    onResult(result);
  }
  // ...
}

// SearchArtistCard.tsx — card owns the API call
export function SearchArtistCard({ artist }: ...) {
  async function handleClick() {
    const result = await api.getSpotifyArtist(artist.spotify_id);
    navigate(`/artists/${result.id}`);
  }
}
```

#### Recommended (Good)

```tsx
// src/hooks/useRecommend.ts
export function useRecommend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(input: string | null): Promise<RecommendResponse> {
    setLoading(true);
    setError(null);
    try {
      return await api.generateRecommendation({ user_input: input });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error };
}

// RecommendForm.tsx — component consumes the hook
export function RecommendForm({ onResult }: RecommendFormProps) {
  const { generate, loading, error } = useRecommend();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await generate(userInput.trim() || null);
    onResult(result);
  }
  // ...
}
```

**Why this is better**: The layering is consistent — hooks own API communication, components own rendering and user interaction. `useRecommend` can be tested the same way `useArtistDetail` is.

---

### ARCH-03: "Not found" error state is copy-pasted raw HTML across five pages

**Severity**: Medium
**Principle**: Code Duplication / SLA Violation
**Locations**: `AlbumDetail.tsx`, `ArtistDetail.tsx`, `ListDetail.tsx`, `ReviewDetail.tsx`, `Profile.tsx`

Every detail page has the same unnamed inline pattern for its error state: `<AppLayout><section className="..."><div className="container"><p>X not found.</p></div></section></AppLayout>`. Each page duplicates this structure with only the section class name and message changing. Because the pattern is unnamed, the page's render function mixes "show the not-found layout" with "show the loaded content" without any clear label for what the first branch is.

#### Current (Bad)

```tsx
// ArtistDetail.tsx, ListDetail.tsx, ReviewDetail.tsx — all copy this structure
if (error || !artist) {
  return (
    <AppLayout>
      <section className="artist-details">
        <div className="artist-details__container">
          <p>Artist not found.</p>
        </div>
      </section>
    </AppLayout>
  );
}
```

#### Recommended (Good)

```tsx
// src/components/PageNotFound.tsx
export function PageNotFound({
  section,
  containerClass,
  message,
}: {
  section: string;
  containerClass?: string;
  message: string;
}) {
  return (
    <AppLayout>
      <section className={section}>
        <div className={containerClass ?? "container"}>
          <p>{message}</p>
        </div>
      </section>
    </AppLayout>
  );
}

// ArtistDetail.tsx — error state is now one readable line
if (error || !artist) {
  return (
    <PageNotFound
      section="artist-details"
      containerClass="artist-details__container"
      message="Artist not found."
    />
  );
}
```

**Why this is better**: The not-found pattern is named and lives in one place; changing its structure (e.g., adding a "back" link) no longer requires editing five files.

---

### ARCH-04: Album search result items are inlined inside `AlbumPickerField` and `FavouriteAlbumsField` rather than extracted

**Severity**: Medium
**Principle**: SLA Violation / Code Duplication
**Locations**: `src/components/AlbumPickerField/AlbumPickerField.tsx`, `src/pages/Settings/FavouriteAlbumsField.tsx`

Both components render a dropdown list of album search results with the same structural shape: cover image + `title — artist_name` text + an action button. Neither extracts this repeating item into a named component. The SLA test fails: you can't describe what `AlbumPickerField` renders in a sentence of named children — the result-list section is raw `<div>` markup mixed into the same component.

For contrast, `ListForm` and `ListDetailAddAlbum` correctly extract this into `<SearchResultItem>`.

#### Current (Bad)

```tsx
// AlbumPickerField.tsx — result item is raw inline markup
{results.map((result) => (
  <div key={result.id} className="album-picker__item">
    {result.cover_url && <img src={result.cover_url} alt={result.title} />}
    <span className="album-picker__item-title">
      {result.title} — {result.artist_name}
    </span>
    <Button variant="ghost" size="sm" onClick={() => selectAlbum(result)}>
      Select
    </Button>
  </div>
))}
```

#### Recommended (Good)

```tsx
// AlbumPickerField/AlbumResultItem.tsx — extract the item
export function AlbumResultItem({
  album,
  onSelect,
}: {
  album: AlbumSearchResult;
  onSelect: (album: AlbumSearchResult) => void;
}) {
  return (
    <div className="album-picker__item">
      {album.cover_url && <img src={album.cover_url} alt={album.title} />}
      <span className="album-picker__item-title">
        {album.title} — {album.artist_name}
      </span>
      <Button variant="ghost" size="sm" onClick={() => onSelect(album)}>
        Select
      </Button>
    </div>
  );
}

// AlbumPickerField.tsx — results list is now a sentence of named children
{results.map((result) => (
  <AlbumResultItem key={result.id} album={result} onSelect={selectAlbum} />
))}
```

**Why this is better**: Each component now operates at a single abstraction level. `AlbumPickerField` composes `AlbumResultItem`; it no longer mixes dropdown logic with raw result markup. `FavouriteAlbumsField` can extract its own `FavouriteAlbumResultItem` with the same pattern.

---

### ARCH-05: `AlbumPreviews` is exported from a page-level file and imported cross-domain

**Severity**: Medium
**Principle**: Improper Layering / Code Duplication
**Locations**: `src/pages/Lists/ListCard.tsx` (exports `AlbumPreviews`), `src/pages/Profile/ProfileListCard.tsx` (imports it)

`AlbumPreviews` is a shared presentational component that renders album cover thumbnails. It lives inside `src/pages/Lists/ListCard.tsx` and is imported directly from there by `ProfileListCard.tsx` in a different page domain. This breaks encapsulation: the Profile domain is coupled to an internal implementation file of the Lists domain. If `ListCard.tsx` is refactored, `ProfileListCard` silently breaks.

It also violates the one-component-per-file convention: `ListCard.tsx` exports both `AlbumPreviews` and `ListCard`.

#### Current (Bad)

```tsx
// src/pages/Lists/ListCard.tsx — exports two unrelated components
export function AlbumPreviews({ albums }) { /* ... */ }
export function ListCard({ list }) { /* ... */ }

// src/pages/Profile/ProfileListCard.tsx — cross-domain import
import { AlbumPreviews } from "../Lists/ListCard";
```

#### Recommended (Good)

```tsx
// src/components/AlbumPreviews.tsx — move to shared components
export function AlbumPreviews({ albums }: { albums: ListOut["albums"] }) {
  // same implementation
}

// src/pages/Lists/ListCard.tsx — imports from shared
import { AlbumPreviews } from "../../components/AlbumPreviews";
export function ListCard({ list }) { /* ... */ }

// src/pages/Profile/ProfileListCard.tsx — also imports from shared
import { AlbumPreviews } from "../../components/AlbumPreviews";
```

**Why this is better**: `AlbumPreviews` now lives at the right layer — shared components — and neither page domain owns it. `ListCard.tsx` becomes one component per file, matching the project convention.

---

### ARCH-06: Three files export multiple components, violating the stated project convention

**Severity**: Low
**Principle**: Code Duplication / Convention Violation
**Locations**: `src/pages/Home/StatsCard.tsx`, `src/pages/Home/HomePanel.tsx`, `src/pages/Search/SearchListsSection.tsx`, `src/pages/Search/SearchUsersSection.tsx`

CLAUDE.md states "One component per file — co-located sub-components go in their own file, even if small." Several files break this rule: `StatsCard.tsx` exports `GuestCard` and `StatsCard`; `HomePanel.tsx` exports `HomeListItem` and `HomePanel`; `SearchListsSection.tsx` and `SearchUsersSection.tsx` each define an unexported card component alongside the exported section. The convention exists so that readers can find any component by name — if `GuestCard` is needed, it should live in `GuestCard.tsx`, not require knowing which other file it was grouped with.

#### Current (Bad)

```tsx
// StatsCard.tsx — two exported components
export function GuestCard() { /* ... */ }
export function StatsCard() { /* ... */ }

// SearchListsSection.tsx — unexported component buried in file
function SearchListCard({ list }) { /* ... */ }
export function SearchListsSection({ lists }) { /* ... */ }
```

#### Recommended (Good)

```
src/pages/Home/
  GuestCard.tsx          ← extracted
  StatsCard.tsx          ← only StatsCard
  HomeListItem.tsx       ← extracted
  HomePanel.tsx          ← only HomePanel

src/pages/Search/
  SearchListCard.tsx     ← extracted and exported
  SearchListsSection.tsx ← only SearchListsSection
  SearchUserCard.tsx     ← extracted and exported
  SearchUsersSection.tsx ← only SearchUsersSection
```

**Why this is better**: Any component is discoverable by its filename; the convention is applied uniformly across the codebase.

---

## Recommendations Summary

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | ARCH-01: `ReviewDetail` bypasses hook layer | Low | Medium |
| 2 | ARCH-02: `RecommendForm` + `SearchArtistCard` call `api` directly | Low | High |
| 3 | ARCH-03: "Not found" error state copy-pasted in 5 pages | Low | Medium |
| 4 | ARCH-04: Album search result item inlined in two picker components | Low | Medium |
| 5 | ARCH-05: `AlbumPreviews` exported from page file, imported cross-domain | Low | Medium |
| 6 | ARCH-06: Multiple components per file in 4 files | Low | Low |

All six issues are low effort — none require architectural redesign, new dependencies, or touching the state or routing layers. ARCH-02 has the highest impact because it re-establishes the hook-as-boundary pattern that the rest of the codebase already follows correctly.

---

## Architecture Health Score

| Criterion | Score (1–5) | Notes |
|-----------|-------------|-------|
| Single Level of Abstraction | 4 | Pages are almost universally clean; `AlbumPickerField` and `FavouriteAlbumsField` have inline result items |
| Component API Design | 5 | Props are minimal and well-typed throughout; `FormPageShell`, `SearchResultsSection`, and `HomePanel` are exemplary composition patterns |
| Data Flow Clarity | 4 | Two-layer state model (AuthContext + Redux) is clean and well-documented; `ProfileData` merge logic is the most complex but isolated to its hook |
| API Abstraction Layer | 3 | Hooks cover almost everything; `RecommendForm` and `SearchArtistCard` break the pattern; `api` is bare functions (not injectable), but the `http.ts` primitive layer is well-designed |
| App Layout / Shell | 5 | `AppLayout` and `FormPageShell` are correctly composed inside every single page — no router-level layout wrappers |
| Code Duplication | 3 | "Not found" raw HTML repeated in 5 pages; album result item inlined in two components; `AlbumPreviews` duplicated across domains |
| Composition Patterns | 4 | `children`-based composition used correctly; one-component-per-file violated in 4 files |
| **Overall** | **4 / 5** | Strong foundation with consistent patterns; all remaining issues are surface-level and fixable in one session |
