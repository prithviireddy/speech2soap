/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
        "./*.jsx",
    ],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#0066CC',
                'brand-accent': '#00D084',
                'bg-base': '#F8FAFC',
                'bg-secondary': '#FFFFFF',
                'text-primary': '#1A2332',
                'text-secondary': '#5A6B7D',
                'border-default': '#E2E8F0',
                'success': '#00D084',
                'warning': '#FFA500',
                'danger': '#FF4444',
                'medical': '#00A8E8',
                'info': '#0066CC',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px rgba(0, 0, 0, 0.07)',
                lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
