/**
 * useAuth — hook for consuming AuthContext, plus the context definition.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * react-refresh/only-export-components requires that every file exporting
 * a React component exports ONLY components (no hooks, no context objects,
 * no bare functions). Mixing exports breaks Fast Refresh (HMR) — React silently
 * skips hot-reloading any component in that file.
 *
 * The fix: move all non-component exports out of AuthContext.tsx.
 *   AuthContext.tsx  → exports AuthProvider only (React component)
 *   useAuth.ts       → exports AuthContext, AuthContextValue, and useAuth
 *                      (no React component → rule does not apply)
 *
 * DEPENDENCY DIRECTION
 * --------------------
 *   useAuth.ts   (defines context + hook)
 *       ↑
 *   AuthContext.tsx  (imports AuthContext from here; exports AuthProvider)
 *       ↑
 *   every consumer    (imports useAuth from here)
 *
 * DATA FLOW
 * ---------
 * AuthProvider reads state from useReducer and writes it into AuthContext.Provider.
 * useAuth reads from the nearest Provider via useContext(AuthContext) and throws
 * if called outside the tree — preventing silent undefined access.
 */
import { createContext, useContext } from "react";
import type { UserOut, LoginRequest, SignupRequest } from "../types";

/** Shape of the value stored in AuthContext. */
export interface AuthContextValue {
  user: UserOut | null;
  status: "loading" | "authed" | "anon";
  login: (creds: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (user: UserOut) => void;
  followUser: (username: string) => Promise<void>;
  unfollowUser: (username: string) => Promise<void>;
}

/**
 * The React context object. Exported so AuthContext.tsx (AuthProvider) can
 * write into it without re-defining it. Consumers should always use useAuth()
 * rather than calling useContext(AuthContext) directly.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);

/** Typed accessor for AuthContext — throws if used outside AuthProvider. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
