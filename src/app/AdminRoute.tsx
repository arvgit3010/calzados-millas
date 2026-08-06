import { Navigate, Outlet } from "react-router-dom";
import { ROUTES, useAuth } from "@/core";

export function AdminRoute() {
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f8f4ff]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#E8839A] border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to={ROUTES.iniciarSession} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to={ROUTES.ecommerce} replace />;
  }

  return <Outlet />;
}
