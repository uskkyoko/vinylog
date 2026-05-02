import { useState, useEffect } from "react";

export function useFetch<T>(
  fetcher: () => Promise<T>,
  initial: T,
  dependencies: unknown[] = [],
) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetcher()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err: Error) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, setData, loading, error };
}
