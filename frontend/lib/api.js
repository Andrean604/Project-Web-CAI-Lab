// Taruh di: lib/api.js (ganti)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
export const TOKEN_KEY = "lab_auth_token";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export function getToken() {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
        return null;
    }
}

async function request(path, { method = "GET", headers = {}, body } = {}) {
    const finalHeaders = { ...headers };
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;

    let res;
    try {
        res = await fetch(`${API_URL}${path}`, { method, headers: finalHeaders, body });
    } catch (e) {
        throw new ApiError(
            "Tidak bisa terhubung ke server. Pastikan backend sudah berjalan.",
            0
        );
    }

    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        // balasan tanpa isi JSON
    }

    if (!res.ok) {
        const message =
            (data && (data.message || data.error)) || `Permintaan gagal (${res.status})`;
        throw new ApiError(message, res.status);
    }

    return data;
}

// Permintaan JSON biasa
export function apiFetch(path, { method = "GET", body } = {}) {
    return request(path, {
        method,
        headers: body !== undefined ? { "Content-Type": "application/json" } : {},
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
}

// Unggah file (FormData). Content-Type diatur browser, jangan diisi manual.
export function apiUpload(path, formData, method = "POST") {
    return request(path, { method, body: formData });
}

// Alamat gambar: "/uploads/xxx.jpg" dari backend diubah jadi alamat lengkap
export function assetUrl(path) {
    if (!path) return "";
    if (/^(https?:|data:|blob:)/.test(path)) return path;
    return `${API_URL}${path}`;
}