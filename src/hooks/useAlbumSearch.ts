import { useState, useEffect } from "react";
import { api } from "../api";
import type { AlbumSearchResult } from "../types";

export function useAlbumSearch(query: string) {
  const [results, setResults] = useState<AlbumSearchResult[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) return;
    api
      .searchAlbums(query)
      .then((data) => setResults(data))
      .catch((err: Error) => setError(err));
  }, [query]);

  return { results: query ? results : [], error };
}
