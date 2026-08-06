import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "./AuthContext";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  console.log("ctx", ctx);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
