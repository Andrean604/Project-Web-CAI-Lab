"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
    const router = useRouter();
    const { role, ready, login, loginUser, logout } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(email.trim(), password);
        setLoading(false);
        if (result.ok) {
            router.push("/");
        } else {
            setError(result.error);
        }
    };

    const handleUserLogin = () => {
        loginUser();
        router.push("/");
    };

    if (!ready) {
        return <div className="min-h-[70vh] bg-slate-50 dark:bg-slate-950" />;
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-[80vh] py-14 transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                        ACCOUNT ACCESS
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Login
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Silakan login terlebih dahulu untuk menjelajahi website. Masuk sebagai admin untuk mengelola data, atau sebagai user untuk melihat saja.
                    </p>
                </div>

                {role && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-sm">
                        <span className="text-slate-700 dark:text-slate-300">
                            Kamu sedang login sebagai{" "}
                            <strong className="text-indigo-700 dark:text-cyan-400 uppercase">{role}</strong>.
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Admin */}
                    <form
                        onSubmit={handleAdminLogin}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                    >
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Bisa menambah, mengedit, dan menghapus data.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-colors"
                        >
                            {loading ? "Memproses..." : "Login sebagai Admin"}
                        </button>
                    </form>

                    {/* User */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">User</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Hanya bisa melihat produk dan competition. Tombol tambah, edit, dan hapus tidak akan ditampilkan.
                            </p>
                        </div>

                        <button
                            onClick={handleUserLogin}
                            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
                        >
                            Masuk sebagai User
                        </button>
                    </div>
                </div>

                {role && (
                    <div className="text-center">
                        <Link
                            href="/"
                            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                        >
                            Kembali ke Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}