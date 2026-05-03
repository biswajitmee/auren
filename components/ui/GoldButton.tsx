import { ChevronRight } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type GoldButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GoldButton({ children, className, ...props }: GoldButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring group inline-flex items-center gap-3 border border-gold/45 bg-gold/10 px-5 py-3 text-xs uppercase text-gold transition hover:border-gold hover:bg-gold hover:text-obsidian",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </button>
  );
}
