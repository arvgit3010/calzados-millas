import { createContext, useCallback, useEffect, useReducer } from "react";
import type { AuthUser } from "@/core/api/types";
import { login as loginApi } from "@/core/api/auth";

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

/* ─── Provider ─────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ status, user }, dispatch] = useReducer(authReducer, {
    status: "loading",
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const raw = localStorage.getItem("authUser");
    if (token && raw) {
      try {
        dispatch({ type: "RESTORE_SESSION", user: JSON.parse(raw) as AuthUser });
        return;
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
      }
    }
    dispatch({ type: "LOGOUT" });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user } = await loginApi(email, password);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("authUser", JSON.stringify(user));
    dispatch({ type: "LOGIN_SUCCESS", user });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
