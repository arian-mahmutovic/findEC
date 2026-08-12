import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            className={className}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="4.6" />
                    <rect x="11" y="1.5" width="2" height="3.4" rx="1" />
                    <rect x="11" y="19.1" width="2" height="3.4" rx="1" />
                    <rect x="1.5" y="11" width="3.4" height="2" rx="1" />
                    <rect x="19.1" y="11" width="3.4" height="2" rx="1" />
                    <rect x="3.5" y="3.5" width="2" height="3.4" rx="1" transform="rotate(-45 4.5 5.2)" />
                    <rect x="18.5" y="17" width="2" height="3.4" rx="1" transform="rotate(-45 19.5 18.7)" />
                    <rect x="18.5" y="3.5" width="2" height="3.4" rx="1" transform="rotate(45 19.5 5.2)" />
                    <rect x="3.5" y="17" width="2" height="3.4" rx="1" transform="rotate(45 4.5 18.7)" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
                </svg>
            )}
        </button>
    );
}
