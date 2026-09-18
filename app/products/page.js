"use client";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { dummyProducts } from "@/data/dummyProducts";

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "Artificial Intelligence",
        "Web Development",
        "Computer Vision",
        "IoT & Smart City",
    ];

    // Safe filtering logic protected against undefined or missing fields
    const filteredProducts = (dummyProducts || []).filter((product) => {
        if (!product) return false;

        const productTitle = product.title?.toLowerCase() || "";
        const productDesc = product.description?.toLowerCase() || "";
        const productCategory = product.category?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();

        const matchesCategory =
            selectedCategory === "All" ||
            productCategory === selectedCategory.toLowerCase();

        const matchesSearch =
            productTitle.includes(query) ||
            productDesc.includes(query) ||
            productCategory.includes(query);

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="relative min-h-screen py-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
            {/* Soft Ambient Glow for Dark Mode */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none -z-10 dark:block hidden" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                            INNOVATION CATALOG
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Products & Research Projects
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
                            Explore all products, software solutions, and research prototypes built by the Computing & AI Lab.
                        </p>
                    </div>

                    {/* Product Counter Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 self-start md:self-auto">
                        <span>Total Products:</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 font-bold border border-indigo-100 dark:border-indigo-900/50">
                            {filteredProducts.length} / {dummyProducts?.length || 0}
                        </span>
                    </div>
                </div>

                {/* Search Bar & Category Filter Pills */}
                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by project title, description, or tech stack..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 shadow-sm transition-all"
                            />
                            <svg
                                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${isActive
                                            ? "bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm shadow-indigo-500/20 font-bold"
                                            : "bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <ProductCard key={product.id || index} product={product} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
                        <div className="text-4xl">🔍</div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            No Products Found
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            {`No products matched your search for "${searchQuery}". Try using different keywords or selecting another category.`}
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                            }}
                            className="mt-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}