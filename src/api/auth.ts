import type { LoginRequest, TokenResponse, SignupRequest, UserOut, GoogleAuthUrlResponse } from "../types";
import { get, mutateJSON, mutateVoid } from "./http";

export const authApi = {
  login: (data: LoginRequest): Promise<TokenResponse> =>
    mutateJSON<TokenResponse>("/auth/login", "POST", data),

  signup: (data: SignupRequest): Promise<TokenResponse> =>
    mutateJSON<TokenResponse>("/auth/signup", "POST", data),

  getMe: (): Promise<UserOut> => get<UserOut>("/users/me"),

  logout: (): Promise<void> => mutateVoid("/auth/logout", "POST"),

  getGoogleAuthUrl: (): Promise<GoogleAuthUrlResponse> =>
    get<GoogleAuthUrlResponse>("/auth/google"),

  googleCallback: (code: string): Promise<TokenResponse> =>
    get<TokenResponse>(`/auth/google/callback?code=${encodeURIComponent(code)}`),
};
