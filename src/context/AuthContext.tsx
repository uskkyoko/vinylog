/**
 * AuthProvider — the React component that owns all authentication state.
 *
 * This file exports ONLY AuthProvider so that react-refresh/only-export-components
 * is satisfied and Fast Refresh (HMR) can hot-reload this component reliably.
 * All non-component exports (AuthContext, AuthContextValue, useAuth) live in
 * src/context/useAuth.ts. See that file for the full explanation.
 *
 * STATE SHAPE (via useReducer)
 * ----------------------------
 *   user:   UserOut | null   — the authenticated user object (null when anon/loading)
 *   status: "loading"        — waiting for getMe() to resolve on first mount
 *           "authed"         — valid session; user is set
 *           "anon"           — no session; user is null
 *
 * ACTIONS
 * -------
 *   AUTH_SUCCESS  — sets user + status "authed" (after login, signup, or restored session)
 *   AUTH_FAILURE  — sets status "anon" ONLY if currently loading (guards against
 *                   a background 401 during an already-authed session logging out state)
 *   UPDATE_USER   — partial update for profile edits without a full re-login
 *   LOGOUT        — clears user + token, sets status "anon"
 *
 * INITIALISATION
 * --------------
 * On mount, calls api.getMe() to restore a persisted session (token stored
 * module-level in src/api/http.ts via setAuthToken). On 401, dispatches
 * AUTH_FAILURE → status becomes "anon" → ProtectedRoutes redirect to /login.
 */
import { useEffect, useReducer, type ReactNode } from "react";
import type { UserOut, LoginRequest, SignupRequest } from "../types";
import { api, setAuthToken } from "../api";
import { AuthContext, type AuthContextValue } from "./useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthStatus = "loading" | "authed" | "anon";

interface AuthState {
  user: UserOut | null;
  status: AuthStatus;
}

type AuthAction =
  | { type: "AUTH_SUCCESS"; payload: UserOut }
  | { type: "AUTH_FAILURE" }
  | { type: "UPDATE_USER"; payload: UserOut }
  | { type: "LOGOUT" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return { user: action.payload, status: "authed" };
    case "AUTH_FAILURE":
      /** Only transition to "anon" from "loading" — never drop an authed session silently. */
      if (state.status === "authed") return state;
      return { user: null, status: "anon" };
    case "LOGOUT":
      return { user: null, status: "anon" };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    status: "loading",
  });

  /** Restore session on first mount. Dispatches AUTH_FAILURE if no valid token. */
  useEffect(() => {
    api
      .getMe()
      .then((user) => dispatch({ type: "AUTH_SUCCESS", payload: user }))
      .catch(() => dispatch({ type: "AUTH_FAILURE" }));
  }, []);

  async function login(creds: LoginRequest) {
    const { access_token } = await api.login(creds);
    setAuthToken(access_token);
    const user = await api.getMe();
    dispatch({ type: "AUTH_SUCCESS", payload: user });
  }

  async function signup(data: SignupRequest) {
    const { access_token } = await api.signup(data);
    setAuthToken(access_token);
    const user = await api.getMe();
    dispatch({ type: "AUTH_SUCCESS", payload: user });
  }

  async function loginWithGoogle(code: string) {
    const { access_token } = await api.googleCallback(code);
    setAuthToken(access_token);
    const user = await api.getMe();
    dispatch({ type: "AUTH_SUCCESS", payload: user });
  }

  function logout() {
    api.logout().catch(() => {});
    setAuthToken(null);
    dispatch({ type: "LOGOUT" });
  }

  function updateCurrentUser(user: UserOut) {
    dispatch({ type: "UPDATE_USER", payload: user });
  }

  async function followUser(username: string) {
    await api.followUser(username);
  }

  async function unfollowUser(username: string) {
    await api.unfollowUser(username);
  }

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateCurrentUser,
    followUser,
    unfollowUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
