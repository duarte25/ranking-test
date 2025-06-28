import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ReactToastContainer from "@/components/ReactToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* <Toaster /> */}
          <ReactToastContainer/>
          {children}
        </body>
      </ReactQueryProvider>
    </html>
  );
}