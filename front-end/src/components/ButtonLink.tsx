"use client";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

// Definindo os tipos permitidos para variant e size
type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonLinkProps {
  href?: string;
  children: ReactNode;
  showIcon?: boolean;
  className?: string;
  variant?: ButtonVariant; // Restringindo ao tipo ButtonVariant
  size?: ButtonSize; // Restringindo ao tipo ButtonSize
  [key: string]: unknown; // Para pegar o restante das props
}

export default function ButtonLink({
  href,
  children,
  showIcon = false,
  className,
  variant = "default", // Valor padrão
  size = "default", // Valor padrão
  ...props
}: ButtonLinkProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), "flex gap-1 bg-green-fourth", className)}
        {...props}
        replace={true}
      >
        {showIcon && <ArrowLeft className="w-4 h-4" />}
        {children}
      </Link>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => router.back()}
      size={size}
      className={cn("flex gap-1", className)}
      {...props}
    >
      {showIcon && <ArrowLeft className="w-4 h-4" />}
      {children}
    </Button>
  );
}