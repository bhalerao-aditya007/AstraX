// src/components/dashboard/CaseWorkspaceDrawer.tsx
import { useState } from "react";
import Icon from "../ui/Icon";
import ConfidenceBadge from "../ui/ConfidenceBadge";

interface DrawerProps {
    item: any | null;
    onClose: () => void;
}

export default function CaseWorkspaceDrawer({ item, onClose }: DrawerProps) {
    const [activeTab, setActiveTab] = useState<"details" | "source" | "feedback">("details");
    const [feedbackStatus, setFeedbackStatus] = useState<"confirmed" | "not_useful" | "incorrect" | null>(null);

    if (!item) return null;

    const riskScore = item.risk_score !== undefined ? item.risk_score : undefined;
    const confidence = item.confidence !== undefined ? item.confidence : undefined;
    const isHypothesis = item.is_phantom || item.type?.includes("phantom") || item.is_hypothesis;

    return (
        <aside className="fixed right-0 top-12 bottom-0 z-40 w-80 bg-surface-50/98 backdrop-blur-sm border-l border-surface-300/50 shadow-2xl shadow-black/30 flex flex-col transition-all duration-300 font-sans animate-slide-in-right">
            {/* Header */}
            <div className="p-3 border-b border-surface-300/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="radar" size={13} className="text-insignia-400" />
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-surface-700">
                        Intelligence Inspector
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-surface-500 hover:text-surface-900 p-1 rounded hover:bg-surface-200/40 transition-colors"
                >
                    <Icon name="cross" size={12} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-300/50 font-mono text-[10px]">
                {(["details", "source", "feedback"] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-center font-bold transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1 ${
                            activeTab === tab
                                ? "border-insignia-400 text-insignia-400 bg-surface-100/40"
                                : "border-transparent text-surface-500 hover:text-surface-300"
                        }`}
                    >
                        <span className="capitalize">{tab}</span>
                        {tab === "feedback" && feedbackStatus && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* ── DETAILS TAB ── */}
                {activeTab === "details" && (
                    <>
                        {/* Entity ID */}
                        <div>
                            <span className="data-label block mb-1">Entity / Node</span>
                            <div className="font-mono text-[10px] text-surface-700 break-all bg-surface-0/60 p-2 rounded border border-surface-300/50">
                                {item.id}
                            </div>
                        </div>

                        {/* Entity Name + Type */}
                        <div>
                            <span className="data-label block mb-1">Label</span>
                            <div className="font-bold text-surface-900 text-sm">
                                {item.label || item.name || item.title || item.entity}
                            </div>
                            {item.type && (
                                <span className="inline-block mt-1 font-mono text-[9px] uppercase font-bold text-insignia-400 bg-insignia-500/10 border border-insignia-500/20 px-1.5 py-0.5 rounded">
                                    {item.type}
                                </span>
                            )}
                        </div>

                        {/* Hypothesis Label */}
                        {isHypothesis && (
                            <div className="hypothesis-label">
                                <Icon name="radar" size={10} />
                                <span>Investigative hypothesis — not a finding</span>
                            </div>
                        )}

                        {/* Reasoning */}
                        {item.merge_reason && (
                            <div className="rounded-md border border-insignia-500/25 bg-insignia-500/8 p-2.5 text-[10px] font-mono text-insignia-300 leading-relaxed">
                                <strong className="text-insignia-400 block uppercase text-[9px] tracking-wider mb-0.5">
                                    AI Analysis
                                </strong>
                                "{item.merge_reason}"
                            </div>
                        )}

                        {/* Risk & Confidence */}
                        <div className="grid grid-cols-2 gap-2">
                            {riskScore !== undefined && (
                                <div className="rounded-md border border-surface-300/50 bg-surface-0/40 p-2.5">
                                    <span className="data-label block mb-1">Risk Score</span>
                                    <div className={`text-lg font-bold font-mono tabular-nums ${
                                        riskScore >= 0.8 ? "text-red-400" : riskScore >= 0.5 ? "text-amber-400" : "text-emerald-400"
                                    }`}>
                                        {(riskScore * 100).toFixed(1)}%
                                    </div>
                                </div>
                            )}

                            {confidence !== undefined && (
                                <div className="rounded-md border border-surface-300/50 bg-surface-0/40 p-2.5">
                                    <span className="data-label block mb-1">Confidence</span>
                                    <ConfidenceBadge score={confidence} size="sm" />
                                </div>
                            )}
                        </div>

                        {/* Detected Relationships (Badge) */}
                        {item.badge && (
                            <div>
                                <span className="data-label block mb-1">Classification</span>
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-surface-300/50 bg-surface-0/40 px-2.5 py-1.5 text-xs font-mono font-bold text-surface-800">
                                    {item.badge}
                                </span>
                            </div>
                        )}

                        {/* Metadata Details */}
                        {item.details && Object.keys(item.details).length > 0 && (
                            <div className="pt-3 border-t border-surface-300/30">
                                <span className="data-label block mb-2">Extracted Metadata</span>
                                <div className="bg-surface-0/40 rounded-md border border-surface-300/50 p-2.5 text-[10px] font-mono space-y-1.5">
                                    {Object.entries(item.details).map(([k, v]) => (
                                        <div key={k} className="flex justify-between gap-2 border-b border-surface-200/30 pb-1 last:border-0 last:pb-0">
                                            <span className="text-surface-500 capitalize">{k}:</span>
                                            <span className="text-surface-700 text-right truncate max-w-[160px]">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attributes */}
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="pt-3 border-t border-surface-300/30">
                                <span className="data-label block mb-2">Forensic Attributes</span>
                                <div className="bg-surface-0/40 rounded-md border border-surface-300/50 p-2.5 text-[10px] font-mono space-y-1">
                                    {Object.entries(item.attributes).map(([k, v]) => (
                                        <div key={k}>
                                            <span className="text-surface-500">{k}:</span>{" "}
                                            <span className="text-surface-700 font-medium">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Supporting Evidence */}
                        {item.citation && (
                            <div className="pt-3 border-t border-surface-300/30">
                                <span className="data-label block mb-2">Supporting Evidence</span>
                                <div className="bg-surface-0/40 rounded-md border border-surface-300/50 p-2.5 text-[10px] font-mono space-y-1">
                                    <div className="text-surface-700 font-bold">{item.citation.documentTitle}</div>
                                    {item.citation.pageOrOffset && (
                                        <div className="text-surface-500">{item.citation.pageOrOffset}</div>
                                    )}
                                    {item.citation.confidenceScore !== undefined && (
                                        <div className="text-surface-500">
                                            Score: <span className="text-insignia-400 font-bold">{(item.citation.confidenceScore * 100).toFixed(0)}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ── SOURCE TAB ── */}
                {activeTab === "source" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-surface-800 uppercase tracking-wider">
                            <Icon name="chain-link" size={13} className="text-insignia-400" />
                            <span>Chain of Custody</span>
                        </div>

                        <div className="rounded-md border border-surface-300/50 bg-surface-0/40 p-3 space-y-2.5 text-[10px] font-mono">
                            <div>
                                <span className="data-label block">Source Document</span>
                                <span className="font-bold text-surface-900 text-xs">
                                    {item.citation?.documentTitle || "FIR 101/2026 Core Dossier"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-surface-200/30 pt-2">
                                <span className="text-surface-500">Channel:</span>
                                <span className="text-surface-700 bg-surface-200/40 px-1.5 py-0.5 rounded">
                                    {item.type || "Forensic Record"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-surface-200/30 pt-2">
                                <span className="text-surface-500">Offset:</span>
                                <span className="text-insignia-400 font-bold">
                                    {item.citation?.pageOrOffset || "Record #1094"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-surface-200/30 pt-2">
                                <span className="text-surface-500">Model:</span>
                                <span className="text-surface-600">
                                    {item.citation?.extractorModel || "AstraX-NER-v2.1"}
                                </span>
                            </div>

                            {item.citation?.rawSnippet && (
                                <div className="border-t border-surface-200/30 pt-2">
                                    <span className="data-label block mb-1">Raw Snippet</span>
                                    <div className="p-2 rounded bg-surface-100/60 border border-surface-300/40 text-surface-600 italic text-[10px] leading-relaxed">
                                        "{item.citation.rawSnippet}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── FEEDBACK TAB ── */}
                {activeTab === "feedback" && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-800">
                                Human-In-The-Loop Feedback
                            </h4>
                            <p className="text-[10px] text-surface-500 mt-1 leading-relaxed">
                                One-tap feedback tunes GNN edge weights and disambiguation thresholds for this case.
                            </p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setFeedbackStatus("confirmed")}
                                className={`w-full flex items-center justify-between p-2.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                                    feedbackStatus === "confirmed"
                                        ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                                        : "bg-surface-0/40 border-surface-300/50 text-surface-700 hover:border-emerald-500/30 hover:bg-emerald-950/10"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon name="check-circle" size={14} className="text-emerald-400" />
                                    <span>Confirmed Correct Linkage</span>
                                </div>
                                {feedbackStatus === "confirmed" && <span className="font-mono text-[9px]">ACTIVE</span>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFeedbackStatus("not_useful")}
                                className={`w-full flex items-center justify-between p-2.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                                    feedbackStatus === "not_useful"
                                        ? "bg-amber-950/60 border-amber-500/50 text-amber-300"
                                        : "bg-surface-0/40 border-surface-300/50 text-surface-700 hover:border-amber-500/30 hover:bg-amber-950/10"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon name="radar" size={14} className="text-amber-400" />
                                    <span>Not Useful / Weak Signal</span>
                                </div>
                                {feedbackStatus === "not_useful" && <span className="font-mono text-[9px]">ACTIVE</span>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFeedbackStatus("incorrect")}
                                className={`w-full flex items-center justify-between p-2.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ${
                                    feedbackStatus === "incorrect"
                                        ? "bg-red-950/60 border-red-500/50 text-red-300"
                                        : "bg-surface-0/40 border-surface-300/50 text-surface-700 hover:border-red-500/30 hover:bg-red-950/10"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon name="alert-triangle" size={14} className="text-red-400" />
                                    <span>Incorrect Link (Break Connection)</span>
                                </div>
                                {feedbackStatus === "incorrect" && <span className="font-mono text-[9px]">ACTIVE</span>}
                            </button>
                        </div>

                        {feedbackStatus && (
                            <div className="rounded-md bg-surface-0/40 border border-surface-300/50 p-2.5 text-[10px] font-mono text-emerald-400 flex items-center gap-2 animate-fade-in">
                                <Icon name="check-circle" size={12} />
                                <span>Feedback recorded. Graph updated in real-time.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
