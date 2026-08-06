import { motion } from "motion/react";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import { ROUTES } from "@/core";
import { LANDING_PRODUCTS } from "../config/landingAssets";
import { LandingLinkButton } from "./LandingButtons";
import { WhatsAppTrigger } from "./WhatsAppTrigger";
import { WhatsAppIcon } from "./SocialIcons";

type LandingScrollSectionsProps = {
  whatsappUrl: string;
  onWhatsAppClick: (url: string) => void;
};

const FEATURES = [
  { icon: Sparkles, title: "Diseño exclusivo", desc: "Calzado pensado para destacar en cada paso." },
  { icon: Shield, title: "Calidad garantizada", desc: "Materiales seleccionados y acabados premium." },
  { icon: Truck, title: "Envío rápido", desc: "Recibe tu pedido en tiempo récord a todo el Perú." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function LandingScrollSections({ whatsappUrl, onWhatsAppClick }: LandingScrollSectionsProps) {
  return (
    <>
      <section id="coleccion" className="relative bg-white/60 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14 text-center"
          >
            <motion.p variants={fadeUp} custom={0} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87c7c]">
              Colección
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl text-[#2a1e22] md:text-5xl">
              Estilo que <i>impresiona</i>
            </motion.h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LANDING_PRODUCTS.map((item, i) => (
              <motion.article
                key={item.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group overflow-hidden rounded-[1.75rem] border border-[#ece3de] bg-[#fcf9f7] shadow-[0_16px_40px_rgba(168,124,124,0.08)]"
              >
                <div className="landing-product-stage-mini relative flex h-56 items-end justify-center overflow-hidden">
                  <span className="absolute left-4 top-4 z-10 rounded-full border border-[#c9a96e]/30 bg-black/40 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-[#f5e6dc] backdrop-blur-sm">
                    {item.tag}
                  </span>
                  <motion.img
                    src={item.src}
                    alt={item.name}
                    className="landing-product-photo landing-product-photo--card w-[82%] max-w-[210px] pb-3 transition duration-500 group-hover:scale-[1.06]"
                    whileHover={{ y: -6 }}
                    draggable={false}
                  />
                </div>
                <div className="border-t border-[#f1e8ec] p-5">
                  <h3 className="font-display text-xl text-[#2a1e22]">{item.name}</h3>
                  <LandingLinkButton
                    href={ROUTES.ecommerce}
                    variant="ghost"
                    className="mt-4 border-0 bg-transparent px-0 py-0 text-[10px] shadow-none hover:bg-transparent"
                    icon={<ArrowRight size={13} />}
                  >
                    Explorar
                  </LandingLinkButton>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="somos" className="relative overflow-hidden bg-[#2a1e22] px-6 py-24 text-[#fcf9f7] md:px-10 md:py-32">
        <div className="landing-somos-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <motion.p variants={fadeUp} custom={0} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e8c4a8]">
              Somos Milas
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl leading-tight md:text-5xl">
              Calzado con <i>alma</i> y propósito
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-sm leading-relaxed text-[#d4c4c8] md:text-base">
              En Calzados Milas fusionamos artesanía, diseño contemporáneo y comodidad.
              Cada par cuenta una historia de elegancia pensada para quienes quieren
              destacar sin decir una palabra.
            </motion.p>
          </motion.div>

          <div className="grid gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#a87c7c]/25 text-[#e8c4a8]">
                  <f.icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm text-[#c4b4b8]">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fcf9f7] px-6 py-20 md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[#ece3de] bg-white px-8 py-14 text-center shadow-[0_24px_60px_rgba(168,124,124,0.12)] md:px-16"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87c7c]">
            Empieza hoy
          </p>
          <h2 className="mt-4 font-display text-3xl text-[#2a1e22] md:text-4xl">
            Tu próximo par te está esperando
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <LandingLinkButton href={ROUTES.ecommerce} variant="primary" className="px-8 py-3.5" icon={<ArrowRight size={14} />}>
              Comprar ahora
            </LandingLinkButton>
            <WhatsAppTrigger
              whatsappUrl={whatsappUrl}
              onTrigger={onWhatsAppClick}
              className="milas-btn milas-btn--whatsapp px-8 py-3.5 cursor-pointer"
              icon={<WhatsAppIcon size={15} />}
            >
              Consulta por WhatsApp
            </WhatsAppTrigger>
            <LandingLinkButton href={ROUTES.iniciarSession} variant="ghost" className="px-8 py-3.5">
              Acceder al panel
            </LandingLinkButton>
          </div>
        </motion.div>
      </section>
    </>
  );
}
