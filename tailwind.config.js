/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode : "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: "#0F172A",
                    primary: "#4F46E5",
                    cyan: "#06B6D4",
                },
            },
        },
    },
    plugins: [],
};