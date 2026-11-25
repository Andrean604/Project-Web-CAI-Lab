"use client";
import { useEffect, useRef, useState } from "react";

const emptyForm = {
    name: "",
    category: "",
    shortDescription: "",
    longDescription: "",
    lecturers: "",
    students: "",
    techStack: "",
    features: "",
    videoUrl: "",
    demoUrl: "",
    githubUrl: "",
};

const toLines = (list) => (Array.isArray(list) ? list.join("\n") : "");
const fromLines = (text) =>
    text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

const inputClass =
    "w-full min-h-[44px] px-3.5 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] text-sm";
const textareaClass =
    "w-full px-3.5 py-2.5 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] text-sm";
const labelClass = "block text-sm font-medium text-[var(--ds-text)] mb-1";
const hintClass = "mt-1 text-xs text-[var(--ds-text-muted)]";

// onSubmit harus berupa fungsi async; kalau melempar error, pesannya tampil di form
export default function AddProductModal({ isOpen, onClose, onSubmit, initialData = null, categories = [] }) {
    const dialogRef = useRef(null);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Buka atau tutup <dialog> bawaan browser
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    // Isi form saat dibuka (mode edit atau tambah)
    useEffect(() => {
        if (!isOpen) return;
        setError("");
        setForm(
            initialData
                ? {
                    name: initialData.name || "",
                    category: initialData.category || "",
                    shortDescription: initialData.shortDescription || "",
                    longDescription: initialData.longDescription || "",
                    lecturers: toLines(initialData.creators?.lecturers),
                    students: toLines(initialData.creators?.students),
                    techStack: toLines(initialData.techStack),
                    features: toLines(initialData.features),
                    videoUrl: initialData.videoUrl || "",
                    demoUrl: initialData.demoUrl || "",
                    githubUrl: initialData.githubUrl || "",
                }
                : emptyForm
        );
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await onSubmit({
                name: form.name,
                category: form.category,
                shortDescription: form.shortDescription,
                longDescription: form.longDescription,
                creators: { lecturers: fromLines(form.lecturers), students: fromLines(form.students) },
                techStack: fromLines(form.techStack),
                features: fromLines(form.features),
                videoUrl: form.videoUrl,
                demoUrl: form.demoUrl,
                githubUrl: form.githubUrl,
            });
            onClose();
        } catch (err) {
            setError(err.message);
        }
        setSaving(false);
    };

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="product-modal-title"
            onClose={onClose}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            className="m-auto w-full max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] overscroll-contain backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
        >
            {isOpen && (
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--ds-border)]">
                        <h2 id="product-modal-title" className="text-lg font-semibold">
                            {initialData ? "Edit product" : "Add product"}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="ds-press w-11 h-11 -mr-2 inline-flex items-center justify-center rounded-[var(--ds-radius-control)] text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] transition-colors"
                        >
                            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="overflow-y-auto px-6 py-5 space-y-5">
                        <div>
                            <label htmlFor="product-name" className={labelClass}>
                                Name *
                            </label>
                            <input
                                id="product-name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                maxLength={150}
                                autoComplete="off"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="product-category" className={labelClass}>
                                Category *
                            </label>
                            <input
                                id="product-category"
                                name="category"
                                type="text"
                                list="product-categories"
                                value={form.category}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                                className={inputClass}
                            />
                            <datalist id="product-categories">
                                {categories.map((category) => (
                                    <option key={category} value={category} />
                                ))}
                            </datalist>
                            <p className={hintClass}>Pick an existing category or type a new one.</p>
                        </div>

                        <div>
                            <label htmlFor="product-short" className={labelClass}>
                                Short description *
                            </label>
                            <textarea
                                id="product-short"
                                name="shortDescription"
                                rows={2}
                                value={form.shortDescription}
                                onChange={handleChange}
                                maxLength={300}
                                required
                                className={textareaClass}
                            />
                            <p className={hintClass}>Shown on the product card.</p>
                        </div>

                        <div>
                            <label htmlFor="product-long" className={labelClass}>
                                About this project
                            </label>
                            <textarea
                                id="product-long"
                                name="longDescription"
                                rows={5}
                                value={form.longDescription}
                                onChange={handleChange}
                                className={textareaClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="product-lecturers" className={labelClass}>
                                    Faculty
                                </label>
                                <textarea
                                    id="product-lecturers"
                                    name="lecturers"
                                    rows={3}
                                    value={form.lecturers}
                                    onChange={handleChange}
                                    className={textareaClass}
                                />
                                <p className={hintClass}>One name per line.</p>
                            </div>
                            <div>
                                <label htmlFor="product-students" className={labelClass}>
                                    Students
                                </label>
                                <textarea
                                    id="product-students"
                                    name="students"
                                    rows={3}
                                    value={form.students}
                                    onChange={handleChange}
                                    className={textareaClass}
                                />
                                <p className={hintClass}>One name per line.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="product-tech" className={labelClass}>
                                    Tech stack
                                </label>
                                <textarea
                                    id="product-tech"
                                    name="techStack"
                                    rows={3}
                                    value={form.techStack}
                                    onChange={handleChange}
                                    className={textareaClass}
                                />
                                <p className={hintClass}>One item per line.</p>
                            </div>
                            <div>
                                <label htmlFor="product-features" className={labelClass}>
                                    Key features
                                </label>
                                <textarea
                                    id="product-features"
                                    name="features"
                                    rows={3}
                                    value={form.features}
                                    onChange={handleChange}
                                    className={textareaClass}
                                />
                                <p className={hintClass}>One feature per line.</p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="product-video" className={labelClass}>
                                Video link (embed)
                            </label>
                            <input
                                id="product-video"
                                name="videoUrl"
                                type="url"
                                value={form.videoUrl}
                                onChange={handleChange}
                                autoComplete="off"
                                className={inputClass}
                            />
                            <p className={hintClass}>
                                Use the /embed/ format, for example https://www.youtube.com/embed/VIDEO_ID
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="product-demo" className={labelClass}>
                                    Demo link
                                </label>
                                <input
                                    id="product-demo"
                                    name="demoUrl"
                                    type="url"
                                    value={form.demoUrl}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="product-github" className={labelClass}>
                                    GitHub link
                                </label>
                                <input
                                    id="product-github"
                                    name="githubUrl"
                                    type="url"
                                    value={form.githubUrl}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <p className="text-xs text-[var(--ds-text-muted)]">
                            Screenshots are uploaded from the product page after the product is saved.
                        </p>

                        {error && (
                            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--ds-border)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="ds-press min-h-[44px] px-4 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-sm font-medium text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="ds-press min-h-[44px] px-5 rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 disabled:opacity-60 text-white text-sm font-semibold transition"
                        >
                            {saving ? "Saving…" : initialData ? "Save changes" : "Save product"}
                        </button>
                    </div>
                </form>
            )}
        </dialog>
    );
}
