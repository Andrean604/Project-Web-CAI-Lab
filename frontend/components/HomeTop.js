"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";

// Bagian atas Home: hero dan produk unggulan, datanya dari backend
export default function HomeTop() {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        apiFetch("/api/products")
            .then((data) => {
                if (!cancelled) setProducts(data);
            })
            .catch(() => {
                if (!cancelled) setProducts([]);
            })
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const featuredProducts = products.slice(0, 3);
    // Hero menampilkan produk yang punya screenshot; kalau belum ada, produk pertama
    const heroProduct = products.find((p) => p.screenshots?.length) ?? products[0];

    return (
        <>
            <Hero featured={heroProduct} />

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
                            View Full Catalog ({products.length})
                        </Link>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--ds-text-muted)]">
                            {loaded ? "No products yet." : "Loading…"}
                        </p>
                    )}
                </div>
            </section>
        </>
    );
}
