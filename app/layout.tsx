import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import PageTransition from "@/components/PageTransition";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Carrière — Devine le joueur",
  description: "Reconnais le joueur à sa carrière. Moins d'indices, plus de points.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F5F5F2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${dmSans.variable} h-dvh`}>
      <body className="min-h-dvh flex flex-col bg-background text-text-primary antialiased overflow-x-hidden">
        <NavBar />
        <main className="flex-1 flex flex-col pb-[calc(48px+env(safe-area-inset-bottom))] md:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
