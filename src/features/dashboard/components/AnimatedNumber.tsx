import { useEffect, useState } from "react";
import { animate } from "motion";

type AnimatedNumberProps = {
  value: number;
  /** Formatea el valor animado (ya redondeado). */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
};

/** Cuenta desde 0 hasta `value` con Motion. */
export function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
  duration = 1.15,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const target = Number.isFinite(value) ? value : 0;

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [target, duration]);

  return <span className={className}>{format(display)}</span>;
}
