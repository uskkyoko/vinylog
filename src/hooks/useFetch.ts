import { useReducer, useEffect } from "react";

type State<T> = { data: T; loading: boolean; error: string | null };

type Action<T> =
  | { type: "reset" }
  | { type: "success"; payload: T }
  | { type: "failure"; payload: string }
  | { type: "set"; payload: T };

function reduce<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "reset":
      return { ...state, loading: true, error: null };
    case "success":
      return { data: action.payload, loading: false, error: null };
    case "failure":
      return { ...state, loading: false, error: action.payload };
    case "set":
      return { ...state, data: action.payload };
  }
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  initial: T,
  dependencies: unknown[] = [],
) {
  const [state, dispatch] = useReducer(
    (s: State<T>, a: Action<T>): State<T> => reduce(s, a),
    { data: initial, loading: true, error: null },
  );

  useEffect(() => {
    let isMounted = true;
    dispatch({ type: "reset" });
    fetcher()
      .then((res) => {
        if (isMounted) dispatch({ type: "success", payload: res });
      })
      .catch((err: Error) => {
        if (isMounted) dispatch({ type: "failure", payload: err.message });
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return {
    data: state.data,
    setData: (data: T) => dispatch({ type: "set", payload: data }),
    loading: state.loading,
    error: state.error,
  };
}
