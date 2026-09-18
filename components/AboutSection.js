export default function AboutSection() {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Teks Penjelas Kiri */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                            ABOUT COMPUTING & AI LAB
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Center for Smart Technology Research & Commercialization
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Computing & AI Lab is designed as an innovation hub to develop applied research in Machine Learning, Computer Vision, IoT, and Software Engineering.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            We bridge academic collaboration between faculty innovators and student developers to build deployment-ready software products and prototypes.
                        </p>
                    </div>

                    {/* Grid Stat Cards Kanan */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { value: "10+", label: "Published Research", sub: "Scientific & Applied" },
                            { value: "100%", label: "Collaborative Work", sub: "Faculty & Students" },
                            { value: "Open", label: "Prototype Code", sub: "GitHub Repository Access" },
                            { value: "Modern", label: "Tech Stack", sub: "AI & Full-Stack Standards" },
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/30 dark:hover:border-cyan-500/30 transition-all"
                            >
                                <div className="text-2xl font-extrabold text-indigo-600 dark:text-cyan-400">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                                    {stat.label}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    {stat.sub}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}