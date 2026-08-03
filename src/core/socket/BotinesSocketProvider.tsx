import { useEffect, type ReactNode } from "react";
import { botinesSocket } from "./botinesSocket";

export function BotinesSocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    botinesSocket.connect();

    return () => {
      botinesSocket.disconnect();
    };
  }, []);

  return children;
}
