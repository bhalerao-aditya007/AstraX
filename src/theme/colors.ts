// src/theme/colors.ts

/**
 * AstraX Tactical "Dark Ops Room" Semantic Palette
 * Domain Rule: Semantic colors are fixed everywhere, never repurposed.
 * Green = confirmed / evidentiary
 * Red = high-risk / incident / anomaly
 * Amber = pattern-alert / pending / warning
 * Gold = official insignia / primary accents
 * Violet = GNN hypothesis / suspected link
 * Slate = neutral / unknown / background
 */

export const SEMANTIC_COLORS = {
    // Evidentiary & Confirmed
    confirmed: {
        base: "#10b981",
        light: "#34d399",
        dark: "#059669",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.35)",
        text: "#6ee7b7",
    },
    // High Risk & Incident
    risk: {
        base: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
        bg: "rgba(239, 68, 68, 0.12)",
        border: "rgba(239, 68, 68, 0.35)",
        text: "#fca5a5",
    },
    // Pattern Alert & Pending
    alert: {
        base: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.35)",
        text: "#fde68a",
    },
    // Official Insignia / Primary Action
    insignia: {
        base: "#c9a227",
        gold: "#d4af37",
        light: "#e2be4a",
        dark: "#9a7c1b",
        bg: "rgba(201, 162, 39, 0.12)",
        border: "rgba(201, 162, 39, 0.35)",
        text: "#f2d378",
    },
    // GNN Hypothesis / Predicted Links / Phantom Entities
    hypothesis: {
        base: "#8b5cf6",
        light: "#a78bfa",
        dark: "#7c3aed",
        bg: "rgba(139, 92, 246, 0.14)",
        border: "rgba(139, 92, 246, 0.45)",
        text: "#c4b5fd",
    },
    // Neutral & Unknown
    neutral: {
        base: "#64748b",
        light: "#94a3b8",
        dark: "#475569",
        bg: "rgba(100, 116, 139, 0.12)",
        border: "rgba(100, 116, 139, 0.25)",
        text: "#cbd5e1",
    },
    // Technical / Cyber Blue
    tech: {
        base: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
        bg: "rgba(59, 130, 246, 0.12)",
        border: "rgba(59, 130, 246, 0.35)",
        text: "#93c5fd",
    },
};

/**
 * Graph Entity Node Styling by Domain Theme
 */
export const NODE_THEME_COLORS: Record<string, Record<string, { fill: string; stroke: string; glow: string }>> = {
    financial: {
        company: { fill: "#059669", stroke: "#10b981", glow: "#05966980" },
        bank_account: { fill: "#10b981", stroke: "#34d399", glow: "#10b98180" },
        person: { fill: "#34d399", stroke: "#6ee7b7", glow: "#34d39980" },
        phone: { fill: "#059669", stroke: "#10b981", glow: "#05966980" },
        wallet: { fill: "#047857", stroke: "#059669", glow: "#04785780" },
        device: { fill: "#6ee7b7", stroke: "#a7f3d0", glow: "#6ee7b780" },
        default: { fill: "#10b981", stroke: "#34d399", glow: "#10b98180" },
    },
    digital: {
        company: { fill: "#0284c7", stroke: "#38bdf8", glow: "#0284c780" },
        bank_account: { fill: "#0ea5e9", stroke: "#7dd3fc", glow: "#0ea5e980" },
        person: { fill: "#38bdf8", stroke: "#bae6fd", glow: "#38bdf880" },
        phone: { fill: "#0ea5e9", stroke: "#7dd3fc", glow: "#0ea5e980" },
        wallet: { fill: "#0369a1", stroke: "#38bdf8", glow: "#0369a180" },
        device: { fill: "#0284c7", stroke: "#38bdf8", glow: "#0284c780" },
        default: { fill: "#38bdf8", stroke: "#7dd3fc", glow: "#38bdf880" },
    },
    communication: {
        company: { fill: "#7c3aed", stroke: "#a78bfa", glow: "#7c3aed80" },
        bank_account: { fill: "#8b5cf6", stroke: "#c4b5fd", glow: "#8b5cf680" },
        person: { fill: "#a78bfa", stroke: "#ddd6fe", glow: "#a78bfa80" },
        phone: { fill: "#6d28d9", stroke: "#a78bfa", glow: "#6d28d980" },
        wallet: { fill: "#5b21b6", stroke: "#8b5cf6", glow: "#5b21b680" },
        device: { fill: "#8b5cf6", stroke: "#c4b5fd", glow: "#8b5cf680" },
        default: { fill: "#a78bfa", stroke: "#ddd6fe", glow: "#a78bfa80" },
    },
    evidence: {
        company: { fill: "#d97706", stroke: "#fbbf24", glow: "#d9770680" },
        bank_account: { fill: "#f59e0b", stroke: "#fde68a", glow: "#f59e0b80" },
        person: { fill: "#fbbf24", stroke: "#fef3c7", glow: "#fbbf2480" },
        phone: { fill: "#b45309", stroke: "#fbbf24", glow: "#b4530980" },
        wallet: { fill: "#92400e", stroke: "#d97706", glow: "#92400e80" },
        device: { fill: "#f59e0b", stroke: "#fde68a", glow: "#f59e0b80" },
        default: { fill: "#fbbf24", stroke: "#fde68a", glow: "#fbbf2480" },
    },
    default: {
        company: { fill: "#f59e0b", stroke: "#fbbf24", glow: "#f59e0b80" },
        bank_account: { fill: "#10b981", stroke: "#34d399", glow: "#10b98180" },
        person: { fill: "#3b82f6", stroke: "#60a5fa", glow: "#3b82f680" },
        phone: { fill: "#8b5cf6", stroke: "#a78bfa", glow: "#8b5cf680" },
        wallet: { fill: "#f43f5e", stroke: "#fb7185", glow: "#f43f5e80" },
        device: { fill: "#64748b", stroke: "#94a3b8", glow: "#64748b80" },
        phantom: { fill: "#6d28d9", stroke: "#c4b5fd", glow: "#8b5cf680" },
        default: { fill: "#94a3b8", stroke: "#cbd5e1", glow: "#94a3b880" },
    },
};
