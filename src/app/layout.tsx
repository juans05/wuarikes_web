import type { Metadata } from "next";
import { Outfit, Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggleMount } from "@/components/common/ThemeToggleMount";
import { BottomNav } from "@/layouts/BottomNav";
import { Navbar } from "@/layouts/Navbar";
import { Footer } from "@/layouts/Footer";
import { AuthModal } from "@/features/auth/AuthModal";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Wuarikes — Descubre los mejores restaurantes del Perú",
    template: "%s | Wuarikes",
  },
  description:
    "Descubre restaurantes, cafeterías y bares en Perú. Reseñas, mapas, menús digitales y promociones en un solo lugar.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Wuarikes",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${outfit.variable} ${workSans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <ThemeToggleMount />
          <BottomNav />
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
