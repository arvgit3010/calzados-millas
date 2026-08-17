import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ROUTES, useAuth } from "@/core";
import { Lni, LniIcon } from "../icons/LniIcon";

type NavItem = {
  label: string;
  icon: string;
  to: string;
  end?: boolean;
};

const ITEMS: NavItem[] = [
  { label: "Dashboard", icon: Lni.dashboard, to: ROUTES.dashboard, end: true },
  { label: "Reportes", icon: Lni.reportes, to: ROUTES.reportes },
  { label: "Sandalias", icon: Lni.sandalias, to: ROUTES.gestionSandalias },
  { label: "Botines", icon: Lni.botines, to: ROUTES.gestionBotines },
];

export function InventorySidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="flex h-full flex-col">
      <nav className="flex-1 space-y-5 px-2">
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A7B82]">
            Gestión
          </p>
          <div className="space-y-1">
            {ITEMS.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="panel-sidebar-link"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {({ isActive }) => (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors duration-200",
                      isActive
                        ? "bg-[#984258] text-white shadow-[0_8px_20px_-12px_rgba(152,66,88,0.7)]"
                        : "text-[#544245] hover:bg-[#F5DCE9]/65 hover:text-[#984258]",
                    ].join(" ")}
                  >
                    <motion.span
                      className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      animate={
                        isActive
                          ? { backgroundColor: "rgba(255,255,255,0.14)" }
                          : { backgroundColor: "rgba(152,66,88,0.08)" }
                      }
                      whileHover={{ rotate: isActive ? 0 : -4, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      <LniIcon name={item.icon} size={18} />
                    </motion.span>
                    <span className="relative z-[1] text-[13px] font-medium tracking-tight">
                      {item.label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto space-y-1 border-t border-[#E8E0E3] px-2 pt-4">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-[#984258]/10 px-3.5 py-2.5 text-left font-semibold text-[#984258] transition-colors hover:bg-[#984258]/16"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#984258]/12">
            <LniIcon name={Lni.registrar} size={18} />
          </span>
          <span className="text-[13px] font-medium">Registrar producto</span>
        </motion.button>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3.5 py-2.5 text-left text-[#544245] transition-colors hover:bg-[#F5DCE9]/65 hover:text-[#984258]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#984258]/06">
            <LniIcon name={Lni.ayuda} size={18} />
          </span>
          <span className="text-[13px] font-medium">Centro de ayuda</span>
        </button>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate(ROUTES.iniciarSession);
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3.5 py-2.5 text-left text-[#544245] transition-colors hover:bg-[#F5DCE9]/65 hover:text-[#984258]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#984258]/06">
            <LniIcon name={Lni.logout} size={18} />
          </span>
          <span className="text-[13px] font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
