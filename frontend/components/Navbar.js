"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { role, ready, logout } = useAuth();

    const navLinks = [
        { href: "/", label: "Home", exact: true },
        { href: "/products", label: "Products", exact: false },
        { href: "/about", label: "About", exact: true },
        { href: "/competitions", label: "Competitions", exact: false },
    ];

    const isActive = (href, exact) => {
        return exact ? pathname === href : pathname.startsWith(href);
    };

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        router.push("/");
    };

    const outlineButton =
        "ds-press items-center justify-center min-h-[44px] px-4 text-xs font-semibold rounded-xl border border-[var(--ds-border)] text-[var(--ds-text)] hover:bg-[var(--ds-surface-muted)] transition-colors";

    return (
        <header className="ds-glass sticky top-0 z-50 border-b border-[var(--ds-border)] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="ds-press flex items-center gap-2.5 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-mono font-black text-sm shadow-md">
                        AI
                    </div>
                    <span translate="no" className="font-bold text-[var(--ds-text)] tracking-tight text-base sm:text-lg">
                        Computing & <span className="text-[var(--ds-accent)]">AI Lab</span>
                    </span>
                </Link>

                {/* Navigation (Desktop) */}
                {role && (
                    <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main">
                        {navLinks.map((link) => {
                            const active = isActive(link.href, link.exact);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative h-16 px-3 inline-flex items-center rounded-lg focus-visible:-outline-offset-4 transition-colors ${
                                        active
                                            ? "text-[var(--ds-accent)] font-semibold"
                                            : "text-[var(--ds-text-muted)] hover:text-[var(--ds-text)]"
                                    }`}
                                >
                                    {link.label}
                                    {active && (
                                        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--ds-accent)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* Theme Toggle & Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    {ready && role ? (
                        <div className="hidden sm:flex items-center gap-2">
                            <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border ${
                                    role === "admin"
                                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50"
                                        : "bg-[var(--ds-surface-muted)] text-[var(--ds-text-muted)] border-[var(--ds-border)]"
                                }`}
                            >
                                {role}
                            </span>
                            <button onClick={handleLogout} className={outlineButton}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        ready &&
                        pathname !== "/login" && (
                            <Link href="/login" className={`hidden sm:inline-flex ${outlineButton}`}>
                                Login
                            </Link>
                        )
                    )}

                    {role && (
                        <Link
                            href="/products"
                            className="ds-press hidden sm:inline-flex items-center justify-center min-h-[44px] px-4 text-xs font-semibold rounded-xl bg-[var(--ds-primary)] hover:brightness-110 text-white shadow-sm transition"
                        >
                            Explore Catalog
                        </Link>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        type="button"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        className={`${role ? "md:hidden inline-flex" : "hidden"} ds-press w-11 h-11 items-center justify-center rounded-xl text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)] transition-colors`}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {role && isMobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className="ds-enter md:hidden border-t border-[var(--ds-border)] px-4 pt-2 pb-4 space-y-1"
                >
                    {navLinks.map((link) => {
                        const active = isActive(link.href, link.exact);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-[var(--ds-surface-muted)] text-[var(--ds-accent)] font-semibold"
                                        : "text-[var(--ds-text-muted)] hover:bg-[var(--ds-surface-muted)]"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    <div className="pt-2 space-y-2 sm:hidden">
                        {ready && (
                            <button onClick={handleLogout} className={`w-full ${outlineButton}`}>
                                Logout ({role})
                            </button>
                        )}
                        <Link
                            href="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="ds-press flex items-center justify-center min-h-[44px] w-full text-xs font-semibold rounded-xl bg-[var(--ds-primary)] hover:brightness-110 text-white shadow-sm transition"
                        >
                            Explore Catalog
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
