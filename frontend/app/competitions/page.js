"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AddCompetitionModal from "@/components/AddCompetitionModal";
import { useAuth } from "@/components/AuthProvider";
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

export default function CompetitionsPage() {
    const { isAdmin } = useAuth();
    const [competitions, setCompetitions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Ambil data dari backend
    useEffect(() => {
        let cancelled = false;
        apiFetch("/api/competitions")
            .then((data) => {
                if (!cancelled) setCompetitions(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleOpenAddModal = () => {
        if (!isAdmin) return;
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        if (!isAdmin) return;
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Simpan data (tambah / edit) lewat backend
    const handleSaveCompetition = async (compData) => {
        if (!isAdmin) return;
        const { id, ...payload } = compData;
        try {
            if (editingItem) {
                const saved = await apiFetch(`/api/competitions/${editingItem.id}`, {
                    method: "PUT",
                    body: payload,
                });
                setCompetitions((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
            } else {
                const saved = await apiFetch("/api/competitions", { method: "POST", body: payload });
                setCompetitions((prev) => [saved, ...prev]);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Hapus data lewat backend
    const handleDeleteCompetition = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm("Are you sure you want to delete this competition record?")) return;
        try {
            await apiFetch(`/api/competitions/${id}`, { method: "DELETE" });
            setCompetitions((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const query = searchQuery.trim().toLowerCase();
    const filteredCompetitions = competitions.filter(
        (item) =>
            !query ||
            [item.title, item.category, item.achievement, item.organizer, item.location].some((value) =>
                (value || "").toLowerCase().includes(query)
            )
    );

    const iconBase =
        "ds-press w-11 h-11 inline-flex items-center justify-center rounded-[var(--ds-radius-control)] hover:bg-[var(--ds-surface-muted)] transition-colors";
    const iconButton = `${iconBase} text-[var(--ds-text-muted)]`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-8">
            {/* Kepala halaman */}
            <header className="space-y-2">
                <h1 className="ds-heading text-3xl sm:text-4xl font-bold text-[var(--ds-text)]">
                    Competition Showcase
                </h1>
                <p className="ds-prose text-[var(--ds-text-muted)]">
                    List of competition and hackathon achievements by laboratory members.
                </p>
            </header>

            {/* Pencarian, dan ikon tambah (admin) sejajar dengan ikon edit dan hapus di bawahnya */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-full max-w-md">
                    <label htmlFor="competition-search" className="sr-only">
                        Search competitions
                    </label>
                    <svg
                        aria-hidden="true"
                        className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        id="competition-search"
                        name="q"
                        type="search"
                        autoComplete="off"
                        placeholder="Search competitions, achievements, or categories…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full min-h-[44px] pl-10 pr-4 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] text-sm"
                    />
                </div>
                {!loading && !error && (
                    <p className="text-sm text-[var(--ds-text-muted)] tabular-nums" aria-live="polite">
                        {filteredCompetitions.length} of {competitions.length}
                    </p>
                )}

                {isAdmin && (
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        aria-label="Add competition"
                        title="Add competition"
                        className={`${iconBase} text-[var(--ds-primary)] self-end sm:self-auto sm:ml-auto mr-3`}
                    >
                        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Daftar */}
            {filteredCompetitions.length > 0 ? (
                <ul className="ds-card divide-y divide-[var(--ds-border)] overflow-hidden">
                    {filteredCompetitions.map((item) => {
                        const cover = item.thumbnail || item.photos?.[0]?.url;
                        const dateText = formatDate(item.eventDate) || item.year;

                        return (
                            <li key={item.id} className="flex items-stretch">
                                <Link
                                    href={`/competitions/${item.id}`}
                                    className="ds-link-card flex flex-1 min-w-0 items-stretch transition-colors hover:bg-[var(--ds-surface-muted)]"
                                >
                                    {/* Foto: mengisi penuh tinggi kartu */}
                                    <div className="relative w-28 sm:w-44 min-h-[8rem] shrink-0 overflow-hidden bg-[var(--ds-surface-muted)]">
                                        {cover ? (
                                            <img
                                                src={assetUrl(cover)}
                                                alt=""
                                                width={400}
                                                height={300}
                                                loading="lazy"
                                                className="ds-zoom absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[var(--ds-text-muted)]">
                                                <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4 4 4 4-6 4 6M4 5h16v14H4V5z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Keterangan */}
                                    <div className="min-w-0 flex-1 space-y-2 p-4 sm:p-5">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ds-award)] px-2.5 py-1 text-xs font-semibold text-[var(--ds-on-award)]">
                                            <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4M7 4h10v6a5 5 0 01-10 0V4zM7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4" />
                                            </svg>
                                            {item.achievement}
                                        </span>

                                        <h2 className="ds-link-title ds-heading text-lg font-semibold text-[var(--ds-text)] line-clamp-2">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-[var(--ds-text-muted)] truncate">{item.organizer}</p>

                                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                            {item.level && (
                                                <div>
                                                    <dt className="text-xs text-[var(--ds-text-muted)]">Level</dt>
                                                    <dd className="text-[var(--ds-text)]">{item.level}</dd>
                                                </div>
                                            )}
                                            <div>
                                                <dt className="text-xs text-[var(--ds-text-muted)]">Date</dt>
                                                <dd className="text-[var(--ds-text)]">{dateText}</dd>
                                            </div>
                                            {item.location && (
                                                <div>
                                                    <dt className="text-xs text-[var(--ds-text-muted)]">Location</dt>
                                                    <dd className="text-[var(--ds-text)] truncate">{item.location}</dd>
                                                </div>
                                            )}
                                        </dl>

                                        {item.teamMembers && (
                                            <p className="hidden sm:block text-sm text-[var(--ds-text-muted)] truncate">
                                                Team: {item.teamMembers}
                                            </p>
                                        )}
                                    </div>
                                </Link>

                                {/* Tombol admin: selalu terlihat, di luar tautan */}
                                {isAdmin && (
                                    <div className="flex flex-col justify-center gap-1 px-3">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(item)}
                                            aria-label={`Edit ${item.title}`}
                                            className={iconButton}
                                        >
                                            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCompetition(item.id)}
                                            aria-label={`Delete ${item.title}`}
                                            className={`${iconButton} hover:text-red-600 dark:hover:text-red-400`}
                                        >
                                            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="ds-card p-10 text-center space-y-3">
                    {error ? (
                        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    ) : (
                        <p className="text-[var(--ds-text-muted)]">
                            {loading
                                ? "Loading…"
                                : query
                                    ? `No competitions matched "${searchQuery.trim()}".`
                                    : "No competitions found."}
                        </p>
                    )}
                    {query && !loading && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="ds-press min-h-[44px] px-4 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-sm font-medium text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] transition-colors"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            )}

            {/* Modal (tambah dan edit) */}
            <AddCompetitionModal
                isOpen={isAdmin && isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveCompetition}
                initialData={editingItem}
            />
        </div>
    );
}