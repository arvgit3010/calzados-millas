import { createContext, useCallback, useEffect, useReducer } from "react";
import type { AuthUser } from "@/core/api/types";
import { getMe, login as loginApi } from "@/core/api/auth";
import { setUnauthorizedHandler } from "@/core/api/axios";

/* ─── State ────────────────────────────────────────── */

type AuthState = {
  status: "loading" | "authenticated" | "unauthenticated";
  user: AuthUser | null;
};

type AuthAction =
  | { type: "RESTORE_SESSION"; user: AuthUser }
  | { type: "LOGIN_SUCCESS"; user: AuthUser }
  | { type: "LOGOUT" };

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_SESSION":
    case "LOGIN_SUCCESS":
      return { status: "authenticated", user: action.user };
    case "LOGOUT":
      return { status: "unauthenticated", user: null };
  }
}

/* ─── Context ──────────────────────────────────────── */

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function clearStoredSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
}

/* ─── Provider ─────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ status, user }, dispatch] = useReducer(authReducer, {
    status: "loading",
    user: null,
  });

  const logout = useCallback(() => {
    clearStoredSession();
    dispatch({ type: "LOGOUT" });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(() => undefined);
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch({ type: "LOGOUT" });
      return;
    }

    let cancelled = false;

    getMe()
      .then((profile) => {
        if (cancelled) return;
        localStorage.setItem("authUser", JSON.stringify(profile));
        dispatch({ type: "RESTORE_SESSION", user: profile });
      })
      .catch(() => {
        if (cancelled) return;
        clearStoredSession();
        dispatch({ type: "LOGOUT" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user } = await loginApi(email, password);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("authUser", JSON.stringify(user));
    dispatch({ type: "LOGIN_SUCCESS", user });
    return user;
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
