import Link from "next/link";

export default function AboutPage() {
    // Ikon garis (SVG) menggantikan emoji
    const researchPillars = [
        {
            icon: "M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10v10H7V7z",
            title: "Artificial Intelligence & ML",
            description:
                "Research on Deep Learning modeling, Natural Language Processing (NLP), and large-scale data-driven predictive systems.",
        },
        {
            icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
            title: "Computer Vision",
            description:
                "Development of automated visual inspection systems, real-time object detection, and medical/industrial image processing.",
        },
        {
            icon: "M8 9l-4 3 4 3m8-6l4 3-4 3M14 5l-4 14",
            title: "Software & Web Engineering",
            description:
                "Building modern, scalable web architectures integrated with APIs, powered by Next.js & React.",
        },
        {
            icon: "M5 12.55a11 11 0 0114 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01",
            title: "IoT & Embedded Systems",
            description:
                "Integration of physical sensors with edge computing and distributed analytical dashboards.",
        },
    ];

    const coreStrengths = [
        "Continuous mentoring by faculty advisors & industry practitioners",
        "High-performance GPU Servers & Workstation facilities",
        "Opportunities for research collaboration & project funding",
    ];

    const container = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

    return (
        <div>
            {/* Kepala halaman */}
            <header className={`${container} pt-10 pb-14 space-y-4`}>
                <h1 className="ds-heading text-3xl sm:text-5xl font-bold text-[var(--ds-text)]">
                    Computing & AI Laboratory
                </h1>
                <p className="ds-prose text-lg text-[var(--ds-text-muted)] leading-relaxed">
                    A center of academic excellence bridging artificial intelligence research, software engineering,
                    and technology competitions at national and international levels.
                </p>
            </header>

            {/* Visi dan peran utama */}
            <section className="border-t border-[var(--ds-border)]" aria-labelledby="vision-title">
                <div className={`${container} py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start`}>
                    <div className="space-y-4">
                        <h2 id="vision-title" className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]">
                            Vision & Core Role
                        </h2>
                        <p className="ds-prose text-[var(--ds-text-muted)] leading-relaxed">
                            We are committed to providing a research-conducive environment for students to experiment,
                            build real digital products, and actively participate in hackathons and scientific
                            publications.
                        </p>
                        <Link
                            href="/competitions"
                            className="inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4"
                        >
                            View Track Record of Achievements
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--ds-text)]">Core strengths</h3>
                        <ul className="space-y-3">
                            {coreStrengths.map((strength) => (
                                <li key={strength} className="flex items-start gap-3 text-[var(--ds-text)]">
                                    <svg
                                        aria-hidden="true"
                                        className="w-4 h-4 mt-1 flex-shrink-0 text-[var(--ds-accent)]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="leading-relaxed">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Fokus riset */}
            <section className="border-t border-[var(--ds-border)]" aria-labelledby="focus-title">
                <div className={`${container} py-14 space-y-10`}>
                    <div className="space-y-2">
                        <h2 id="focus-title" className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]">
                            Research & Development Focus
                        </h2>
                        <p className="ds-prose text-[var(--ds-text-muted)]">
                            Key domains developed by laboratory team members and student researchers.
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {researchPillars.map((pillar) => (
                            <li key={pillar.title} className="flex gap-4 border-t border-[var(--ds-border)] pt-6">
                                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--ds-surface-muted)] flex items-center justify-center text-[var(--ds-accent)]">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={pillar.icon} />
                                    </svg>
                                </span>
                                <div className="space-y-1.5">
                                    <h3 className="text-lg font-semibold text-[var(--ds-text)]">{pillar.title}</h3>
                                    <p className="ds-prose text-[var(--ds-text-muted)] leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Ajakan berkolaborasi */}
            <section className="border-t border-[var(--ds-border)]" aria-labelledby="collaborate-title">
                <div className={`${container} py-14 space-y-4`}>
                    <h2 id="collaborate-title" className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]">
                        Interested in Collaborating or Joining?
                    </h2>
                    <p className="ds-prose text-[var(--ds-text-muted)] leading-relaxed">
                        We are always open to research collaborations, software development projects, and student
                        participation in competition teams.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/products"
                            className="ds-press inline-flex items-center justify-center min-h-[44px] px-6 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 text-white font-semibold text-sm transition"
                        >
                            Explore Lab Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}