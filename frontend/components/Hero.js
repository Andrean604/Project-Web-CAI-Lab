import Link from "next/link";
import { assetUrl } from "@/lib/api";

export default function Hero({ featured }) {
    const cover = featured?.screenshots?.[0]?.url;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
                {/* Teks */}
                <div className="ds-enter space-y-6">
                    <h1 className="ds-heading text-4xl sm:text-6xl font-bold text-[var(--ds-text)]">
                        Computing & Artificial Intelligence
                    </h1>

                    <p className="ds-prose text-lg text-[var(--ds-text-muted)] leading-relaxed">
                        A catalog of tech products, intelligent systems, and applied research developed through
                        collaboration between Faculty and Students at the Computing & AI Lab.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link
                            href="/products"
                            className="ds-press inline-flex items-center justify-center min-h-[44px] px-6 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 text-white font-semibold text-sm transition"
                        >
                            View Product Catalog
                        </Link>
                        <Link
                            href="/about"
                            className="ds-press inline-flex items-center justify-center min-h-[44px] px-6 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] font-semibold text-sm transition-colors"
                        >
                            About the Lab
                        </Link>
                    </div>
                </div>

                {/* Hasil kerja nyata: screenshot produk, atau lembar spesifikasi kalau belum ada gambar */}
                {featured && (
                    <div className="ds-enter" style={{ animationDelay: "100ms" }}>
                        <Link
                            href={`/products/${featured.id}`}
                            className="ds-link-card group block space-y-3"
                        >
                            {cover ? (
                                <div className="aspect-video overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface-muted)]">
                                    <img
                                        src={assetUrl(cover)}
                                        alt={`${featured.name} screenshot`}
                                        width={1280}
                                        height={720}
                                        fetchPriority="high"
                                        className="ds-zoom w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <dl className="ds-sheet">
                                    <div className="ds-sheet-row">
                                        <dt>Product</dt>
                                        <dd>{featured.name}</dd>
                                    </div>
                                    <div className="ds-sheet-row">
                                        <dt>Category</dt>
                                        <dd>{featured.category}</dd>
                                    </div>
                                    <div className="ds-sheet-row">
                                        <dt>Status</dt>
                                        <dd>Prototype</dd>
                                    </div>
                                    <div className="ds-sheet-row">
                                        <dt>Faculty</dt>
                                        <dd>{featured.creators?.lecturers?.join(", ") || "Not specified"}</dd>
                                    </div>
                                </dl>
                            )}
                            {cover ? (
                                <p className="text-sm text-[var(--ds-text-muted)]">
                                    <span className="ds-link-title font-medium text-[var(--ds-text)]">
                                        {featured.name}
                                    </span>{" "}
                                    <span>{featured.category}</span>
                                </p>
                            ) : (
                                <p className="ds-link-title text-sm font-medium text-[var(--ds-accent)]">
                                    View product details
                                </p>
                            )}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
