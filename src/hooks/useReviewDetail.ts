import { api } from "../api";
import { useFetch } from "./useFetch";
import type { ReviewOut } from "../types";

export function useReviewDetail(reviewId: number) {
  return useFetch<ReviewOut | null>(
    () => api.getReview(reviewId),
    null,
    [reviewId],
  );
}
