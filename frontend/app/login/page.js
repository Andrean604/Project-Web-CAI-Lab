"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const inputClass =
    "w-full min-h-[44px] px-3.5 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] bg-[var(--ds-surface)] text-[var(--ds-text)] text-sm";

export default function LoginPage() {
    const router = useRouter();
    const { role, ready, login, loginUser, logout } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        return <div className="min-h-[70vh]" />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
            <header className="text-center space-y-3">
                <h1 className="ds-heading text-3xl sm:text-4xl font-bold text-[var(--ds-text)]">Login</h1>
                <p className="ds-prose mx-auto text-[var(--ds-text-muted)]">
                    Silakan login terlebih dahulu untuk menjelajahi website. Masuk sebagai admin untuk mengelola data,
                    atau sebagai user untuk melihat saja.
                </p>
            </header>

            {role && (
                <div className="ds-card flex flex-col sm:flex-row items-center justify-between gap-3 p-4 text-sm">
                    <span className="text-[var(--ds-text)]">
                        Kamu sedang login sebagai <strong className="capitalize">{role}</strong>.
                    </span>
                    <button
                        type="button"
                        onClick={logout}
                        className="ds-press min-h-[44px] px-4 rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-sm font-medium text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin */}
                <form onSubmit={handleAdminLogin} className="ds-card p-6 space-y-5">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-[var(--ds-text)]">Admin</h2>
                        <p className="text-sm text-[var(--ds-text-muted)]">
                            Bisa menambah, mengedit, dan menghapus data.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-[var(--ds-text)] mb-1">
                            Email
                        </label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            spellCheck={false}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-[var(--ds-text)] mb-1">
                            Password
                        </label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            className={inputClass}
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="ds-press w-full min-h-[44px] rounded-[var(--ds-radius-control)] bg-[var(--ds-primary)] hover:brightness-110 disabled:opacity-60 text-white font-semibold text-sm transition"
                    >
                        {loading ? "Memproses…" : "Login sebagai Admin"}
                    </button>
                </form>

                {/* User */}
                <div className="ds-card p-6 flex flex-col justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-[var(--ds-text)]">User</h2>
                        <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed">
                            Hanya bisa melihat produk dan competition. Tombol tambah, edit, dan hapus tidak akan
                            ditampilkan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleUserLogin}
                        className="ds-press w-full min-h-[44px] rounded-[var(--ds-radius-control)] border border-[var(--ds-border)] text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] font-semibold text-sm transition-colors"
                    >
                        Masuk sebagai User
                    </button>
                </div>
            </div>

            {role && (
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center min-h-[44px] text-sm font-medium text-[var(--ds-accent)] hover:underline underline-offset-4"
                    >
                        Kembali ke Home
                    </Link>
                </div>
            )}
        </div>
    );
}
