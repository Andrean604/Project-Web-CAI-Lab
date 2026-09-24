"use client";
import { useState, useEffect, useRef } from "react";

const emptyParticipant = () => ({ name: "", nim: "" });

function deriveParticipants(data) {
    if (data?.participants?.length) return data.participants;
    if (data?.teamMembers) {
        const parsed = data.teamMembers
            .split(",")
            .map((n) => ({ name: n.trim(), nim: "" }))
            .filter((p) => p.name);
        if (parsed.length) return parsed;
    }
    return [emptyParticipant()];
}

function deriveVideos(data) {
    if (data?.videos?.length) return data.videos;
    if (data?.videoUrl) return [data.videoUrl];
    return [""];
}

function emptyFormState() {
    return {
        title: "",
        organizer: "",
        achievement: "",
        category: "Artificial Intelligence",
        year: new Date().getFullYear().toString(),
        lecturer: "",
        description: "",
        story: "",
        videos: [""],
        thumbnail: "",
        participants: [emptyParticipant()],
    };
}

export default function AddCompetitionModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
}) {
    const fileInputRef = useRef(null);
    const [imageError, setImageError] = useState("");
    const [formData, setFormData] = useState(emptyFormState());

    // Populate form in Edit Mode or reset in Add Mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...emptyFormState(),
                ...initialData,
                participants: deriveParticipants(initialData),
                videos: deriveVideos(initialData),
            });
        } else {
            setFormData(emptyFormState());
        }
        setImageError("");
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleParticipantChange = (idx, field, value) => {
        setFormData((prev) => ({
            ...prev,
            participants: prev.participants.map((p, i) =>
                i === idx ? { ...p, [field]: value } : p
            ),
        }));
    };

    const addParticipant = () => {
        setFormData((prev) => ({
            ...prev,
            participants: [...prev.participants, emptyParticipant()],
        }));
    };

    const removeParticipant = (idx) => {
        setFormData((prev) => ({
            ...prev,
            participants: prev.participants.filter((_, i) => i !== idx),
        }));
    };

    const handleVideoChange = (idx, value) => {
        setFormData((prev) => ({
            ...prev,
            videos: prev.videos.map((v, i) => (i === idx ? value : v)),
        }));
    };

    const addVideo = () => {
        setFormData((prev) => ({ ...prev, videos: [...prev.videos, ""] }));
    };

    const removeVideo = (idx) => {
        setFormData((prev) => ({
            ...prev,
            videos: prev.videos.filter((_, i) => i !== idx),
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageError("");

        if (!file.type.startsWith("image/")) {
            setImageError("File harus berupa gambar (JPG, PNG, WebP, dll).");
            return;
        }

        const maxSizeBytes = 1.5 * 1024 * 1024; // 1.5MB
        if (file.size > maxSizeBytes) {
            setImageError("Ukuran gambar terlalu besar. Gunakan foto di bawah 1.5MB agar tidak memenuhi penyimpanan browser.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({ ...prev, thumbnail: reader.result }));
        };
        reader.onerror = () => {
            setImageError("Gagal membaca file gambar. Coba file lain.");
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, thumbnail: "" }));
        setImageError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.organizer || !formData.achievement) {
            alert("Please fill in Title, Organizer, and Achievement!");
            return;
        }

        const cleanedParticipants = formData.participants.filter((p) => p.name.trim());
        const cleanedVideos = formData.videos.map((v) => v.trim()).filter(Boolean);

        onSubmit({
            ...formData,
            participants: cleanedParticipants,
            // keep teamMembers in sync for any older UI that still reads the plain string
            teamMembers: cleanedParticipants.map((p) => p.name).join(", "),
            videos: cleanedVideos,
            videoUrl: cleanedVideos[0] || "",
            id: initialData ? initialData.id : `comp-${Date.now()}`,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {initialData ? "✏️ Edit Competition Achievement" : "🏆 Add Competition Achievement"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                    <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Competition Name / Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., National AI Hackathon 2026"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>

                    {/* Team Photo Upload */}
                    <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Team Photo
                        </label>

                        {formData.thumbnail ? (
                            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={formData.thumbnail}
                                    alt="Team photo preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-red-600 text-white text-[11px] font-semibold transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-cyan-500/50 cursor-pointer transition-colors text-slate-500 dark:text-slate-400 gap-1.5">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-xs font-medium">Click to upload photo</span>
                                <span className="text-[10px] text-slate-400">JPG, PNG, WebP &middot; max 1.5MB</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {imageError && (
                            <p className="mt-1.5 text-[11px] text-red-600 dark:text-red-400">{imageError}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Organizer *
                            </label>
                            <input
                                type="text"
                                name="organizer"
                                value={formData.organizer}
                                onChange={handleChange}
                                placeholder="e.g., Ministry of Education"
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Achievement / Award *
                            </label>
                            <input
                                type="text"
                                name="achievement"
                                value={formData.achievement}
                                onChange={handleChange}
                                placeholder="e.g., 1st Place Winner / Best Innovation"
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Competition Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="Artificial Intelligence">Artificial Intelligence</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="IoT & Smart City">IoT & Smart City</option>
                                <option value="Scientific Paper">Scientific Paper</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Software Development">Software Development</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Competition Year
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Advisor / Lecturer
                        </label>
                        <input
                            type="text"
                            name="lecturer"
                            value={formData.lecturer}
                            onChange={handleChange}
                            placeholder="Advisor Name"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Participants: name + NIM */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block font-medium text-slate-700 dark:text-slate-300">
                                Participants (Name & NIM)
                            </label>
                            <button
                                type="button"
                                onClick={addParticipant}
                                className="text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300"
                            >
                                + Add Participant
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.participants.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={p.name}
                                        onChange={(e) => handleParticipantChange(idx, "name", e.target.value)}
                                        placeholder="Full name"
                                        className="flex-[2] px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={p.nim}
                                        onChange={(e) => handleParticipantChange(idx, "nim", e.target.value)}
                                        placeholder="NIM"
                                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {formData.participants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeParticipant(idx)}
                                            className="flex-shrink-0 w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors"
                                            aria-label="Remove participant"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block font-medium text-slate-700 dark:text-slate-300">
                                Team Video URLs (YouTube/Vimeo embed links)
                            </label>
                            <button
                                type="button"
                                onClick={addVideo}
                                className="text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300"
                            >
                                + Add Video
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.videos.map((url, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleVideoChange(idx, e.target.value)}
                                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {formData.videos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVideo(idx)}
                                            className="flex-shrink-0 w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors"
                                            aria-label="Remove video"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Use the /embed/ link format, not the normal watch link. Add one row per video (e.g. one per participant).
                        </p>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Brief Project / Innovation Description
                        </label>
                        <textarea
                            name="description"
                            rows={2}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Short summary shown on the showcase card..."
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Experience Story
                        </label>
                        <textarea
                            name="story"
                            rows={4}
                            value={formData.story}
                            onChange={handleChange}
                            placeholder="Tell the full story of the competition journey, challenges, and how the team overcame them..."
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-md shadow-indigo-500/20"
                        >
                            {initialData ? "Save Changes" : "Save Competition"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
