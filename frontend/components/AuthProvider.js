"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, TOKEN_KEY } from "@/lib/api";

const AuthContext = createContext(null);

const ROLE_KEY = "lab_auth_role";

export function AuthProvider({ children }) {
    const [role, setRole] = useState(null); // null | "user" | "admin"
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const savedRole = localStorage.getItem(ROLE_KEY);
            const token = localStorage.getItem(TOKEN_KEY);
            if (savedRole === "admin" && token) {
                setRole("admin");
            } else if (savedRole === "user") {
                setRole("user");
            } else {
                localStorage.removeItem(ROLE_KEY);
                localStorage.removeItem(TOKEN_KEY);
            }
        } catch (e) {
            // ignore storage errors
        }
        setReady(true);
    }, []);

    // Login ke backend (email + password).
    // Role ADMIN dari backend -> "admin", selain itu -> "user".
    const login = async (email, password) => {
        try {
            const data = await apiFetch("/api/auth/login", {
                method: "POST",
                body: { email, password },
            });
            const newRole = data.user?.role === "ADMIN" ? "admin" : "user";
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(ROLE_KEY, newRole);
            setRole(newRole);
            return { ok: true, role: newRole };
        } catch (e) {
            const message =
                e.status === 400 || e.status === 401
                    ? "Email atau password salah."
                    : e.message;
            return { ok: false, error: message };
        }
    };

    // Masuk sebagai pengunjung (tanpa token, hanya bisa melihat)
    const loginUser = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.setItem(ROLE_KEY, "user");
        setRole("user");
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
    };

    return (
        <AuthContext.Provider
            value={{ role, isAdmin: role === "admin", ready, login, loginUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
}

// Mengunci seluruh website: sebelum login, semua halaman selain /login
// akan dialihkan ke /login.
export function AuthGate({ children }) {
    const { role, ready } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/login";

    useEffect(() => {
        if (ready && !role && !isLoginPage) {
            router.replace("/login");
        }
    }, [ready, role, isLoginPage, router]);

    if (!ready || (!role && !isLoginPage)) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
    }

    return children;
}
