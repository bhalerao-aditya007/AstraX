// src/theme/tokens.ts

/**
 * AstraX "Dark Ops Room" Theme Tokens
 * Base surfaces: Near-black slate ramp
 */
export const THEME_TOKENS = {
    surfaces: {
        0: "#0b0f14",    // darkest canvas / body background
        50: "#10151c",   // base panel background
        100: "#161c25",  // card / container background
        200: "#202936",  // elevated card / secondary container
        300: "#2d3848",  // subtle borders & dividers
        400: "#475569",  // stronger borders & disabled text
        500: "#64748b",  // muted / secondary text
        600: "#94a3b8",  // body text / standard labels
        700: "#cbd5e1",  // bright text / high-contrast labels
        800: "#e2e8f0",  // prominent headings
        900: "#f8fafc",  // near-white primary text / highlights
    },
    accents: {
        insignia: "#c9a227", // primary gold/amber insignia accent
        insigniaHover: "#dfb738",
        tech: "#3b82f6",     // technical/informational cyber blue
        techHover: "#60a5fa",
    },
    fonts: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    radii: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
    },
};
