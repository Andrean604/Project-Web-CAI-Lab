import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Radial Gradient Tengah (Mode Siang: Indigo Terang, Mode Malam: Slate/Dark Gelap) */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none transition-all duration-300 dark:hidden"
                style={{
                    background: "radial-gradient(circle at center, rgba(199, 210, 254, 0.7) 0%, rgba(248, 250, 252, 0) 70%)"
                }}
            />
            <div
                className="absolute inset-0 -z-10 pointer-events-none transition-all duration-300 hidden dark:block"
                style={{
                    background: "radial-gradient(circle at center, rgba(30, 41, 59, 1) 0%, rgba(2, 6, 23, 1) 70%)"
                }}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                        Academic Product & Research Showcase
                    </span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-1">
                    Computing & Artificial Intelligence
                </h1>

                {/* Description */}
                <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    A catalog of tech products, intelligent systems, and applied research developed through collaboration between Faculty and Students at the Computing & AI Lab.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <Link
                        href="/products"
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all"
                    >
                        View Product Catalog
                    </Link>
                    <Link
                        href="/about"
                        className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors"
                    >
                        About the Lab
                    </Link>
                </div>
            </div>
        </section>
    );
}