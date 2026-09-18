"use client";
import { useState, useEffect } from "react";
import { initialCompetitions } from "@/data/competitions";
import AddCompetitionModal from "@/components/AddCompetitionModal";

export default function CompetitionsPage() {
    const [competitions, setCompetitions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Load data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("lab_competitions_data");
        if (savedData) {
            try {
                setCompetitions(JSON.parse(savedData));
            } catch (e) {
                setCompetitions(initialCompetitions);
            }
        } else {
            setCompetitions(initialCompetitions);
        }
    }, []);

    // Open Modal in Add Mode
    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    // Open Modal in Edit Mode
    const handleOpenEditModal = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    // Save Data (Handles both Add & Edit)
    const handleSaveCompetition = (compData) => {
        let updated;
        if (editingItem) {
            // Edit mode: replace old data with new data based on ID
            updated = competitions.map((item) =>
                item.id === compData.id ? compData : item
            );
        } else {
            // Add mode: insert new data at the beginning of the array
            updated = [compData, ...competitions];
        }

        setCompetitions(updated);
        localStorage.setItem("lab_competitions_data", JSON.stringify(updated));
    };

    // Delete Function
    const handleDeleteCompetition = (id) => {
        if (window.confirm("Are you sure you want to delete this competition record?")) {
            const updated = competitions.filter((item) => item.id !== id);
            setCompetitions(updated);
            localStorage.setItem("lab_competitions_data", JSON.stringify(updated));
        }
    };

    // Search filter
    const filteredCompetitions = competitions.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.achievement.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                            ACHIEVEMENT SHOWCASE
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Competition Showcase
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            List of competition and hackathon achievements by laboratory members.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all self-start md:self-auto"
                    >
                        <span>+ Add Competition</span>
                    </button>
                </div>

                {/* Filter / Search Bar */}
                <div className="max-w-md">
                    <input
                        type="text"
                        placeholder="Search competitions, achievements, or categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                </div>

                {/* Competitions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompetitions.length > 0 ? (
                        filteredCompetitions.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-[11px] font-mono font-bold">
                                            🏆 {item.achievement}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-mono font-semibold text-slate-400 mr-1">
                                                {item.year}
                                            </span>

                                            {/* Edit Button (Pencil) */}
                                            <button
                                                onClick={() => handleOpenEditModal(item)}
                                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                                                title="Edit Competition"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>

                                            {/* Delete Button (Trash) */}
                                            <button
                                                onClick={() => handleDeleteCompetition(item.id)}
                                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                                title="Delete Competition"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-indigo-600 dark:text-cyan-400 font-medium">
                                        📍 {item.organizer}
                                    </p>

                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    {item.teamMembers && (
                                        <p className="truncate">
                                            <strong className="text-slate-700 dark:text-slate-300">Team:</strong>{" "}
                                            {item.teamMembers}
                                        </p>
                                    )}
                                    {item.lecturer && (
                                        <p className="truncate">
                                            <strong className="text-slate-700 dark:text-slate-300">Advisor:</strong>{" "}
                                            {item.lecturer}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 text-sm">No competitions found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup Modal (Handles Add & Edit) */}
            <AddCompetitionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveCompetition}
                initialData={editingItem}
            />
        
        </div>
    );
}