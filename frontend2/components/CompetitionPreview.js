"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, assetUrl } from "@/lib/api";

// "2026-11-14" -> "14 November 2026" (UTC, supaya tanggal tidak bergeser sehari)
function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}

export default function CompetitionPreview() {
    const [competitions, setCompetitions] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        apiFetch("/api/competitions")
            .then((data) => {
                if (!cancelled) setCompetitions(data);
            })
            .catch(() => {
                if (!cancelled) setCompetitions([]);
            })
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const previewItems = competitions.slice(0, 3);

    return (
        <section className="border-t border-[var(--ds-border)]" aria-labelledby="competition-preview-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h2
                            id="competition-preview-title"
                            className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]"
                        >
                            Competition Showcase
                        </h2>
                        <p className="ds-prose text-[var(--ds-text-muted)]">
                            Recent championship awards and hackathon achievements from laboratory members.
                        </p>
                    </div>

                    <Link
                        href="/competitions"
                        className="inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4 self-start sm:self-auto"
                    >
                        View All Achievements
                    </Link>
                </div>

                {previewItems.length > 0 ? (
                    <ul className="ds-card divide-y divide-[var(--ds-border)] overflow-hidden">
                        {previewItems.map((item) => {
                            const cover = item.thumbnail || item.photos?.[0]?.url;
                            const dateText = formatDate(item.eventDate) || item.year;

                            return (
                                <li key={item.id}>
                                    <Link
                                        href={`/competitions/${item.id}`}
                                        className="ds-link-card flex items-center gap-4 p-4 transition-colors hover:bg-[var(--ds-surface-muted)]"
                                    >
                                        {/* Foto */}
                                        <div className="w-24 sm:w-32 aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-[var(--ds-surface-muted)]">
                                            {cover ? (
                                                <img
                                                    src={assetUrl(cover)}
                                                    alt=""
                                                    width={400}
                                                    height={300}
                                                    loading="lazy"
                                                    className="ds-zoom w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--ds-text-muted)]">
                                                    <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4 4 4 4-6 4 6M4 5h16v14H4V5z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hasil, judul, penyelenggara */}
                                        <div className="min-w-0 flex-1 space-y-1.5">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ds-award)] px-2.5 py-1 text-xs font-semibold text-[var(--ds-on-award)]">
                                                <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4M7 4h10v6a5 5 0 01-10 0V4zM7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4" />
                                                </svg>
                                                {item.achievement}
                                            </span>
                                            <h3 className="ds-link-title font-semibold text-[var(--ds-text)] line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-[var(--ds-text-muted)] truncate">{item.organizer}</p>
                                            <p className="md:hidden text-sm text-[var(--ds-text-muted)]">{dateText}</p>
                                        </div>

                                        {/* Kolom keterangan (layar sedang ke atas) */}
                                        <dl className="hidden md:grid shrink-0 w-80 grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            <div>
                                                <dt className="text-xs text-[var(--ds-text-muted)]">Date</dt>
                                                <dd className="text-[var(--ds-text)]">{dateText}</dd>
                                            </div>
                                            {item.level && (
                                                <div>
                                                    <dt className="text-xs text-[var(--ds-text-muted)]">Level</dt>
                                                    <dd className="text-[var(--ds-text)]">{item.level}</dd>
                                                </div>
                                            )}
                                            {item.location && (
                                                <div className="col-span-2">
                                                    <dt className="text-xs text-[var(--ds-text-muted)]">Location</dt>
                                                    <dd className="text-[var(--ds-text)] truncate">{item.location}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-[var(--ds-text-muted)]">
                        {loaded ? "No achievement data available." : "Loading…"}
                    </p>
                )}
            </div>
        </section>
    );
}