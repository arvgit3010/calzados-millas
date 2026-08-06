import { motion } from "motion/react";
import { LANDING_HERO_PRODUCT } from "../config/landingAssets";
import { WhatsAppIcon } from "./SocialIcons";

type WhatsAppTransitionProps = {
  active: boolean;
  durationMs?: number;
};

const appleEase = [0.22, 1, 0.36, 1] as const;

export function WhatsAppTransition({ active, durationMs = 2600 }: WhatsAppTransitionProps) {
  return (
    <motion.div
      initial={false}
      animate={active ? "open" : "closed"}
      variants={{
        closed: { pointerEvents: "none" as const },
        open: { pointerEvents: "auto" as const },
      }}
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-hidden={!active}
      aria-label="Conectando con WhatsApp"
    >
      <motion.div
        variants={{
          closed: { opacity: 0 },
          open: { opacity: 1 },
        }}
        transition={{ duration: 0.45, ease: appleEase }}
        className="absolute inset-0 bg-[#fcf9f7]/95 backdrop-blur-2xl"
      />

      <motion.div
        variants={{
          closed: { opacity: 0, scale: 0.94, y: 24 },
          open: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.65, ease: appleEase }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
      >
        <motion.div
          variants={{
            closed: { opacity: 0, y: 40 },
            open: { opacity: 1, y: [0, -12, 0] },
          }}
          transition={{
            opacity: { duration: 0.6 },
            y: { delay: 0.4, duration: 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="landing-product-stage-mini relative mx-auto w-[min(70vw,280px)] px-6 py-8"
        >
          <img
            src={LANDING_HERO_PRODUCT.src}
            alt=""
            className="landing-product-photo landing-product-photo--hero mx-auto w-full"
            draggable={false}
          />
        </motion.div>

        <motion.p
          variants={{
            closed: { opacity: 0, y: 12 },
            open: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.25, duration: 0.6, ease: appleEase }}
          className="mt-10 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a87c7c]"
        >
          Un paso más
        </motion.p>

        <motion.h2
          variants={{
            closed: { opacity: 0, y: 16 },
            open: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.4, duration: 0.7, ease: appleEase }}
          className="mt-3 font-display text-3xl text-[#2a1e22] md:text-4xl"
        >
          Te llevamos a <i>WhatsApp</i>
        </motion.h2>

        <motion.p
          variants={{
            closed: { opacity: 0 },
            open: { opacity: 1 },
          }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-[#867275]"
        >
          Ponte cómodo. En un momento estarás hablando con Calzados Milas.
        </motion.p>

        <motion.div
          variants={{
            closed: { opacity: 0, scale: 0.9 },
            open: { opacity: 1, scale: 1 },
          }}
          transition={{ delay: 0.75, duration: 0.5, ease: appleEase }}
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#e8d5d9] bg-white px-5 py-2.5 shadow-[0_8px_24px_rgba(168,124,124,0.12)]"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
            <WhatsAppIcon size={16} />
          </span>
          <span className="text-xs font-medium text-[#2a1e22]">Abriendo chat…</span>
        </motion.div>

        <div className="mt-10 h-[2px] w-48 overflow-hidden rounded-full bg-[#f1e4e8]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#a87c7c] to-[#25D366]"
            variants={{
              closed: { width: "0%" },
              open: { width: "100%" },
            }}
            transition={{ delay: 0.15, duration: durationMs / 1000 - 0.25, ease: appleEase }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
