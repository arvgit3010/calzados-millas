import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  LANDING_HERO_PRODUCT,
  LANDING_HERO_PRODUCT_ALT,
} from "../config/landingAssets";

const appleEase = [0.22, 1, 0.36, 1] as const;
const spring = { stiffness: 140, damping: 22, mass: 0.45 };

export function LandingProductShowcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), spring);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), spring);
  const moveX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-28, 28]), spring);
  const moveY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-18, 18]), spring);
  const backX = useSpring(useTransform(mouseX, [-0.5, 0.5], [14, -14]), spring);
  const backY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), spring);

  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["25%", "75%"]);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotlightX} ${spotlightY}, rgba(201,169,110,0.35) 0%, rgba(168,124,124,0.12) 28%, transparent 62%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="landing-cinematic-stage relative mx-auto aspect-[4/5] w-full max-w-[440px] cursor-crosshair md:max-w-none md:aspect-auto md:h-[min(560px,72vh)]"
      style={{ perspective: 1400 }}
    >
      <div className="landing-cinematic-stage__base pointer-events-none absolute inset-0" />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: spotlight }}
      />
      <div className="landing-cinematic-stage__grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="landing-cinematic-stage__vignette pointer-events-none absolute inset-0" />

      <motion.div
        className="relative flex h-full w-full items-end justify-center pb-6 pt-10 md:pb-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="pointer-events-none absolute bottom-[18%] left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-black/50 blur-2xl"
          style={{ x: moveX, y: moveY, translateZ: -80 }}
          animate={{ opacity: [0.45, 0.65, 0.45], scaleX: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src={LANDING_HERO_PRODUCT_ALT.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.5, duration: 0.8 },
            scale: { delay: 0.5, duration: 1, ease: appleEase },
            y: { delay: 1.2, duration: 5.5, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ x: backX, y: backY, translateZ: -50, rotateZ: -8 }}
          className="landing-product-photo landing-product-photo--back absolute bottom-[8%] right-[6%] z-10 w-[42%] max-w-[200px] md:right-[10%] md:w-[38%]"
        />

        <motion.img
          src={LANDING_HERO_PRODUCT.src}
          alt="Botín Calzados Milas"
          draggable={false}
          initial={{ opacity: 0, y: 40, scale: 0.88 }}
          animate={{ opacity: 1, y: [0, -16, 0], scale: 1 }}
          transition={{
            opacity: { delay: 0.25, duration: 0.9 },
            y: { delay: 0.9, duration: 4.8, repeat: Infinity, ease: "easeInOut" },
            scale: { delay: 0.25, duration: 1, ease: appleEase },
          }}
          style={{ x: moveX, y: moveY, translateZ: 80 }}
          className="landing-product-photo landing-product-photo--hero relative z-20 w-[min(72vw,340px)] md:w-[min(90%,400px)]"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.35em] text-[#c9a96e]/80"
      >
        Mueve el mouse · Vista 3D
      </motion.p>
    </div>
  );
}
