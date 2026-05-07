import type { ReviewOut, ReviewCreate, ReviewUpdate } from "../types";
import { get, mutateJSON, mutateVoid } from "./http";

export const reviewsApi = {
  getReview: (id: number): Promise<ReviewOut> =>
    get<ReviewOut>(`/reviews/${id}`),

  getReviews: (username: string): Promise<ReviewOut[]> =>
    get<ReviewOut[]>(`/users/${username}/reviews`),

  createReview: (data: ReviewCreate): Promise<ReviewOut> =>
    mutateJSON<ReviewOut>("/reviews/", "POST", data),

  updateReview: (id: number, data: ReviewUpdate): Promise<ReviewOut> =>
    mutateJSON<ReviewOut>(`/reviews/${id}`, "PUT", data),

  deleteReview: (id: number): Promise<void> =>
    mutateVoid(`/reviews/${id}`, "DELETE"),
};
