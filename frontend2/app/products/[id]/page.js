import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyProducts } from "@/data/dummyProducts";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import Gallery from "@/components/gallery";

export function generateStaticParams() {
    return dummyProducts.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = dummyProducts.find((p) => String(p.id) === id);
    if (!product) return { title: "Product Not Found | Computing & AI Lab" };
    return {
        title: `${product.name} | Computing & AI Lab`,
        description: product.shortDescription,
    };
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    const product = dummyProducts.find((p) => String(p.id) === id);

    if (!product) {
        notFound();
    }

    const lecturers = product.creators?.lecturers ?? [];
    const students = product.creators?.students ?? [];
    const techStack = product.techStack ?? product.tech ?? [];
    const features = product.features ?? [];
    const screenshots = product.screenshots ?? [];
    const longDescription =
        product.longDescription ?? product.description ?? product.shortDescription;

    return (
        <div className="bg-[var(--ds-bg)] min-h-screen transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-10">
                {/* Header */}
                <header className="space-y-6">
                    <Link
                        href="/products"
                        className="ds-press inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-[var(--ds-accent)] group"
                    >
                        <svg aria-hidden="true"
                            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Products</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="space-y-4 max-w-3xl">
                            <h1 className="ds-heading text-3xl sm:text-5xl font-bold text-[var(--ds-text)]">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--ds-border)] text-[var(--ds-text-muted)]">
                                    {product.category}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--ds-border)] text-[var(--ds-text-muted)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)]" />
                                    Prototype
                                </span>
                            </div>
                        </div>

                        {(product.demoUrl || product.githubUrl) && (
                            <div className="flex flex-wrap gap-3 shrink-0">
                                {product.demoUrl && (
                                    <a
                                        href={product.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ds-press inline-flex items-center justify-center min-h-[44px] px-5 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 text-white font-semibold text-sm transition"
                                    >
                                        Live Demo
                                    </a>
                                )}
                                {product.githubUrl && (
                                    <a
                                        href={product.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ds-press inline-flex items-center justify-center min-h-[44px] px-5 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] font-semibold text-sm transition-colors"
                                    >
                                        Source Code
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Video */}
                <div className="rounded-2xl overflow-hidden border border-[var(--ds-border)]">
                    <VideoPlaceholder videoUrl={product.videoUrl} title={product.name} />
                </div>

                {/* Screenshots */}
                {screenshots.length > 0 && (
                    <section className="space-y-4" aria-labelledby="screenshots-title">
                        <h2 id="screenshots-title" className="ds-section-title">
                            Screenshots
                        </h2>
                        <Gallery images={screenshots} label="Screenshot" />
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="space-y-3">
                            <h2 className="ds-section-title">About this project</h2>
                            <p className="ds-prose text-base text-[var(--ds-text-muted)] leading-relaxed whitespace-pre-line">
                                {longDescription}
                            </p>
                        </section>

                        {features.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="ds-section-title">Key features</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[var(--ds-text)]">
                                            <svg aria-hidden="true"
                                                className="w-4 h-4 mt-1 flex-shrink-0 text-[var(--ds-accent)]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-[15px] leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:sticky lg:top-24 lg:self-start space-y-8">
                        <section className="space-y-3">
                            <h2 className="ds-section-title">Specifications</h2>
                            <dl className="ds-sheet">
                                <div className="ds-sheet-row">
                                    <dt>Category</dt>
                                    <dd>{product.category}</dd>
                                </div>
                                <div className="ds-sheet-row">
                                    <dt>Status</dt>
                                    <dd>Prototype</dd>
                                </div>
                                {techStack.length > 0 && (
                                    <div className="ds-sheet-row">
                                        <dt>Tech stack</dt>
                                        <dd>{techStack.join(", ")}</dd>
                                    </div>
                                )}
                                <div className="ds-sheet-row">
                                    <dt>Faculty</dt>
                                    <dd>{lecturers.length > 0 ? lecturers.join(", ") : "Not specified"}</dd>
                                </div>
                                <div className="ds-sheet-row">
                                    <dt>Students</dt>
                                    <dd>{students.length > 0 ? students.join(", ") : "Not specified"}</dd>
                                </div>
                            </dl>
                        </section>

                        <section className="space-y-2">
                            <h2 className="text-base font-semibold text-[var(--ds-text)]">Get in touch</h2>
                            <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed">
                                Interested in this project? Reach out to the lab for collaboration or licensing inquiries.
                            </p>
                            <Link
                                href="/about"
                                className="ds-press inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4"
                            >
                                Contact the lab
                            </Link>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}