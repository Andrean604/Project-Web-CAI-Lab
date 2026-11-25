import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "Computing & AI Lab | Product Catalog",
  description: "Innovation Platform & Project Showcase for Computing & AI Lab Faculty and Students",
};

// Warna bilah browser mengikuti latar halaman (mengikuti pengaturan sistem)
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-[var(--ds-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main" tabIndex={-1} className="flex-grow focus:outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}