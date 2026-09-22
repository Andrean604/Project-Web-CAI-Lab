import Link from "next/link";

export default function AboutPage() {
    const researchPillars = [
        {
            icon: "🤖",
            title: "Artificial Intelligence & ML",
            description: "Research on Deep Learning modeling, Natural Language Processing (NLP), and large-scale data-driven predictive systems.",
        },
        {
            icon: "👁️",
            title: "Computer Vision",
            description: "Development of automated visual inspection systems, real-time object detection, and medical/industrial image processing.",
        },
        {
            icon: "⚡",
            title: "Software & Web Engineering",
            description: "Building modern, scalable web architectures integrated with APIs, powered by Next.js & React.",
        },
        {
            icon: "🌐",
            title: "IoT & Embedded Systems",
            description: "Integration of physical sensors with edge computing and distributed analytical dashboards.",
        },
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                        ABOUT THE LABORATORY
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Computing & AI Laboratory
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                        A center of academic excellence bridging artificial intelligence research, software engineering, and technology competitions at national and international levels.
                    </p>
                </div>

                {/* Vision & Core Role Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Vision & Core Role
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            We are committed to providing a research-conducive environment for students to experiment, build real digital products, and actively participate in hackathons and scientific publications.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/competitions"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                            >
                                View Track Record of Achievements &rarr;
                            </Link>
                        </div>
                    </div>

                    <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                        <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                            Core Strengths
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-600 dark:text-cyan-400 font-bold">•</span>
                                <span>Continuous mentoring by faculty advisors & industry practitioners</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-600 dark:text-cyan-400 font-bold">•</span>
                                <span>High-performance GPU Servers & Workstation facilities</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-indigo-600 dark:text-cyan-400 font-bold">•</span>
                                <span>Opportunities for research collaboration & project funding</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Research Pillars Grid */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Research & Development Focus
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
                            Key domains developed by laboratory team members and student researchers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {researchPillars.map((pillar, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-3"
                            >
                                <div className="text-3xl">{pillar.icon}</div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    {pillar.title}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {pillar.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call-to-Action Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-2xl p-8 text-center space-y-4 shadow-lg shadow-indigo-500/10">
                    <h2 className="text-2xl font-bold">Interested in Collaborating or Joining?</h2>
                    <p className="text-xs sm:text-sm max-w-2xl mx-auto text-indigo-50">
                        We are always open to research collaborations, software development projects, and student participation in competition teams.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/products"
                            className="inline-block px-6 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors"
                        >
                            Explore Lab Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}