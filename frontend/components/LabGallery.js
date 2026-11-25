"use client";
import { useEffect, useState } from "react";
import Gallery from "@/components/Gallery";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, apiUpload, assetUrl } from "@/lib/api";

const MAX_CAPTION = 500;

export default function LabGallery() {
    const { isAdmin } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [uploading, setUploading] = useState(false);

    // Edit caption
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        apiFetch("/api/lab-photos")
            .then((data) => {
                if (!cancelled) setPhotos(data);
            })
            .catch(() => {
                if (!cancelled) setPhotos([]);
            })
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const files = Array.from(form.elements.photos.files);
        const caption = form.elements.caption.value.trim();
        if (files.length === 0) return;

        setUploading(true);
        setError("");
        const failed = [];

        for (let i = 0; i < files.length; i++) {
            setStatus(`Uploading ${i + 1} of ${files.length}…`);
            const body = new FormData();
            body.append("photo", files[i]);
            if (caption) body.append("caption", caption);
            try {
                const saved = await apiUpload("/api/lab-photos", body);
                setPhotos((prev) => [saved, ...prev]);
            } catch (err) {
                failed.push(`${files[i].name}: ${err.message}`);
            }
        }

        setUploading(false);
        setStatus("");
        if (failed.length > 0) setError(failed.join(" | "));
        form.reset();
    };

    const startEdit = (photo) => {
        setEditingId(photo.id);
        setEditText(photo.caption || "");
        setError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    const saveCaption = async (id) => {
        setSaving(true);
        setError("");
        try {
            const updated = await apiFetch(`/api/lab-photos/${id}`, {
                method: "PATCH",
                body: { caption: editText },
            });
            setPhotos((prev) => prev.map((p) => (p.id === id ? updated : p)));
            cancelEdit();
        } catch (err) {
            setError(err.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this photo?")) return;
        try {
            await apiFetch(`/api/lab-photos/${id}`, { method: "DELETE" });
            setPhotos((prev) => prev.filter((p) => p.id !== id));
            if (editingId === id) cancelEdit();
        } catch (err) {
            setError(err.message);
        }
    };

    const textButton =
        "ds-press min-h-[44px] px-3 rounded-[var(--ds-radius-control)] text-sm font-medium transition-colors hover:bg-[var(--ds-surface-muted)]";

    return (
        <section className="border-t border-[var(--ds-border)]" aria-labelledby="lab-gallery-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <div className="space-y-2">
                    <h2
                        id="lab-gallery-title"
                        className="ds-heading text-2xl sm:text-3xl font-bold text-[var(--ds-text)]"
                    >
                        Inside the Lab
                    </h2>
                    <p className="ds-prose text-[var(--ds-text-muted)]">
                        Photos of the Computing & AI Lab workspace and facilities.
                    </p>
                </div>

                {photos.length > 0 ? (
                    <Gallery
                        images={photos.map((p) => assetUrl(p.url))}
                        captions={photos.map((p) => p.caption || "")}
                        label="Lab photo"
                        showCaptions
                    />
                ) : (
                    <p className="text-sm text-[var(--ds-text-muted)]">
                        {loaded ? "Lab photos will be added soon." : "Loading…"}
                    </p>
                )}

                {isAdmin && (
                    <div className="ds-card p-5 space-y-5">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-[var(--ds-text)]">Manage lab photos</h3>
                            <p className="text-sm text-[var(--ds-text-muted)]">
                                The caption is shown under each photo. Use it to explain which facilities are in the photo.
                            </p>
                        </div>

                        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:items-end">
                            <div className="space-y-1">
                                <label htmlFor="lab-photos" className="block text-sm text-[var(--ds-text-muted)]">
                                    Photos (JPG, PNG, or WebP, max 5 MB each)
                                </label>
                                <input
                                    id="lab-photos"
                                    name="photos"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    required
                                    className="block w-full text-sm text-[var(--ds-text)] file:mr-3 file:min-h-[44px] file:rounded-[var(--ds-radius-control)] file:border-0 file:bg-[var(--ds-surface-muted)] file:px-4 file:text-sm file:font-medium file:text-[var(--ds-text)]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="lab-caption" className="block text-sm text-[var(--ds-text-muted)]">
                                    Caption (optional, applied to every selected photo)
                                </label>
                                <textarea
                                    id="lab-caption"
                                    name="caption"
                                    rows={2}
                                    maxLength={MAX_CAPTION}
                                    autoComplete="off"
                                    className="w-full px-3.5 py-2.5 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] text-sm"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="ds-press min-h-[44px] px-5 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 disabled:opacity-60 text-white font-semibold text-sm transition"
                                >
                                    {uploading ? "Uploading…" : "Upload"}
                                </button>
                            </div>
                        </form>

                        <p className="text-sm text-[var(--ds-text-muted)]" aria-live="polite">
                            {status}
                        </p>
                        {error && (
                            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}

                        {photos.length > 0 && (
                            <ul className="divide-y divide-[var(--ds-border)] border-t border-[var(--ds-border)]">
                                {photos.map((photo, idx) => (
                                    <li key={photo.id} className="py-3 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={assetUrl(photo.url)}
                                                alt={`Lab photo ${idx + 1}`}
                                                width={96}
                                                height={72}
                                                loading="lazy"
                                                className="w-16 h-12 rounded-lg object-cover bg-[var(--ds-surface-muted)]"
                                            />
                                            <p className="flex-1 min-w-0 text-sm text-[var(--ds-text)] line-clamp-2">
                                                {photo.caption || (
                                                    <span className="text-[var(--ds-text-muted)]">No caption</span>
                                                )}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => startEdit(photo)}
                                                aria-label={`Edit caption of lab photo ${idx + 1}`}
                                                className={`${textButton} text-[var(--ds-accent)]`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(photo.id)}
                                                aria-label={`Delete lab photo ${idx + 1}`}
                                                className={`${textButton} text-red-600 dark:text-red-400`}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {editingId === photo.id && (
                                            <div className="space-y-2">
                                                <label htmlFor={`caption-${photo.id}`} className="sr-only">
                                                    Caption for lab photo {idx + 1}
                                                </label>
                                                <textarea
                                                    id={`caption-${photo.id}`}
                                                    rows={4}
                                                    maxLength={MAX_CAPTION}
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    autoComplete="off"
                                                    className="w-full px-3.5 py-2.5 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] text-sm"
                                                />
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-xs text-[var(--ds-text-muted)] tabular-nums">
                                                        {editText.length}/{MAX_CAPTION}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className={`${textButton} border border-[var(--ds-border)] text-[var(--ds-text)]`}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => saveCaption(photo.id)}
                                                            disabled={saving}
                                                            className="ds-press min-h-[44px] px-4 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 disabled:opacity-60 text-white text-sm font-semibold transition"
                                                        >
                                                            {saving ? "Saving…" : "Save"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}