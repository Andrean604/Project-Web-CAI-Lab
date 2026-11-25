"use client";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { dummyProducts } from "@/data/dummyProducts";

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const products = (dummyProducts || []).filter(Boolean);

    // Kategori diambil dari data produk, jadi selalu cocok dengan isi katalog
    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

    const query = searchQuery.trim().toLowerCase();

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

        const haystack = [
            product.name,
            product.title,
            product.shortDescription,
            product.description,
            product.category,
            ...(product.techStack ?? []),
            ...(product.creators?.lecturers ?? []),
            ...(product.creators?.students ?? []),
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return matchesCategory && (!query || haystack.includes(query));
    });

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-8">
            {/* Kepala halaman */}
            <header className="space-y-2">
                <h1 className="ds-heading text-3xl sm:text-4xl font-bold text-[var(--ds-text)]">
                    Products & Research Projects
                </h1>
                <p className="ds-prose text-[var(--ds-text-muted)]">
                    Explore all products, software solutions, and research prototypes built by the Computing & AI Lab.
                </p>
            </header>

            {/* Pencarian dan filter */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full max-w-md">
                        <label htmlFor="product-search" className="sr-only">
                            Search products
                        </label>
                        <svg
                            aria-hidden="true"
                            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="product-search"
                            name="q"
                            type="search"
                            autoComplete="off"
                            placeholder="Search by project title, description, or tech stack…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full min-h-[44px] pl-10 pr-4 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] text-sm"
                        />
                    </div>
                    <p className="text-sm text-[var(--ds-text-muted)] tabular-nums" aria-live="polite">
                        {filteredProducts.length} of {products.length}
                    </p>
                </div>

                <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
                    {categories.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                            <button
                                key={category}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => setSelectedCategory(category)}
                                className={`ds-press min-h-[44px] px-4 rounded-full text-sm font-medium transition-colors ${isActive
                                    ? "bg-[var(--ds-primary)] text-white"
                                    : "border border-[var(--ds-border)] text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] hover:text-[var(--ds-text)]"
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Daftar produk */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    ))}
                </div>
            ) : (
                <div className="ds-card p-10 text-center space-y-3">
                    <h2 className="text-lg font-semibold text-[var(--ds-text)]">No products found</h2>
                    <p className="ds-prose mx-auto text-[var(--ds-text-muted)]">
                        {query
                            ? `No products matched "${searchQuery.trim()}". Try different keywords or another category.`
                            : "No products in this category yet."}
                    </p>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="ds-press min-h-[44px] px-4 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-sm font-medium text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] transition-colors"
                    >
                        Reset filters
                    </button>
                </div>
            )}
        </div>
    );
}