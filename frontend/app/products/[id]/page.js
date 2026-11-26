"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import Gallery from "@/components/Gallery";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, apiUpload, assetUrl } from "@/lib/api";

function isHttpUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

// Panel admin: unggah dan hapus screenshot produk
function ScreenshotManager({ productId, screenshots, setScreenshots }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const files = Array.from(form.elements.screenshots.files);
        if (files.length === 0) return;

        setUploading(true);
        setError("");
        try {
            const body = new FormData();
            files.forEach((file) => body.append("screenshots", file));
            const created = await apiUpload(`/api/products/${productId}/screenshots`, body);
            setScreenshots((prev) => [...prev, ...created]);
            form.reset();
        } catch (err) {
            setError(err.message);
        }
        setUploading(false);
    };

    const handleDelete = async (screenshotId) => {
        if (!window.confirm("Delete this screenshot?")) return;
        try {
            await apiFetch(`/api/products/${productId}/screenshots/${screenshotId}`, { method: "DELETE" });
            setScreenshots((prev) => prev.filter((s) => s.id !== screenshotId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="ds-card p-5 space-y-5" aria-labelledby="manage-screenshots-title">
            <h2 id="manage-screenshots-title" className="text-base font-semibold text-[var(--ds-text)]">
                Manage screenshots
            </h2>

            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1 space-y-1">
                    <label htmlFor="product-screenshots" className="block text-sm text-[var(--ds-text-muted)]">
                        Screenshots (JPG, PNG, or WebP, max 5 MB each, up to 10 at once)
                    </label>
                    <input
                        id="product-screenshots"
                        name="screenshots"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        required
                        className="block w-full text-sm text-[var(--ds-text)] file:mr-3 file:min-h-[44px] file:rounded-[var(--ds-radius-control)] file:border-0 file:bg-[var(--ds-surface-muted)] file:px-4 file:text-sm file:font-medium file:text-[var(--ds-text)]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={uploading}
                    className="ds-press min-h-[44px] px-5 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 disabled:opacity-60 text-white font-semibold text-sm transition"
                >
                    {uploading ? "Uploading…" : "Upload"}
                </button>
            </form>

            {error && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}

            {screenshots.length > 0 && (
                <ul className="divide-y divide-[var(--ds-border)] border-t border-[var(--ds-border)]">
                    {screenshots.map((shot, idx) => (
                        <li key={shot.id} className="flex items-center gap-4 py-3">
                            <img
                                src={assetUrl(shot.url)}
                                alt={`Screenshot ${idx + 1}`}
                                width={96}
                                height={72}
                                loading="lazy"
                                className="w-16 h-12 rounded-lg object-cover bg-[var(--ds-surface-muted)]"
                            />
                            <p className="flex-1 text-sm text-[var(--ds-text-muted)]">Screenshot {idx + 1}</p>
                            <button
                                type="button"
                                onClick={() => handleDelete(shot.id)}
                                aria-label={`Delete screenshot ${idx + 1}`}
                                className="ds-press min-h-[44px] px-3 rounded-[var(--ds-radius-control)] text-sm font-medium text-red-600 dark:text-red-400 hover:bg-[var(--ds-surface-muted)] transition-colors"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function ProductDetailPage() {
    const params = useParams();
    const { isAdmin } = useAuth();
    const [status, setStatus] = useState("loading"); // loading | found | not-found
    const [product, setProduct] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let cancelled = false;
        apiFetch(`/api/products/${params.id}`)
            .then((data) => {
                if (cancelled) return;
                setProduct(data);
                setScreenshots(data.screenshots ?? []);
                setStatus("found");
                document.title = `${data.name} | Computing & AI Lab`;
            })
            .catch((err) => {
                if (cancelled) return;
                setErrorMsg(err.status === 404 ? "" : err.message);
                setStatus("not-found");
            });
        return () => {
            cancelled = true;
        };
    }, [params.id]);

    if (status === "loading") {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <p className="text-sm text-[var(--ds-text-muted)]">Loading…</p>
            </div>
        );
    }

    if (status === "not-found") {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
                <h1 className="ds-heading text-3xl font-bold text-[var(--ds-text)]">Product not found</h1>
                <p className="text-[var(--ds-text-muted)]">{errorMsg || "This product does not exist."}</p>
                <Link
                    href="/products"
                    className="inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4"
                >
                    Back to Products
                </Link>
            </div>
        );
    }

    const lecturers = product.creators?.lecturers ?? [];
    const students = product.creators?.students ?? [];
    const techStack = product.techStack ?? [];
    const features = product.features ?? [];
    const longDescription = product.longDescription || product.shortDescription;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-10">
            {/* Header */}
            <header className="space-y-6">
                <Link
                    href="/products"
                    className="ds-press inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-[var(--ds-accent)] group"
                >
                    <svg
                        aria-hidden="true"
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

                    {(isHttpUrl(product.demoUrl) || isHttpUrl(product.githubUrl)) && (
                        <div className="flex flex-wrap gap-3 shrink-0">
                            {isHttpUrl(product.demoUrl) && (
                                <a
                                    href={product.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ds-press inline-flex items-center justify-center min-h-[44px] px-5 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 text-white font-semibold text-sm transition"
                                >
                                    Live Demo
                                </a>
                            )}
                            {isHttpUrl(product.githubUrl) && (
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

            {/* Video (hanya kalau ada) */}
            {isHttpUrl(product.videoUrl) && (
                <div className="rounded-2xl overflow-hidden border border-[var(--ds-border)]">
                    <VideoPlaceholder videoUrl={product.videoUrl} title={product.name} />
                </div>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
                <section className="space-y-4" aria-labelledby="screenshots-title">
                    <h2 id="screenshots-title" className="ds-section-title">
                        Screenshots
                    </h2>
                    <Gallery images={screenshots.map((s) => assetUrl(s.url))} label="Screenshot" />
                </section>
            )}

            {isAdmin && (
                <ScreenshotManager productId={product.id} screenshots={screenshots} setScreenshots={setScreenshots} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
                {/* Konten utama */}
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
                                        <svg
                                            aria-hidden="true"
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
    );
}
