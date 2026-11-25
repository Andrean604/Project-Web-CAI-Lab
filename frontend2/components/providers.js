"use client";
import { ThemeProvider } from "next-themes";
import { AuthProvider, AuthGate } from "@/components/AuthProvider";

export function Providers({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <AuthGate>{children}</AuthGate>
            </AuthProvider>
        </ThemeProvider>
    );
}
