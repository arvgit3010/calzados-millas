import { NavLink } from "react-router-dom";
import { Flower2, HelpCircle, LogOut, Mountain, PlusCircle } from "lucide-react";
import { ROUTES } from "@/core";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  to: string;
};

const ITEMS: NavItem[] = [
  { label: "Sandalias", icon: <Flower2 size={18} />, to: ROUTES.gestionSandalias },
  { label: "Botines", icon: <Mountain size={18} />, to: ROUTES.gestionBotines },
];
export function InventorySidebar() {
  return (
    <aside className="flex flex-col h-full">
      <nav className="flex-1 space-y-5 px-2">
        <div>
          <p className="text-[10px] font-bold text-[#867275] uppercase tracking-widest mb-3">
            Gestión
          </p>
          <div className="space-y-0.5">
            {ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left no-underline",
                    isActive
                      ? "!bg-[#984258] !text-white font-bold shadow-sm hover:!bg-[#7A2E45] hover:!text-white"
                      : "!text-[#544245] hover:!bg-[#F5DCE9]/70 hover:!text-[#984258]",
                  ].join(" ")
                }
              >
                {item.icon}
                <span className="text-[14px] font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-[#E5E7EB] px-2 space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 !text-[#984258] bg-[#984258]/10 hover:bg-[#984258]/15 rounded-lg font-bold transition-all text-left border-0 cursor-pointer"
        >
          <PlusCircle size={18} />
          <span className="text-[14px] font-medium">Registrar Producto</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 !text-[#544245] hover:!text-[#984258] hover:bg-[#F5DCE9]/70 rounded-lg transition-all text-left border-0 bg-transparent cursor-pointer"
        >
          <HelpCircle size={18} aria-hidden="true" />
          <span className="text-[14px] font-medium">Centro de ayuda</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 !text-[#544245] hover:!text-[#984258] hover:bg-[#F5DCE9]/70 rounded-lg transition-all text-left border-0 bg-transparent cursor-pointer"
        >
          <LogOut size={18} aria-hidden="true" />
          <span className="text-[14px] font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
