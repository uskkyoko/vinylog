import { useState } from "react";
import { api } from "../api";
import type { RecommendResponse } from "../types";

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
