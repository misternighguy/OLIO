import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OLIO — OIL Drilling",
  description: "A Solana-native oil mining grid game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div
          aria-hidden
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/bg_refinery.png)",
            filter: "saturate(0.75)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,168,83,0.08),transparent)]"
        />
        <div className="relative z-10 flex min-h-screen flex-1 flex-col min-h-0">
          <Header />
          <main className="flex min-h-0 flex-1 flex-col overflow-auto transition-opacity duration-300 ease-out">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
