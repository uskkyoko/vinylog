# Architecture Review Results

> Analyzed on: 2026-03-26
> Project: Vinylog Frontend (`src/`)
> Total components analyzed: 80 (pages + shared components + sub-components)
> Issues found: 4

---

## Summary

The previous round of fixes (ISSUE-01 through ISSUE-04) has been applied cleanly — every page now has a single component per file, the four form pages use `FormPageShell`, all raw `<button>` elements have been replaced with `<Button>`, and `Search.tsx` uses `<FormError>`. The overall architecture is now noticeably stronger. Four issues remain: `SettingsForm` still owns its own page shell instead of using `FormPageShell`; `ArtistDetailAlbums` inlines a 25-line album card inside `.map()`; `RecommendForm` mixes a complex loading overlay with the form markup; and `Login` / `Signup` repeat the same auth card shell structure.

---

## What Was Fixed (Previous Review)

| Issue | Status |
|---|---|
| Sub-components defined in same file (7 files) | ✅ Fixed — all sub-components now have their own files |
| Form page shell duplicated across 4 pages | ✅ Fixed — `FormPageShell` created, used by CreateReview, EditReview, CreateList, EditList |
| Raw `<button>` elements in ProfileHeader, FollowModal, SearchArtistCard | ✅ Fixed — all use `<Button>` |
| Inline `style` for error in Search.tsx | ✅ Fixed — now uses `<FormError>` |

---

## Issues

### ISSUE-01: `SettingsForm` owns its own page shell instead of using `FormPageShell`

**Severity**: Medium
**Principle**: Code Duplication / SLA Violation
**Location**: `src/pages/Settings/SettingsForm.tsx:80–170`

`SettingsForm` is responsible for two things at once: rendering the page shell (section, card, eyebrow, h1) *and* managing the form state and fields. This is the exact pattern that `FormPageShell` was created to eliminate — it reappears here because Settings was not updated alongside the other four form pages. When reading `Settings.tsx`, you see `<AppLayout><SettingsForm user={user} /></AppLayout>`, which makes it look like the shell is handled at the page level, but in reality `SettingsForm` reaches outside its role and renders the shell itself. The form component should only own form fields and submission logic.

#### Current (Bad)

```tsx
// src/pages/Settings/SettingsForm.tsx
export function SettingsForm({ user }: { user: UserOut }) {
  // ... state for fullName, biography, avatarFile, selectedAlbums ...
  return (
    <section className="settings settings--page">  {/* shell — not the form's job */}
      <div className="settings__card">
        <div className="settings__header">
          <p className="eyebrow">Personalize</p>
          <h1 className="settings__title">User Profile</h1>
        </div>
        <form className="settings__form" onSubmit={handleSubmit}>
          {/* fields */}
        </form>
      </div>
    </section>
  );
}

// src/pages/Settings/Settings.tsx
export default function Settings() {
  return (
    <AppLayout>
      <SettingsForm user={user} />  {/* shell is hidden inside */}
    </AppLayout>
  );
}
```

#### Recommended (Good)

```tsx
// src/pages/Settings/SettingsForm.tsx — only owns form fields + submission
export function SettingsForm({ user }: { user: UserOut }) {
  // ... same state ...
  return (
    <form className="settings__form" onSubmit={handleSubmit}>
      {/* fields */}
    </form>
  );
}

// src/pages/Settings/Settings.tsx — owns the shell, consistent with other form pages
export default function Settings() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <FormPageShell eyebrow="Personalize" title="User Profile">
      <SettingsForm user={user} />
    </FormPageShell>
  );
}
```

**Why this is better**: `FormPageShell` is now used consistently across all five form pages; reading any form page immediately shows its eyebrow/title and the form it hosts.

---

### ISSUE-02: `ArtistDetailAlbums` inlines a 25-line album card inside `.map()`

**Severity**: Medium
**Principle**: SLA Violation
**Location**: `src/pages/ArtistDetail/ArtistDetailAlbums.tsx:19–47`

The `.map()` callback renders a `<Link>` with a nested image/placeholder block and an info block containing three separate pieces of data — title, year, and a conditionally rendered rating. That is 25 lines of JSX per item, enough to have its own internal logic (the placeholder fallback, the rating condition). By the single-level test: you cannot describe what `ArtistDetailAlbums` renders in one sentence using only named children — you have to say "a grid of linked items each with an image or placeholder and three text fields". That unnamed item is the missing component.

#### Current (Bad)

```tsx
// ArtistDetailAlbums.tsx
{albums.map((album) => (
  <Link key={album.id} to={`/albums/${album.spotify_id}`} className="artist-albums__item">
    <div className="artist-albums__item-image-wrapper">
      {album.cover_url ? (
        <img src={album.cover_url} alt={album.title} className="artist-albums__item-image" />
      ) : (
        <div className="artist-albums__item-image artist-albums__item-image--placeholder" />
      )}
    </div>
    <div className="artist-albums__item-info">
      <p className="artist-albums__item-title">{album.title}</p>
      <p className="artist-albums__item-year">{album.release_date?.slice(0, 4)}</p>
      {album.average_rating != null && (
        <p className="artist-albums__item-rating">★ {album.average_rating.toFixed(1)}</p>
      )}
    </div>
  </Link>
))}
```

#### Recommended (Good)

```tsx
// src/pages/ArtistDetail/ArtistAlbumCard.tsx
export function ArtistAlbumCard({ album }: { album: ArtistAlbumSummary }) {
  return (
    <Link to={`/albums/${album.spotify_id}`} className="artist-albums__item">
      <div className="artist-albums__item-image-wrapper">
        {album.cover_url ? (
          <img src={album.cover_url} alt={album.title} className="artist-albums__item-image" />
        ) : (
          <div className="artist-albums__item-image artist-albums__item-image--placeholder" />
        )}
      </div>
      <div className="artist-albums__item-info">
        <p className="artist-albums__item-title">{album.title}</p>
        <p className="artist-albums__item-year">{album.release_date?.slice(0, 4)}</p>
        {album.average_rating != null && (
          <p className="artist-albums__item-rating">★ {album.average_rating.toFixed(1)}</p>
        )}
      </div>
    </Link>
  );
}

// ArtistDetailAlbums.tsx — now reads as a single sentence
{albums.map((album) => (
  <ArtistAlbumCard key={album.id} album={album} />
))}
```

**Why this is better**: `ArtistDetailAlbums` becomes a pure grid layout; all the per-item rendering logic lives in `ArtistAlbumCard`, which can be read and tested in isolation.

---

### ISSUE-03: `RecommendForm` mixes a loading overlay with the form content

**Severity**: Low
**Principle**: SLA Violation
**Location**: `src/pages/Recommend/RecommendForm.tsx:58–101`

`RecommendForm` renders two entirely separate concerns in one return: an animated loading overlay (spinner with 3 rings, a rotating message) and the actual form (heading, textarea, submit button). These are at different abstraction levels — one is a full-screen UI state, the other is the form interaction surface. The overlay markup alone is 14 lines with its own inner structure. A reader of `RecommendForm` must mentally separate the overlay from the form; an `RecommendLoadingOverlay` component would make that boundary explicit.

#### Current (Bad)

```tsx
// RecommendForm.tsx
return (
  <>
    {loading && (
      <div className="recommend-loading">          {/* full-screen overlay */}
        <div className="recommend-loading__overlay" />
        <div className="recommend-loading__content">
          <div className="recommend-loading__spinner">
            <div className="recommend-loading__spinner-ring" />
            <div className="recommend-loading__spinner-ring" />
            <div className="recommend-loading__spinner-ring" />
          </div>
          <h2 ...>Finding your next favourite album…</h2>
          <p ...>{LOADING_MESSAGES[messageIndex]}</p>
        </div>
      </div>
    )}
    <div>
      <h1 ...>AI Recommendation</h1>   {/* the actual form */}
      {/* ... form fields ... */}
    </div>
  </>
);
```

#### Recommended (Good)

```tsx
// src/pages/Recommend/RecommendLoadingOverlay.tsx
export function RecommendLoadingOverlay({ message }: { message: string }) {
  return (
    <div className="recommend-loading">
      <div className="recommend-loading__overlay" />
      <div className="recommend-loading__content">
        <div className="recommend-loading__spinner">
          <div className="recommend-loading__spinner-ring" />
          <div className="recommend-loading__spinner-ring" />
          <div className="recommend-loading__spinner-ring" />
        </div>
        <h2 className="recommend-loading__title">Finding your next favourite album…</h2>
        <p className="recommend-loading__text">{message}</p>
      </div>
    </div>
  );
}

// RecommendForm.tsx
return (
  <>
    {loading && <RecommendLoadingOverlay message={LOADING_MESSAGES[messageIndex]} />}
    <div>
      <h1 ...>AI Recommendation</h1>
      {/* form fields */}
    </div>
  </>
);
```

**Why this is better**: Each component has one job; the rotating message logic stays in `RecommendForm` (it owns the state), but the overlay's visual structure moves to its own file.

---

### ISSUE-04: `Login` and `Signup` repeat the same auth card shell

**Severity**: Low
**Principle**: Code Duplication
**Location**: `src/pages/Auth/Login.tsx`, `src/pages/Auth/Signup.tsx`

Both auth pages open with the identical structure: `<section className="auth"><div className="auth__card"><div className="auth__header"><p className="eyebrow">...</p><h1 className="auth__title">...</h1></div>`. If the auth card ever needs a border change, a max-width update, or an additional wrapper, it has to be changed in two files. An `AuthShell` component (eyebrow + title + children) would DRY this up in exactly the same way `FormPageShell` did for form pages — and would make the auth pages consistent with the rest of the codebase's shell pattern.

Note: auth pages intentionally omit `AppLayout` (no nav/footer on login/signup), so `AuthShell` should NOT compose `AppLayout` — it is the top-level wrapper for those pages.

#### Current (Bad)

```tsx
// Login.tsx  and  Signup.tsx — same opening 10 lines
return (
  <section className="auth">
    <div className="auth__card">
      <div className="auth__header">
        <p className="eyebrow">Welcome back</p>   {/* "Join Vinylog" in Signup */}
        <h1 className="auth__title">Log In</h1>   {/* "Sign Up" in Signup */}
      </div>
      {/* Google button, divider, form, error, alt link */}
    </div>
  </section>
);
```

#### Recommended (Good)

```tsx
// src/pages/Auth/AuthShell.tsx
export function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="auth__title">{title}</h1>
        </div>
        {children}
      </div>
    </section>
  );
}

// Login.tsx
return (
  <AuthShell eyebrow="Welcome back" title="Log In">
    <Button variant="ghost" className="auth__google" ...>...</Button>
    {/* ... */}
  </AuthShell>
);
```

**Why this is better**: The auth shell is defined once; Login and Signup reduce to their unique content — the Google button, form fields, and footer link.

---

## Recommendations Summary

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | ISSUE-01: SettingsForm owns page shell | Low | Medium |
| 2 | ISSUE-02: ArtistDetailAlbums inlines 25-line album card | Low | Medium |
| 3 | ISSUE-03: RecommendForm mixes loading overlay with form | Low | Low |
| 4 | ISSUE-04: Login/Signup repeat auth card shell | Low | Low |

---

## Architecture Health Score

| Criterion | Score (1–5) | Notes |
|-----------|-------------|-------|
| Single Level of Abstraction | 4 | Pages are clean; `ArtistDetailAlbums` and `RecommendForm` still mix levels in child components |
| Component API Design | 5 | Props are minimal, well-typed, no prop-drilling, no god components |
| Data Flow Clarity | 5 | Auth/Redux split is clear; `AppDataLoader` bridge is elegant; per-component state is always local |
| API Abstraction Layer | 5 | All external calls go through `src/api/`; no raw `fetch` in components or hooks |
| App Layout / Shell | 5 | `AppLayout` composed inside every page; `FormPageShell` now unifies the 4 create/edit pages |
| Code Duplication | 4 | Previous round removed most duplication; `SettingsForm` shell and auth shell remain |
| Composition Patterns | 5 | `children` used correctly; `AlbumCardData` polymorphism is clean; `useFetch` primitive reused consistently |
| **Overall** | **4.7** | Near-production-quality architecture; only minor structural issues remain |
