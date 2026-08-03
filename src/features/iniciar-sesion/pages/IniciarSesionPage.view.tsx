import { ShoppingBag, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core";
import type { LoginFormData } from "../hooks/useIniciarSesionPage";

type Props = {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  isSubmitting: boolean;
  apiError: string | null;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: () => void;
  showAdminModal: boolean;
  handleGoToEcommerce: () => void;
  handleGoToDashboard: () => void;
};

export function IniciarSesionPageView({
  register,
  errors,
  isSubmitting,
  apiError,
  showPassword,
  onTogglePassword,
  onSubmit,
  showAdminModal,
  handleGoToEcommerce,
  handleGoToDashboard,
}: Props) {
  return (
    <>
      <div className="login-mesh-bg" />

      <main className="flex min-h-[100dvh] items-center justify-center px-[24px] py-[16px]">
        <div className="w-full max-w-[480px]">

          {/* ── Logo / Branding ── */}
          <div className="mb-[20px] flex flex-col items-center">
            <div className="mb-[12px] flex size-12 items-center justify-center rounded-2xl bg-[#984258]/90 shadow-lg backdrop-blur-sm">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <h2 className="text-[16px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#984258] opacity-90">
              Calzados Millas
            </h2>
            <p className="mt-1 text-[11px] leading-[1.5] tracking-widest text-[#251721]/50 uppercase">
              Luxury Inventory Management
            </p>
          </div>

          {/* ── Login Card ── */}
          <section className="login-hairline login-card-shadow login-transition rounded-[24px] bg-white p-6 md:p-7">
            <header className="mb-4 text-center">
              <h1 className="mb-2 text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#251721]">
                Inicio de sesión
              </h1>
              <p className="text-[14px] font-medium leading-[1.6] text-[#251721]/60">
                Accede al panel de control de calzado.
              </p>
            </header>

            {/* ── API Error ── */}
            {apiError && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">
                {apiError}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
              {/* ── Email Field ── */}
              <div className="space-y-[3px]">
                <label
                  htmlFor="login-email"
                  className="ml-1 block text-[13px] font-semibold leading-[1.5] uppercase tracking-wider text-[#251721]/70"
                >
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#251721]/30 transition-colors group-focus-within:text-[#984258]" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="ejemplo@millas.com"
                    className="login-field-bg w-full rounded-xl border-none py-2.5 pl-12 pr-4 text-[16px] leading-[1.7] outline-none placeholder:text-[#251721]/20 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-[#FACBD5]/50"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="absolute -bottom-[18px] left-0 text-[12px] leading-[1.3] text-red-600 z-10">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Password Field ── */}
              <div className="space-y-[3px]">
                <div className="flex items-center justify-between px-1">
                  <label
                    htmlFor="login-password"
                    className="block text-[13px] font-semibold leading-[1.5] uppercase tracking-wider text-[#251721]/70"
                  >
                    Contraseña
                  </label>
                  <span
                    className="cursor-pointer text-[13px] font-medium leading-[1.5] text-[#984258]/70 transition-colors hover:text-[#984258]"
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#251721]/30 transition-colors group-focus-within:text-[#984258]" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="login-field-bg w-full rounded-xl border-none py-2.5 pl-12 pr-12 text-[16px] leading-[1.7] outline-none placeholder:text-[#251721]/20 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-[#FACBD5]/50"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#251721]/30 transition-colors hover:text-[#251721]"
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="absolute -bottom-[18px] left-0 text-[12px] leading-[1.3] text-red-600 z-10">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Remember Me ── */}
              {/* <div className="flex items-center px-1">
                <input
                  id="login-remember"
                  type="checkbox"
                  className="size-4 rounded border-[#FACBD5]/30 bg-[#f9f2f4] text-[#984258] focus:ring-[#984258]"
                  {...register("rememberMe")}
                />
                <label
                  htmlFor="login-remember"
                  className="ml-3 cursor-pointer select-none text-[13px] leading-[1.5] text-[#251721]/60"
                >
                  Mantener sesión iniciada
                </label>
              </div> */}

              {/* ── Action Buttons ── */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="login-transition flex h-[56px] w-full items-center justify-center gap-[12px] rounded-xl bg-[#E8839A] font-semibold text-white shadow-lg shadow-[#E8839A]/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#E8839A]/30 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                {/* ── Social Divider ── */}
                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-[#251721]/10" />
                  <span className="text-[13px] leading-[1.5] uppercase tracking-widest text-[#251721]/40">
                    O continuar con
                  </span>
                  <div className="h-px flex-1 bg-[#251721]/10" />
                </div>

                {/* ── Social Buttons (vertical) ── */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="login-transition flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#251721]/10 hover:border-[#984258]/20 hover:bg-[#f9f2f4]"
                  >
                    <svg className="size-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                    </svg>
                    <span className="text-[13px] font-medium text-[#251721]/60">Continuar con Google</span>
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="login-transition flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#251721]/10 hover:border-[#984258]/20 hover:bg-[#f9f2f4]"
                  >
                    <svg className="size-4" viewBox="0 0 24 24">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M13 1h10v10H13z" />
                      <path fill="#05a6f0" d="M1 13h10v10H1z" />
                      <path fill="#ffba08" d="M13 13h10v10H13z" />
                    </svg>
                    <span className="text-[13px] font-medium text-[#251721]/60">Continuar con Microsoft</span>
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="login-transition flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#251721]/10 hover:border-[#984258]/20 hover:bg-[#f9f2f4]"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="#251721">
                      <path d="M17.05 20.28c-.98.95-2.05 1.72-3.21 1.72-1.13 0-1.5-.69-2.84-.69-1.33 0-1.75.67-2.84.67-1.13 0-2.25-.8-3.26-1.77-2.06-1.98-3.64-5.59-3.64-8.73 0-3.14 1.64-4.8 3.21-4.8 1.07 0 1.91.63 2.65.63.73 0 1.73-.75 2.98-.75 1.1 0 2.48.54 3.31 1.62-2.1 1.26-1.76 4.01.41 4.91-.83 2.04-1.83 4.19-2.77 5.13zM12.03 5.19c-.11-1.35.8-2.68 2.04-3.19.13 1.38-.83 2.66-2.04 3.19z" />
                    </svg>
                    <span className="text-[13px] font-medium text-[#251721]/60">Continuar con Apple</span>
                  </button>
                </div>

                {/* ── Volver al inicio ── */}
                <Link
                  to={ROUTES.home}
                  className="login-transition flex h-[56px] w-full items-center justify-center rounded-full font-medium text-[#251721]/60 hover:bg-[#f9f2f4] hover:text-[#251721]"
                >
                  Volver al inicio
                </Link>
              </div>
            </form>
          </section>

          {/* ── Footer ── */}
          <footer className="mt-[24px] text-center">
            <p className="text-[13px] leading-relaxed text-[#251721]/40">
              &copy; 2024 Calzados Millas. Sistema de gestión interno.<br />
              <span className="opacity-80">Desarrollado para la excelencia en retail.</span>
            </p>
          </footer>

        </div>
      </main>

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-[#251721]">
              ¿Dónde quieres ir?
            </h2>
            <p className="mb-4 text-sm text-[#251721]/70">
              Tu usuario es administrador. Elige a qué sección acceder.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoToEcommerce}
                className="w-full rounded-xl bg-[#E8839A] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                Ir a E‑commerce
              </button>
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full rounded-xl border border-[#251721]/10 px-4 py-2.5 text-sm font-semibold text-[#251721] bg-white hover:bg-[#f9f2f4] transition"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
