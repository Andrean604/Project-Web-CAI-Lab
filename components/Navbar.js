"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home", exact: true },
        { href: "/products", label: "Products", exact: false },
        { href: "/about", label: "About", exact: true },
        { href: "/competitions", label: "Competitions", exact: true },
    ];

    const isActive = (href, exact) => {
        return exact ? pathname === href : pathname.startsWith(href);
    };

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-mono font-black text-sm shadow-md">
                        AI
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                        Computing & <span className="text-indigo-600 dark:text-cyan-400">AI Lab</span>
                    </span>
                </Link>

                {/* Navigation (Desktop) */}
                <nav className="hidden md:flex items-center gap-6 font-medium text-xs sm:text-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={
                                isActive(link.href, link.exact)
                                    ? "text-indigo-600 dark:text-cyan-400 font-semibold"
                                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Theme Toggle & Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <Link
                        href="/products"
                        className="hidden sm:inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                    >
                        Explore Catalog
                    </Link>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        type="button"
                        className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1.5 transition-all">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href, link.exact)
                                ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="pt-2 sm:hidden">
                        <Link
                            href="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-center px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                        >
                            Explore Catalog
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}