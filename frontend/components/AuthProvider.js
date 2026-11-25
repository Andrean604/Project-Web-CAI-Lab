"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext(null);

const STORAGE_KEY = "lab_auth_role";

// GANTI kredensial ini sesuai kebutuhan.
// Catatan: karena ini front end saja, kredensial ini terlihat di kode browser
// sehingga hanya cocok untuk demo/tugas, bukan keamanan sungguhan.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }) {
    const [role, setRole] = useState(null); // null | "user" | "admin"
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "admin" || saved === "user") {
                setRole(saved);
            }
        } catch (e) {
            // ignore storage errors
        }
        setReady(true);
    }, []);

    const loginAdmin = (username, password) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            setRole("admin");
            localStorage.setItem(STORAGE_KEY, "admin");
            return true;
        }
        return false;
    };

    const loginUser = () => {
        setRole("user");
        localStorage.setItem(STORAGE_KEY, "user");
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider
            value={{ role, isAdmin: role === "admin", ready, loginAdmin, loginUser, logout }}
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