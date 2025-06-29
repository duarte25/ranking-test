import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export default function Title({ children, className }: TitleProps) {
  return <h1 className={cn("font-bold text-3xl text-gray-button", className)}>{children}</h1>;
}
