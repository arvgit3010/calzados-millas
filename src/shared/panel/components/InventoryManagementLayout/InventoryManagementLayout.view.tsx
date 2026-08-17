import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, PanelLeftClose, Search } from "lucide-react";
import { ROUTES, useAuth } from "@/core";
import type { InventoryManagementLayoutLogic } from "../../hooks/useInventoryManagementLayout";
import type { StockRow } from "../../types";
import { InventorySidebar } from "../InventorySidebar/InventorySidebar";
import { StockAlertsBell } from "../StockAlertsBell/StockAlertsBell";

type InventoryManagementLayoutViewProps = InventoryManagementLayoutLogic & {
  title: string;
  rows: StockRow[];
  children?: ReactNode;
  noFooter?: boolean;
  /** Si true, el contenido principal hace scroll vertical (p. ej. dashboard). */
  contentScrollable?: boolean;
  compactTitle?: boolean;
};

export function InventoryManagementLayoutView({
  title,
  rows,
  children,
  noFooter = true,
  contentScrollable = false,
  compactTitle = false,
  sidebarOpen,
  toggleSidebar,
}: InventoryManagementLayoutViewProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.iniciarSession);
  };

  return (
    <div className="h-dvh overflow-hidden bg-[#FBF0F0] text-[#251721]">
      <header className="panel-admin-header fixed top-0 z-50 flex h-16 w-full items-center justify-between gap-3 border-b border-[#E8D5D9] bg-[#FFF7F9]/95 px-4 shadow-[0_4px_24px_rgba(168,124,124,0.08)] backdrop-blur-md md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-[#544245] hover:text-[#984258] hover:bg-[#F5DCE9]/50 transition-all cursor-pointer"
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
          </button>
          <Link
            to={ROUTES.home}
            className="panel-brand"
            aria-label="Milas Calzados — inicio"
          >
            <span className="panel-brand__mark" aria-hidden="true">
              <img
                src="/images/logo-milas.png"
                alt=""
                className="panel-brand__logo"
              />
            </span>
            <span className="panel-brand__text">
              <span className="panel-brand__name">Milas</span>
              <span className="panel-brand__tag">Calzados</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 max-w-xl mx-4 md:mx-8 hidden sm:block">
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#544245]"
              aria-hidden="true"
            />
            <input
              className="w-full pl-9 pr-4 py-1.5 bg-[#FFF0F6] rounded-full border-none outline-none text-[13px] text-[#251721] placeholder:text-[#867275]/50 transition-all focus:ring-2 focus:ring-[#984258]/20"
              placeholder="Buscar..."
              type="text"
            />
          </div>
        </div>
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <StockAlertsBell rows={rows} />

          <Link to={ROUTES.home} className="panel-header-btn panel-header-btn--ghost hidden md:inline-flex">
            Volver al inicio
          </Link>

          <div className="panel-user-chip">
            <div
              className="panel-user-chip__avatar"
              title={user?.email}
              aria-hidden="true"
            >
              {(user?.email?.[0] ?? "U").toUpperCase()}
            </div>

            <div className="panel-user-chip__info hidden min-w-0 sm:block">
              <p className="panel-user-chip__email" title={user?.email}>
                {user?.email ?? "Usuario"}
              </p>
              <p className="panel-user-chip__role">
                {user?.role === "admin" ? "Administrador" : user?.role ?? "Usuario"}
              </p>
            </div>

            <div className="panel-user-chip__divider hidden sm:block" aria-hidden="true" />

            <button
              type="button"
              onClick={handleLogout}
              className="panel-user-chip__logout"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-full pt-16">
        <aside
          className={`fixed left-0 top-16 bottom-0 w-56 bg-[#FFF7F9] border-r border-[#E5E7EB] flex flex-col p-3 z-40 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!sidebarOpen}
        >
          <InventorySidebar />
        </aside>
        <main
          className={`flex h-full min-h-0 flex-1 flex-col overflow-hidden p-3 md:p-4 transition-[margin] duration-300 ease-in-out ${
            sidebarOpen ? "ml-56" : "ml-0"
          }`}
        >
          {title ? (
            <div className="mb-2 shrink-0">
              <h1
                className={
                  compactTitle
                    ? "m-0 font-[Montserrat,Inter,system-ui,sans-serif] text-[12px] font-normal tracking-normal text-[#94A3B8]"
                    : "text-[20px] font-bold tracking-tight text-[#251721] md:text-[22px]"
                }
              >
                {title}
              </h1>
            </div>
          ) : null}
          <div
            className={`flex min-h-0 flex-1 flex-col ${
              contentScrollable ? "overflow-y-auto" : "overflow-hidden"
            }`}
          >
            {children}
          </div>
          {!noFooter && (
            <footer className="w-full shrink-0 py-3 flex justify-between items-center text-[#544245] text-[11px]">
              <div>
                <span className="font-bold text-[#984258] mr-2">Milas Calzados</span>
                <span>&copy; 2024. Todos los derechos reservados.</span>
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}
