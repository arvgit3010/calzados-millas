import Aura from "@primeuix/themes/aura";
import type { PrimeReactProps } from "@primereact/types/core";

export const primeReactConfig: PrimeReactProps = {
  // Community gratis en https://primeui.dev/pricing → VITE_PRIMEREACT_LICENSE
  license: import.meta.env.VITE_PRIMEREACT_LICENSE,
  ripple: true,
  inputVariant: "outlined",
  theme: {
    preset: Aura,
    options: {
      // La app es light; evita que el SO active dark mode en PrimeReact
      darkModeSelector: "none",
      cssLayer: false,
    },
  },
};
