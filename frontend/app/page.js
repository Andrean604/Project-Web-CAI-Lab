import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CompetitionPreview from "@/components/CompetitionPreview";
import LabGallery from "@/components/LabGallery";
import ProductCard from "@/components/ProductCard";
import { dummyProducts } from "@/data/dummyProducts";
import Link from "next/link";

export default function Home() {
  const featuredProducts = dummyProducts.slice(0, 3);
  // Hero menampilkan produk yang punya screenshot; kalau belum ada, produk pertama
  const heroProduct = dummyProducts.find((p) => p.screenshots?.length) ?? dummyProducts[0];

  return (
    <>
      {/* 1. Hero: hasil kerja ditampilkan lebih dulu */}
      <Hero featured={heroProduct} />

      {/* 2. Produk unggulan */}
      <section className="border-t border-[var(--ds-border)]" aria-labelledby="featured-products-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              id="featured-products-title"
              className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]"
            >
              Featured Innovation Projects
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4 self-start sm:self-auto"
            >
              View Full Catalog ({dummyProducts.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Prestasi lomba */}
      <CompetitionPreview />

      {/* 4. Foto kondisi lab */}
      <LabGallery />

      {/* 5. Tentang lab */}
      <AboutSection />
    </>
  );
}