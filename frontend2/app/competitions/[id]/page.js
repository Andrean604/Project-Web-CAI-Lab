"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import Gallery from "@/components/gallery";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, apiUpload, assetUrl } from "@/lib/api";

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

function isHttpUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

// Panel admin: unggah dan hapus foto lomba
function PhotoManager({ competitionId, photos, setPhotos }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const files = Array.from(form.elements.photos.files);
        if (files.length === 0) return;

        setUploading(true);
        setError("");
        try {
            const body = new FormData();
            files.forEach((file) => body.append("photos", file));
            const created = await apiUpload(`/api/competitions/${competitionId}/photos`, body);
            setPhotos((prev) => [...prev, ...created]);
            form.reset();
        } catch (err) {
            setError(err.message);
        }
        setUploading(false);
    };

    const handleDelete = async (photoId) => {
        if (!window.confirm("Delete this photo?")) return;
        try {
            await apiFetch(`/api/competitions/${competitionId}/photos/${photoId}`, { method: "DELETE" });
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="ds-card p-5 space-y-5" aria-labelledby="manage-photos-title">
            <h2 id="manage-photos-title" className="text-base font-semibold text-[var(--ds-text)]">
                Manage photos
            </h2>

            <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1 space-y-1">
                    <label htmlFor="competition-photos" className="block text-sm text-[var(--ds-text-muted)]">
                        Photos (JPG, PNG, or WebP, max 5 MB each, up to 10 at once)
                    </label>
                    <input
                        id="competition-photos"
                        name="photos"
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

            {photos.length > 0 && (
                <ul className="divide-y divide-[var(--ds-border)] border-t border-[var(--ds-border)]">
                    {photos.map((photo, idx) => (
                        <li key={photo.id} className="flex items-center gap-4 py-3">
                            <img
                                src={assetUrl(photo.url)}
                                alt={`Competition photo ${idx + 1}`}
                                width={96}
                                height={72}
                                loading="lazy"
                                className="w-16 h-12 rounded-lg object-cover bg-[var(--ds-surface-muted)]"
                            />
                            <p className="flex-1 text-sm text-[var(--ds-text-muted)]">Photo {idx + 1}</p>
                            <button
                                type="button"
                                onClick={() => handleDelete(photo.id)}
                                aria-label={`Delete competition photo ${idx + 1}`}
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

export default function CompetitionDetailPage() {
    const params = useParams();
    const { isAdmin } = useAuth();
    const [status, setStatus] = useState("loading"); // loading | found | not-found
    const [competition, setCompetition] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let cancelled = false;
        apiFetch(`/api/competitions/${params.id}`)
            .then((data) => {
                if (cancelled) return;
                setCompetition(data);
                setPhotos(data.photos ?? []);
                setStatus("found");
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
                <h1 className="ds-heading text-3xl font-bold text-[var(--ds-text)]">Competition not found</h1>
                <p className="text-[var(--ds-text-muted)]">{errorMsg || "This competition record does not exist."}</p>
                <Link
                    href="/competitions"
                    className="inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4"
                >
                    Back to Competitions
                </Link>
            </div>
        );
    }

    // Peserta: pakai daftar terstruktur; data lama hanya punya teks "teamMembers"
    const participants = competition.participants?.length
        ? competition.participants
        : competition.teamMembers
            ? competition.teamMembers.split(",").map((n) => ({ name: n.trim(), nim: "" })).filter((p) => p.name)
            : [];

    const story = competition.story || competition.description;
    const videos = competition.videos?.length
        ? competition.videos
        : competition.videoUrl
            ? [competition.videoUrl]
            : [];
    const dateText = formatDate(competition.eventDate) || competition.year;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-10">
            {/* Header */}
            <header className="space-y-5">
                <Link
                    href="/competitions"
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
                    <span>Back to Competitions</span>
                </Link>

                <h1 className="ds-heading text-3xl sm:text-5xl font-bold text-[var(--ds-text)] max-w-4xl">
                    {competition.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ds-award)] px-3 py-1 text-sm font-semibold text-[var(--ds-on-award)]">
                        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4M7 4h10v6a5 5 0 01-10 0V4zM7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4" />
                        </svg>
                        {competition.achievement}
                    </span>
                    {competition.category && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--ds-border)] text-[var(--ds-text-muted)]">
                            {competition.category}
                        </span>
                    )}
                </div>
            </header>

            {/* Foto lomba */}
            {photos.length > 0 && (
                <section className="space-y-4" aria-labelledby="competition-photos-title">
                    <h2 id="competition-photos-title" className="ds-section-title">
                        Photos
                    </h2>
                    <Gallery images={photos.map((p) => assetUrl(p.url))} label="Competition photo" layout="scroll" />
                </section>
            )}

            {isAdmin && (
                <PhotoManager competitionId={competition.id} photos={photos} setPhotos={setPhotos} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
                {/* Konten utama */}
                <div className="lg:col-span-2 space-y-10">
                    {story && (
                        <section className="space-y-3">
                            <h2 className="ds-section-title">Experience story</h2>
                            <p className="ds-prose text-base text-[var(--ds-text-muted)] leading-relaxed whitespace-pre-line">
                                {story}
                            </p>
                        </section>
                    )}

                    {participants.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="ds-section-title">Team</h2>
                            <div className="ds-card overflow-x-auto">
                                <table className="w-full text-left">
                                    <caption className="sr-only">Team members and student ID numbers</caption>
                                    <thead>
                                        <tr className="border-b border-[var(--ds-border)] text-sm text-[var(--ds-text-muted)]">
                                            <th scope="col" className="py-3 pl-4 pr-4 font-normal">Name</th>
                                            <th scope="col" className="py-3 pr-4 font-normal">NIM</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--ds-border)]">
                                        {participants.map((p, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3 pl-4 pr-4 font-medium text-[var(--ds-text)]">{p.name}</td>
                                                <td className="py-3 pr-4 ds-data text-sm text-[var(--ds-text-muted)]">
                                                    {p.nim || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {videos.length > 0 && (
                        <section className="space-y-4" aria-labelledby="competition-videos-title">
                            <h2 id="competition-videos-title" className="ds-section-title">
                                {videos.length > 1 ? "Videos" : "Video"}
                            </h2>
                            <div className={`grid grid-cols-1 ${videos.length > 1 ? "md:grid-cols-2" : ""} gap-6`}>
                                {videos.map((url, idx) => (
                                    <div key={idx} className="rounded-2xl overflow-hidden border border-[var(--ds-border)]">
                                        <VideoPlaceholder
                                            videoUrl={url}
                                            title={`${competition.title} video ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Lembar catatan */}
                <aside className="lg:sticky lg:top-24 lg:self-start space-y-3">
                    <h2 className="ds-section-title">Competition details</h2>
                    <dl className="ds-sheet">
                        <div className="ds-sheet-row">
                            <dt>Result</dt>
                            <dd>{competition.achievement}</dd>
                        </div>
                        {competition.level && (
                            <div className="ds-sheet-row">
                                <dt>Level</dt>
                                <dd>{competition.level}</dd>
                            </div>
                        )}
                        <div className="ds-sheet-row">
                            <dt>Date</dt>
                            <dd>{dateText}</dd>
                        </div>
                        {competition.location && (
                            <div className="ds-sheet-row">
                                <dt>Location</dt>
                                <dd>{competition.location}</dd>
                            </div>
                        )}
                        <div className="ds-sheet-row">
                            <dt>Organizer</dt>
                            <dd>{competition.organizer}</dd>
                        </div>
                        {competition.category && (
                            <div className="ds-sheet-row">
                                <dt>Category</dt>
                                <dd>{competition.category}</dd>
                            </div>
                        )}
                        {competition.lecturer && (
                            <div className="ds-sheet-row">
                                <dt>Advisor</dt>
                                <dd>{competition.lecturer}</dd>
                            </div>
                        )}
                        {isHttpUrl(competition.certificateUrl) && (
                            <div className="ds-sheet-row">
                                <dt>Certificate</dt>
                                <dd>
                                    <a
                                        href={competition.certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--ds-accent)] hover:underline underline-offset-4"
                                    >
                                        View certificate
                                    </a>
                                </dd>
                            </div>
                        )}
                    </dl>
                </aside>
            </div>
        </div>
    );
}