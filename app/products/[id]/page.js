import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyProducts } from "@/data/dummyProducts";
import VideoPlaceholder from "@/components/VideoPlaceholder";

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
    const longDescription =
        product.longDescription ?? product.description ?? product.shortDescription;

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* HERO BAND */}
            <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
                <div
                    className="absolute inset-0 -z-10 pointer-events-none dark:hidden"
                    style={{
                        background:
                            "radial-gradient(circle at top, rgba(199, 210, 254, 0.6) 0%, rgba(248, 250, 252, 0) 65%)",
                    }}
                />
                <div
                    className="absolute inset-0 -z-10 pointer-events-none hidden dark:block"
                    style={{
                        background:
                            "radial-gradient(circle at top, rgba(30, 41, 59, 1) 0%, rgba(2, 6, 23, 1) 65%)",
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-10 sm:pb-14 space-y-6">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors group"
                    >
                        <svg
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
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-1">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                                    {product.category}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                        Live Demo
                                    </a>
                                )}
                                {product.githubUrl && (
                                    <a
                                        href={product.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.478 5.92.43.372.823 1.102.823 2.222 0 1.604-.014 2.896-.014 3.29 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        Source Code
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* Video / Demo */}
                <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5 dark:shadow-black/30 mb-12">
                    <VideoPlaceholder videoUrl={product.videoUrl} title={product.name} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                    About This Project
                                </h2>
                            </div>
                            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                {longDescription}
                            </p>
                        </div>

                        {features.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                        Key Features
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-cyan-500/30 transition-colors"
                                        >
                                            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {techStack.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                        Tech Stack
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {techStack.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-cyan-500/40 transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
                            <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1a4 4 0 100-8 4 4 0 000 8zm6 3a4 4 0 00-3-3.87M9 12a4 4 0 100-8 4 4 0 000 8z" />
                                </svg>
                                Project Team
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                                        F
                                    </span>
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            Faculty Advisor
                                        </span>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {lecturers.length > 0 ? lecturers.join(", ") : "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-xs">
                                        S
                                    </span>
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            Student Developer
                                        </span>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {students.length > 0 ? students.join(", ") : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
                            <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Get in Touch
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Interested in this project? Reach out to the lab for collaboration or licensing inquiries.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors group"
                            >
                                <span>Contact the Lab</span>
                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}