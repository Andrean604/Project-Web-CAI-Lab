"use client";
import { useState, useEffect } from "react";

export default function AddCompetitionModal({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
}) {
    const [formData, setFormData] = useState({
        title: "",
        organizer: "",
        achievement: "",
        category: "Artificial Intelligence",
        year: new Date().getFullYear().toString(),
        teamMembers: "",
        lecturer: "",
        description: "",
    });

    // Populate form in Edit Mode or reset in Add Mode
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: "",
                organizer: "",
                achievement: "",
                category: "Artificial Intelligence",
                year: new Date().getFullYear().toString(),
                teamMembers: "",
                lecturer: "",
                description: "",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.organizer || !formData.achievement) {
            alert("Please fill in Title, Organizer, and Achievement!");
            return;
        }

        onSubmit({
            ...formData,
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Team Members (Comma separated)
                            </label>
                            <input
                                type="text"
                                name="teamMembers"
                                value={formData.teamMembers}
                                onChange={handleChange}
                                placeholder="Student Name 1, Name 2"
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
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
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Brief Project / Innovation Description
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Briefly describe the solution/application created..."
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