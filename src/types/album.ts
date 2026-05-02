import type { ArtistOut } from "./artist";
import type { UserOut } from "./user";
import type { ReviewOut } from "./review";

export interface TrackOut {
  name: string;
  track_number: number;
}

export interface AlbumSearchResult {
  id: string;
  title: string;
  artist_name: string;
  cover_url: string | null;
}

export interface AlbumCreate {
  spotify_id: string;
  title: string;
  artist: string;
  release_date: string;
  cover_url?: string | null;
}

export interface AlbumUpdate {
  title?: string | null;
  artist?: string | null;
  release_date?: string | null;
  cover_url?: string | null;
}

export interface AlbumOut {
  id: number;
  spotify_id: string;
  title: string;
  release_date: string;
  cover_url: string | null;
  archived: boolean;
  artist: ArtistOut | null;
  favoured_by_users: UserOut[];
  reviews: ReviewOut[];
}

/** Lightweight album shape returned by /albums/trending and similar list endpoints */
export interface TrendingAlbumOut {
  spotify_id: string;
  title: string;
  artist_name: string;
  cover_url: string | null;
  release_date: string;
}

/** Response shape from /albums/trending */
export interface TrendingAlbumsResponse {
  popular: TrendingAlbumOut[];
  new_releases: TrendingAlbumOut[];
}

/** Response from /albums/spotify/{spotify_id} — resolves or creates an album and returns its DB id */
export interface SpotifyAlbumLookup {
  id: number;
  title: string;
  spotify_id: string;
  cover_url: string | null;
  release_date: string;
}

/** Minimum shape accepted by AlbumCard — satisfied by both AlbumOut and TrendingAlbumOut */
export interface AlbumCardData {
  id?: number | null;
  spotify_id: string;
  title: string;
  artist?: ArtistOut | null;
  artist_name?: string | null;
  cover_url: string | null;
  release_date?: string | null;
}
