import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CompetitionPreview from "@/components/CompetitionPreview";
import ProductCard from "@/components/ProductCard";
import { dummyProducts } from "@/data/dummyProducts";
import Link from "next/link";

export default function Home() {
  const featuredProducts = dummyProducts.slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Section */}
      <AboutSection />

      {/* 3. Competition Showcase Preview */}
      <CompetitionPreview />

      {/* ===== ELEMEN PEMBATAS ELEGAN (SECTION DIVIDER) ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="relative flex items-center justify-center">
          {/* Garis Gradient Halus */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent" />

          {/* Aksesori Titik Aksen di Tengah */}
          <div className="absolute bg-slate-50 dark:bg-slate-950 px-4 flex items-center gap-1.5 text-slate-400 dark:text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 dark:bg-cyan-500/40"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 dark:bg-cyan-500/40"></span>
          </div>
        </div>
      </div>
      {/* ==================================================== */}

      {/* 4. Featured Products Preview */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                PRODUCT SHOWCASE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                Featured Innovation Projects
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors self-start sm:self-auto group"
            >
              <span>View Full Catalog ({dummyProducts.length})</span>
              <span className="transform group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}