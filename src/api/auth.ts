import type { LoginRequest, TokenResponse, SignupRequest, UserOut } from "../types";
import { get, mutateJSON, mutateVoid } from "./http";

export const authApi = {
  login: (data: LoginRequest): Promise<TokenResponse> =>
    mutateJSON<TokenResponse>("/auth/login", "POST", data),

  signup: (data: SignupRequest): Promise<TokenResponse> =>
    mutateJSON<TokenResponse>("/auth/signup", "POST", data),

  getMe: (): Promise<UserOut> => get<UserOut>("/users/me"),

  logout: (): Promise<void> => mutateVoid("/auth/logout", "POST"),
};
