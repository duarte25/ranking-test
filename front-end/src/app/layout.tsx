import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ReactToastContainer from "@/components/ReactToastContainer";

const exo = Exo({
  subsets: ["latin"],
  variable: "--font-exo",
});

export const metadata: Metadata = {
  title: "Ranking Test",
  description: "Ranking Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <ReactQueryProvider>
        <body className={` ${exo.variable} font-[var(--font-exo)] antialiased`}>
          {/* <Toaster /> */}
          <ReactToastContainer />
          {children}
        </body>
      </ReactQueryProvider>
    </html>
  );
}