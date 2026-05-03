import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type MicroLabelProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function MicroLabel({ children, className, ...props }: MicroLabelProps) {
  return (
    <p
      className={cn("font-mono text-[0.68rem] uppercase text-gold/72", className)}
      {...props}
    >
      {children}
    </p>
  );
}
