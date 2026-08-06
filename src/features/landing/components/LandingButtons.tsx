import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type LandingButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";

const variantClass: Record<LandingButtonVariant, string> = {
  primary:
    "milas-btn milas-btn--primary bg-[#2a1e22] text-[#fcf9f7] shadow-[0_8px_28px_rgba(42,30,34,0.22)] hover:bg-[#984258] hover:shadow-[0_12px_32px_rgba(152,66,88,0.28)]",
  secondary:
    "milas-btn milas-btn--secondary border border-[#e8d5d9] bg-white/90 text-[#2a1e22] shadow-[0_4px_20px_rgba(168,124,124,0.12)] hover:border-[#a87c7c] hover:bg-[#fff7f9]",
  ghost:
    "milas-btn milas-btn--ghost border border-[#a87c7c]/45 bg-[#fcf9f7]/60 text-[#2a1e22] backdrop-blur-sm hover:border-[#984258] hover:bg-[#fff0f4]",
  whatsapp:
    "milas-btn milas-btn--whatsapp border border-[#2a1e22]/15 bg-[#fcf9f7] text-[#2a1e22] shadow-[0_4px_18px_rgba(42,30,34,0.08)] hover:border-[#25D366]/35 hover:bg-[#f0faf4]",
};

type BaseProps = {
  variant?: LandingButtonVariant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

type LandingButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type LandingLinkButtonProps = BaseProps & {
  href: string;
  external?: boolean;
};

function joinClass(variant: LandingButtonVariant, className?: string, icon?: boolean) {
  return [variantClass[variant], icon ? "gap-2.5" : "", className ?? ""].filter(Boolean).join(" ");
}

export function LandingButton({
  variant = "primary",
  children,
  className,
  icon,
  ...rest
}: LandingButtonProps) {
  return (
    <button type="button" className={joinClass(variant, className, !!icon)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function LandingLinkButton({
  variant = "primary",
  children,
  className,
  icon,
  href,
  external,
}: LandingLinkButtonProps) {
  const cls = joinClass(variant, className, !!icon);

  if (external || href.startsWith("#") || href.startsWith("http")) {
    return (
      <a
        href={href}
        {...(external || href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={cls}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={cls}>
      {icon}
      {children}
    </Link>
  );
}

export function LandingIconButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`milas-icon-btn border-0 bg-transparent p-0 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
