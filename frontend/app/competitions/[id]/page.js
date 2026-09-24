"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { initialCompetitions } from "@/data/competitions";
import VideoPlaceholder from "@/components/VideoPlaceholder";

export default function CompetitionDetailPage() {
    const params = useParams();
    const [status, setStatus] = useState("loading"); // loading | found | not-found
    const [competition, setCompetition] = useState(null);

    useEffect(() => {
        const savedData = localStorage.getItem("lab_competitions_data");
        let list = initialCompetitions;
        if (savedData) {
            try {
                list = JSON.parse(savedData);
            } catch (e) {
                list = initialCompetitions;
            }
        }
        const found = list.find((c) => String(c.id) === String(params.id));
        if (found) {
            setCompetition(found);
            setStatus("found");
        } else {
            setStatus("not-found");
        }
    }, [params.id]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <p className="text-sm text-slate-400 font-mono">Loading...</p>
            </div>
        );
    }

    if (status === "not-found") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-950 px-4 text-center">
                <p className="text-4xl font-extrabold text-slate-300 dark:text-slate-700">404</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Competition record not found.</p>
                <Link
                    href="/competitions"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                >
                    Back to Competitions
                </Link>
            </div>
        );
    }

    // Prefer structured participants list; fall back to legacy comma-separated teamMembers string
    const participants = competition.participants?.length
        ? competition.participants
        : (competition.teamMembers
            ? competition.teamMembers.split(",").map((n) => ({ name: n.trim(), nim: "" })).filter((p) => p.name)
            : []);

    const story = competition.story || competition.description;
    const videos = competition.videos?.length
        ? competition.videos
        : (competition.videoUrl ? [competition.videoUrl] : []);

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-200">
            {/* HERO BAND */}
            <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
                <div
                    className="absolute inset-0 -z-10 pointer-events-none dark:hidden"
                    style={{
                        background: "radial-gradient(circle at top, rgba(199, 210, 254, 0.6) 0%, rgba(248, 250, 252, 0) 65%)",
                    }}
                />
                <div
                    className="absolute inset-0 -z-10 pointer-events-none hidden dark:block"
                    style={{
                        background: "radial-gradient(circle at top, rgba(30, 41, 59, 1) 0%, rgba(2, 6, 23, 1) 65%)",
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-10 sm:pb-14 space-y-6">
                    <Link
                        href="/competitions"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors group"
                    >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Competitions</span>
                    </Link>

                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent pb-1">
                            {competition.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                                {competition.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-900/20 border border-amber-300/50 whitespace-nowrap">
                                <span className="text-sm leading-none">🏆</span>
                                <span>{competition.achievement}</span>
                            </span>
                            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {competition.year}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {/* Videos */}
                {videos.length > 0 ? (
                    <div className={`grid grid-cols-1 ${videos.length > 1 ? "md:grid-cols-2" : ""} gap-6 mb-12`}>
                        {videos.map((url, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5 dark:shadow-black/30">
                                    <VideoPlaceholder videoUrl={url} title={`${competition.title} - Video ${idx + 1}`} />
                                </div>
                                {videos.length > 1 && (
                                    <p className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 pl-1">
                                        Video {idx + 1} of {videos.length}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-900/5 dark:shadow-black/30 mb-12">
                        <VideoPlaceholder videoUrl={null} title={competition.title} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                    Experience Story
                                </h2>
                            </div>
                            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                {story}
                            </p>
                        </div>

                        {participants.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-cyan-400" />
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                        Participants
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {participants.map((p, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80"
                                        >
                                            <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                                                {p.name?.charAt(0)?.toUpperCase() || "?"}
                                            </span>
                                            <div className="space-y-0.5 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                    {p.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                    NIM: {p.nim || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
                            <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Competition Info
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                        Organizer
                                    </span>
                                    <p className="text-slate-800 dark:text-slate-200 font-medium">{competition.organizer}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                        Achievement
                                    </span>
                                    <p className="text-slate-800 dark:text-slate-200 font-medium">{competition.achievement}</p>
                                </div>
                                {competition.lecturer && (
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                            Advisor / Lecturer
                                        </span>
                                        <p className="text-slate-800 dark:text-slate-200 font-medium">{competition.lecturer}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                        Year
                                    </span>
                                    <p className="text-slate-800 dark:text-slate-200 font-medium">{competition.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
