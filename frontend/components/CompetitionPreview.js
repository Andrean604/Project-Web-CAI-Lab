"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { initialCompetitions } from "@/data/competitions";

export default function CompetitionPreview() {
    const [competitions, setCompetitions] = useState([]);

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

    const previewItems = competitions.slice(0, 3);

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                            LAB ACHIEVEMENTS
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Competition Showcase
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Recent championship awards and hackathon achievements from laboratory members.
                        </p>
                    </div>

                    <Link
                        href="/competitions"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors self-start sm:self-auto group"
                    >
                        <span>View All Achievements</span>
                        <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </Link>
                </div>

                {/* 3 Card Grid Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {previewItems.length > 0 ? (
                        previewItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-mono font-bold">
                                            🏆 {item.achievement}
                                        </span>
                                        <span className="text-xs font-mono font-semibold text-slate-400">
                                            {item.year}
                                        </span>
                                    </div>

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

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                                    {item.teamMembers && (
                                        <p className="truncate">
                                            <strong className="text-slate-700 dark:text-slate-300">Team:</strong>{" "}
                                            {item.teamMembers}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                            No achievement data available.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}