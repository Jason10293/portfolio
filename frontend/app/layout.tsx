import React, {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Link } from "../lib/router";
import SpotifyWidget from "../components/SpotifyWidget";

type Theme = "light" | "dark";

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z" />
    <line x1="12" y1="1.5" x2="12" y2="3.5" />
    <line x1="12" y1="20.5" x2="12" y2="22.5" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1.5" y1="12" x2="3.5" y2="12" />
    <line x1="20.5" y1="12" x2="22.5" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20.5 15.5a7.5 7.5 0 1 1-8-12 8.5 8.5 0 0 0 8 12z" />
  </svg>
);

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Layout({ children }: { children: ReactNode }) {
  const [rotation, setRotation] = useState(0);
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 45) % 360);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    window.localStorage?.setItem("theme", theme);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const bgColor = "bg-white dark:bg-neutral-950";
  const primaryText = "text-neutral-900 dark:text-neutral-100";
  const secondaryText = "text-neutral-500 dark:text-neutral-400";
  const accentText = "text-neutral-400 dark:text-neutral-500";

  const themeIcon = useMemo(
    () => (theme === "dark" ? <SunIcon /> : <MoonIcon />),
    [theme]
  );
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <div
      className={`min-h-screen ${bgColor} p-8 md:p-12 lg:p-24 overflow-x-hidden relative font-mono text-sm leading-relaxed selection:bg-neutral-900 selection:text-white transition-colors duration-700`}
    >
      {/* Stylistic: Rotating Element */}
      <div
        className={`fixed top-8 right-8 ${accentText} text-lg transition-transform duration-700 pointer-events-none z-50`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        ❋
      </div>

      {/* Stylistic: Bottom Left Decal */}
      <div
        className={`fixed bottom-12 left-12 hidden lg:flex flex-col gap-0.5 ${accentText} text-[10px] opacity-40 select-none font-light pointer-events-none z-50`}
      >
        <span>REF: 0042</span>
        <span className="tracking-widest">:::::</span>
        <span>X—Y AXIS</span>
      </div>

      <main className="max-w-4xl mx-auto relative z-10">
        {/* Navigation / Header */}
        <header className="mb-10 flex flex-col gap-8 md:flex-row md:justify-between md:items-end">
          <div>
            <h1
              className={`text-xl font-bold tracking-tight mb-2 ${primaryText} flex items-center gap-2`}
            >
              Jason Wu
            </h1>
            <p className={`${secondaryText} text-xs mb-3`}>
              CS Student &amp; Full-Stack Developer
            </p>
            <SpotifyWidget variant="minimal" />
          </div>

          <nav className="flex gap-4 items-center">
            <Link
              href="/"
              className="uppercase tracking-widest text-xs underline-offset-4 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/music"
              className="uppercase tracking-widest text-xs underline-offset-4 transition-colors"
            >
              Music
            </Link>
            <button
              type="button"
              aria-label="Toggle theme"
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-100"
              title={`Switch to ${nextTheme} mode`}
            >
              {themeIcon}
              <span className="sr-only">Switch to {nextTheme} mode</span>
            </button>
          </nav>
        </header>

        {children}
      </main>
    </div>
  );
}
