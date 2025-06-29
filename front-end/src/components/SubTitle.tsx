import { cn } from "@/lib/utils";
import React from "react";

type SubTitleProps = {
  children: React.ReactNode; // Permite qualquer conteúdo válido dentro do subtítulo
  className?: string; // Classes CSS adicionais (opcional)
};

export default function SubTitle({ children, className }: SubTitleProps) {
  return (
    <h2 className={cn("font-semibold text-xl text-green-sixth", className)}>
      {children}
    </h2>
  );
}