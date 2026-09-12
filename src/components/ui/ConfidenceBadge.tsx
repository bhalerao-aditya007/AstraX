// src/components/ui/ConfidenceBadge.tsx

export type ConfidenceTier = "strong" | "possible" | "hypothesis";

interface ConfidenceBadgeProps {
    /** Value between 0 and 1 (e.g. 0.92) or 0 and 100 (e.g. 92) */
    score: number;
    showPercentage?: boolean;
    className?: string;
    size?: "sm" | "md";
}

export function getConfidenceTier(score: number): {
    tier: ConfidenceTier;
    label: string;
    percentage: number;
    badgeStyle: string;
    dotStyle: string;
} {
    // Normalize to 0-100
    const normalized = score > 1 ? Math.min(100, Math.round(score)) : Math.min(100, Math.round(score * 100));

    if (normalized >= 85) {
        return {
            tier: "strong",
            label: "strong evidence",
            percentage: normalized,
            badgeStyle: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40",
            dotStyle: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
        };
    } else if (normalized >= 60) {
        return {
            tier: "possible",
            label: "possible lead",
            percentage: normalized,
            badgeStyle: "bg-amber-950/70 text-amber-300 border-amber-500/40",
            dotStyle: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
        };
    } else {
        return {
            tier: "hypothesis",
            label: "unconfirmed hypothesis",
            percentage: normalized,
            badgeStyle: "bg-purple-950/70 text-purple-300 border-purple-500/40 border-dashed",
            dotStyle: "bg-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]",
        };
    }
}

export default function ConfidenceBadge({
    score,
    showPercentage = true,
    className = "",
    size = "sm",
}: ConfidenceBadgeProps) {
    const { label, percentage, badgeStyle, dotStyle } = getConfidenceTier(score);

    const sizeClasses = size === "sm" 
        ? "px-2.5 py-0.5 text-xs" 
        : "px-3 py-1 text-xs font-semibold";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight ${sizeClasses} ${badgeStyle} ${className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
            <span className="capitalize">{label}</span>
            {showPercentage && (
                <span className="font-mono text-[11px] opacity-85">({percentage}%)</span>
            )}
        </span>
    );
}
