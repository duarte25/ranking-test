import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerPageContentProps {
  children: ReactNode;
  className?: string;
}

export default function ContainerPageContent({ children, className }: ContainerPageContentProps) {
  return (
    <div className={cn("space-y-4 md:space-y-6 py-2 md:py-4 px-2 md:px-4 lg:px-6", className)}>
      {children}
    </div>
  );
}
