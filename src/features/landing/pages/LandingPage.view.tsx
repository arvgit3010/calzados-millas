import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "../components/SocialIcons";
import { LandingLinkButton, LandingIconButton } from "../components/LandingButtons";
import { LandingProductShowcase } from "../components/LandingProductShowcase";
import { LandingScrollSections } from "../components/LandingScrollSections";
import { MilasLogo } from "../components/MilasLogo";
import { WhatsAppTransition } from "../components/WhatsAppTransition";
import { WhatsAppTrigger } from "../components/WhatsAppTrigger";
import { useWhatsAppTransition } from "../hooks/useWhatsAppTransition";
import type { LandingSocialLinks } from "../types";
import { ROUTES } from "@/core";

type LandingPageViewProps = {
  socialLinks: LandingSocialLinks;
};

const heroText = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function LandingPageView({ socialLinks }: LandingPageViewProps) {
  const { isActive, triggerWhatsApp, transitionMs } = useWhatsAppTransition();

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const handleScroll = () => {
      navbar.classList.toggle("landing-nav--scrolled", window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="landing-milas min-h-screen bg-[#fcf9f7] text-[#2a1e22] selection:bg-[#fcebeb] selection:text-[#2a1e22]">
      <WhatsAppTransition active={isActive} durationMs={transitionMs} />

      <div className="fixed inset-0 -z-10 pointer-events-none golden-thread-bg opacity-60" />
      <div className="fixed inset-0 -z-10 pointer-events-none landing-milas-gradient" />

      <header
        id="navbar"
        className="landing-nav landing-nav--milas sticky top-0 z-50 w-full border-b border-[rgba(168,124,124,0.15)] transition-all duration-500"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.home} className="no-underline">
              <MilasLogo compact />
            </Link>
            <div className="hidden items-center gap-5 md:flex">
              <WhatsAppTrigger
                whatsappUrl={socialLinks.whatsapp}
                onTrigger={triggerWhatsApp}
                className="milas-icon-btn text-[#867275] transition hover:text-[#984258] cursor-pointer"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </WhatsAppTrigger>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#867275] transition hover:text-[#984258]" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#867275] transition hover:text-[#984258]" aria-label="TikTok">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#coleccion" className="landing-nav-link landing-nav-link--active">Colección</a>
            <a href="#somos" className="landing-nav-link">Somos</a>
            <Link to={ROUTES.iniciarSession} className="landing-nav-link">Login</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LandingIconButton className="text-[#867275] hover:text-[#984258]" aria-label="Buscar">
              <Search size={18} />
            </LandingIconButton>
            <WhatsAppTrigger
              whatsappUrl={socialLinks.whatsapp}
              onTrigger={triggerWhatsApp}
              className="milas-btn milas-btn--ghost hidden px-5 py-2.5 sm:inline-flex cursor-pointer"
            >
              Consulta ahora
            </WhatsAppTrigger>
            <LandingLinkButton href={ROUTES.ecommerce} variant="primary" className="px-5 py-2.5">
              Compra aquí
            </LandingLinkButton>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-16 pt-10 md:px-10 md:pb-20 md:pt-14">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-4">
          <motion.div initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.p variants={heroText} custom={0} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#a87c7c]">
              Tienda online · Nueva temporada
            </motion.p>
            <motion.h1 variants={heroText} custom={1} className="font-display text-[clamp(3rem,10vw,5.5rem)] leading-[0.92] text-[#2a1e22]">
              <span className="block text-[clamp(1rem,2.5vw,1.25rem)] not-italic font-normal tracking-[0.2em] text-[#867275]">
                Calzados
              </span>
              <span className="block italic">Milas</span>
            </motion.h1>
            <motion.p variants={heroText} custom={2} className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#867275] md:text-base lg:mx-0">
              Elegancia en cada paso. Botines y calzado premium diseñados para
              quienes aman destacar con estilo.
            </motion.p>
            <motion.div variants={heroText} custom={3} className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <LandingLinkButton href={ROUTES.ecommerce} variant="primary" className="min-w-[200px] px-8 py-3.5">
                Ver colección
              </LandingLinkButton>
              <LandingLinkButton href="#somos" variant="secondary" className="min-w-[200px] px-8 py-3.5">
                Nuestra historia
              </LandingLinkButton>
            </motion.div>
            <motion.div variants={heroText} custom={4} className="mt-4 flex justify-center lg:justify-start">
              <WhatsAppTrigger
                whatsappUrl={socialLinks.whatsapp}
                onTrigger={triggerWhatsApp}
                className="milas-btn milas-btn--whatsapp px-8 py-3.5 cursor-pointer"
                icon={<WhatsAppIcon size={15} />}
              >
                Consulta por WhatsApp
              </WhatsAppTrigger>
            </motion.div>
          </motion.div>

          <LandingProductShowcase />
        </div>

        <motion.a
          href="#coleccion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#867275] transition hover:text-[#984258] lg:bottom-8"
          aria-label="Desplazarse hacia abajo"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.35em]">Explorar</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.a>
      </section>

      <LandingScrollSections onWhatsAppClick={triggerWhatsApp} whatsappUrl={socialLinks.whatsapp} />

      <footer className="border-t border-[#ece3de] bg-[#fcf9f7] px-6 py-12 text-center">
        <MilasLogo />
        <p className="mt-4 text-xs text-[#867275]">&copy; 2026. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
