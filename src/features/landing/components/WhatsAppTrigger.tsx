import type { ButtonHTMLAttributes, ReactNode } from "react";

type WhatsAppTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  whatsappUrl: string;
  onTrigger: (url: string) => void;
  children: ReactNode;
  icon?: ReactNode;
};

export function WhatsAppTrigger({
  whatsappUrl,
  onTrigger,
  children,
  icon,
  className = "",
  type = "button",
  ...rest
}: WhatsAppTriggerProps) {
  return (
    <button
      type={type}
      className={className}
      onClick={() => onTrigger(whatsappUrl)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
