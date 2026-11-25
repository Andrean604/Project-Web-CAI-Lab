"use client";
import { useEffect, useRef, useState } from "react";

// Galeri gambar dengan tampilan besar (lightbox) memakai <dialog> bawaan browser:
// focus trap, tombol Esc, dan pengembalian fokus ditangani browser.
// layout="grid"   : kotak-kotak (produk, foto lab)
// layout="scroll" : satu baris yang bisa digeser ke kanan saat tidak muat (foto lomba)
export default function Gallery({
    images = [],
    captions = [],
    label = "Gallery",
    layout = "grid",
    showCaptions = false,
}) {
    const [active, setActive] = useState(null); // indeks gambar yang dibuka, atau null
    const [edge, setEdge] = useState({ left: false, right: false });
    const dialogRef = useRef(null);
    const trackRef = useRef(null);
    const count = images.length;
    const isOpen = active !== null;
    const isScroll = layout === "scroll";

    // Buka atau tutup <dialog> mengikuti state
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    // Kunci scroll halaman selama galeri terbuka
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    // Layout scroll: tampilkan panah hanya kalau masih ada gambar di kiri atau kanan
    useEffect(() => {
        if (!isScroll) return;
        const el = trackRef.current;
        if (!el) return;

        const update = () =>
            setEdge({
                left: el.scrollLeft > 4,
                right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
            });

        update();
        el.addEventListener("scroll", update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            observer.disconnect();
        };
    }, [isScroll, count]);

    const showNext = () => setActive((i) => (i === null ? i : (i + 1) % count));
    const showPrev = () => setActive((i) => (i === null ? i : (i - 1 + count) % count));

    const scrollByPage = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
    };

    if (!count) return null;

    // 1 foto: besar; 2 foto: dua kolom; lebih dari itu: tiga kolom
    const gridClass =
        count === 1
            ? "grid-cols-1 max-w-3xl"
            : count === 2
                ? "grid-cols-2 max-w-4xl"
                : "grid-cols-2 md:grid-cols-3";

    const roundButton =
        "ds-press absolute w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center";
    const arrowButton =
        "ds-press absolute top-[calc(50%-0.75rem)] -translate-y-1/2 w-11 h-11 rounded-full bg-[var(--ds-surface)] hover:bg-[var(--ds-surface-muted)] text-[var(--ds-text)] border border-[var(--ds-border)] shadow-md flex items-center justify-center transition-colors";

    const thumbnails = images.map((src, idx) => (
        <div
            key={idx}
            className={isScroll ? "w-[78%] sm:w-[46%] lg:w-[32%] shrink-0 snap-start" : ""}
        >
            <button
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Buka ${label} ${idx + 1} dari ${count}`}
                className="ds-press group relative block w-full aspect-video overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface-muted)]"
            >
                <img
                    src={src}
                    alt={showCaptions ? `${label} ${idx + 1}` : captions[idx] || `${label} ${idx + 1}`}
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    style={{ transitionTimingFunction: "var(--ds-ease)" }}
                />
            </button>
            {showCaptions && captions[idx] && (
                <p className="mt-2 text-sm text-[var(--ds-text-muted)] leading-relaxed whitespace-pre-line">
                    {captions[idx]}
                </p>
            )}
        </div>
    ));

    return (
        <>
            {isScroll ? (
                <div className="relative">
                    <div
                        ref={trackRef}
                        role="region"
                        aria-label={`${label} list`}
                        tabIndex={0}
                        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-3"
                    >
                        {thumbnails}
                    </div>

                    {edge.left && (
                        <button
                            type="button"
                            onClick={() => scrollByPage(-1)}
                            aria-label="Scroll photos left"
                            className={`${arrowButton} left-2`}
                        >
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {edge.right && (
                        <button
                            type="button"
                            onClick={() => scrollByPage(1)}
                            aria-label="Scroll photos right"
                            className={`${arrowButton} right-2`}
                        >
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            ) : (
                <div className={`grid ${gridClass} gap-3 sm:gap-4`}>{thumbnails}</div>
            )}

            <dialog
                ref={dialogRef}
                aria-label={isOpen ? `${label} ${active + 1} dari ${count}` : label}
                onClose={() => setActive(null)}
                onKeyDown={onKeyDown}
                className="m-0 p-0 w-full h-full max-w-none max-h-none bg-transparent overflow-hidden overscroll-contain backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm"
            >
                {isOpen && (
                    <div
                        className="relative flex items-center justify-center w-full h-full p-4 sm:p-8"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setActive(null);
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setActive(null)}
                            aria-label="Tutup"
                            className={`${roundButton} top-4 right-4`}
                        >
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {count > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPrev}
                                    aria-label="Sebelumnya"
                                    className={`${roundButton} left-3 sm:left-6 top-1/2 -translate-y-1/2`}
                                >
                                    <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={showNext}
                                    aria-label="Berikutnya"
                                    className={`${roundButton} right-3 sm:right-6 top-1/2 -translate-y-1/2`}
                                >
                                    <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        <figure className="ds-pop max-w-5xl w-full flex flex-col items-center gap-3">
                            <img
                                src={images[active]}
                                alt={captions[active] || `${label} ${active + 1}`}
                                width={1280}
                                height={720}
                                className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
                            />
                            <figcaption className="text-center space-y-1">
                                {captions[active] && (
                                    <p className="text-sm text-slate-100">{captions[active]}</p>
                                )}
                                <p className="text-xs text-slate-300 ds-data">
                                    {active + 1} / {count}
                                </p>
                            </figcaption>
                        </figure>
                    </div>
                )}
            </dialog>
        </>
    );
}