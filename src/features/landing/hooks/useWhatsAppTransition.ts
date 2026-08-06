import { useCallback, useEffect, useRef, useState } from "react";

const TRANSITION_MS = 2600;

export function useWhatsAppTransition() {
  const [isActive, setIsActive] = useState(false);
  const pendingUrl = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const triggerWhatsApp = useCallback(
    (url: string) => {
      if (isActive) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      clearTimer();
      pendingUrl.current = url;
      setIsActive(true);

      timerRef.current = setTimeout(() => {
        if (pendingUrl.current) {
          window.open(pendingUrl.current, "_blank", "noopener,noreferrer");
        }
        pendingUrl.current = null;
        setIsActive(false);
        timerRef.current = null;
      }, TRANSITION_MS);
    },
    [clearTimer, isActive],
  );

  useEffect(() => clearTimer, [clearTimer]);

  return { isActive, triggerWhatsApp, transitionMs: TRANSITION_MS };
}
