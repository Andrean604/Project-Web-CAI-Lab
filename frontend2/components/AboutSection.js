export default function AboutSection() {
    const facts = [
        { value: "10+", label: "Published Research", sub: "Scientific & Applied" },
        { value: "100%", label: "Collaborative Work", sub: "Faculty & Students" },
        { value: "Open", label: "Prototype Code", sub: "GitHub Repository Access" },
        { value: "Modern", label: "Tech Stack", sub: "AI & Full-Stack Standards" },
    ];

    return (
        <section className="border-t border-[var(--ds-border)]" aria-labelledby="about-lab-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                    <h2
                        id="about-lab-title"
                        className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]"
                    >
                        Center for Smart Technology Research & Commercialization
                    </h2>
                    <p className="ds-prose text-[var(--ds-text-muted)] leading-relaxed">
                        Computing & AI Lab is designed as an innovation hub to develop applied research in Machine
                        Learning, Computer Vision, IoT, and Software Engineering.
                    </p>
                    <p className="ds-prose text-[var(--ds-text-muted)] leading-relaxed">
                        We bridge academic collaboration between faculty innovators and student developers to build
                        deployment-ready software products and prototypes.
                    </p>
                </div>

                <dl className="ds-sheet">
                    {facts.map((fact) => (
                        <div
                            key={fact.label}
                            className="ds-sheet-row [grid-template-columns:11rem_minmax(0,1fr)]"
                        >
                            <dt>{fact.label}</dt>
                            <dd>
                                <span className="tabular-nums">{fact.value}</span>
                                <span className="block text-sm font-normal text-[var(--ds-text-muted)]">
                                    {fact.sub}
                                </span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}