// src/components/ui/TrackBadge.tsx
import { useState } from "react";
import Icon from "./Icon";

interface TrackBadgeProps {
    track: 1 | 2;
    triageReason?: string;
    showReasonInline?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export default function TrackBadge({
    track,
    triageReason,
    showReasonInline = false,
    size = "md",
    className = "",
}: TrackBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const isTrack1 = track === 1;

    const defaultReason = isTrack1
        ? "Routine incident — single perpetrator / direct jurisdiction. No syndicate signal detected."
        : "Complex network — multiple correlated accounts, burner phones, or cross-jurisdictional movement detected.";

    const reason = triageReason || defaultReason;

    const badgeClasses = isTrack1
        ? "bg-surface-200/90 text-surface-600 border-surface-300"
        : "bg-insignia-500/15 text-insignia-400 border-insignia-500/40 shadow-[0_0_12px_rgba(201,162,39,0.15)]";

    return (
        <div className={`relative inline-flex items-center gap-2 ${className}`}>
            <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`inline-flex items-center gap-1.5 rounded-md border font-mono text-xs font-bold uppercase tracking-wider cursor-help transition-all ${
                    size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1"
                } ${badgeClasses}`}
            >
                <Icon
                    name={isTrack1 ? "scale-justice" : "network-graph"}
                    size={size === "sm" ? 12 : 14}
                    className={isTrack1 ? "text-surface-400" : "text-insignia-400"}
                />
                <span>{isTrack1 ? "Track 1: Routine" : "Track 2: Complex Network"}</span>
            </div>

            {showReasonInline && (
                <span className="text-xs text-surface-400 truncate max-w-md hidden sm:inline">
                    {reason}
                </span>
            )}

            {/* Hover Tooltip for Triage Rationale */}
            {showTooltip && (
                <div className="absolute left-0 top-full mt-2 z-50 w-72 rounded-lg border border-surface-300 bg-surface-100 p-3 text-xs text-surface-700 shadow-xl pointer-events-none">
                    <div className="font-semibold text-surface-900 mb-1 flex items-center gap-1.5">
                        <Icon name="radar" size={13} className="text-insignia-400" />
                        <span>Case Triage Classification</span>
                    </div>
                    <p className="text-surface-600 leading-relaxed">{reason}</p>
                    <div className="mt-2 text-[10px] text-surface-500 border-t border-surface-200 pt-1.5 font-mono">
                        {isTrack1
                            ? "Standard single-jurisdiction protocol • Graph generation bypassed"
                            : "Multi-modality entity correlation active • GNN link prediction enabled"}
                    </div>
                </div>
            )}
        </div>
    );
}
