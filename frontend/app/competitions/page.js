"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
                                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt={`${item.title} team photo`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-600">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1a4 4 0 100-8 4 4 0 000 8zm6 3a4 4 0 00-3-3.87M9 12a4 4 0 100-8 4 4 0 000 8z"
                                                />
                                            </svg>
                                            <span className="text-[10px] font-mono">No Photo</span>
                                        </div>
                                    )}

                                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-900/20 border border-amber-300/50 whitespace-nowrap">
                                        <span className="text-sm leading-none">🏆</span>
                                        <span>{item.achievement}</span>
                                    </span>

                                    <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-slate-900/70 text-white text-[10px] font-mono font-semibold">
                                        {item.year}
                                    </span>

                                    {/* Edit / Delete overlay controls */}
                                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 shadow-sm transition-colors"
                                            title="Edit Competition"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCompetition(item.id)}
                                            className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm transition-colors"
                                            title="Delete Competition"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                                <div className="p-6 space-y-4 flex flex-col justify-between flex-grow">
                                    <div className="space-y-3">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs text-indigo-600 dark:text-cyan-400 font-medium">
                                            📍 {item.organizer}
                                        </p>

                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
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

                                    <Link
                                        href={`/competitions/${item.id}`}
                                        className="w-full text-center py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <span>View Details</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
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
