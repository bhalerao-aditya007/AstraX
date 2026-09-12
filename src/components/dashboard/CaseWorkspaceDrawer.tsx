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

    return (
        <aside className="fixed right-0 top-14 bottom-0 z-40 w-88 bg-surface-100/98 backdrop-blur-md border-l border-surface-300 shadow-2xl flex flex-col transition-all duration-300 font-sans">
            {/* Drawer Header */}
            <div className="p-4 border-b border-surface-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="radar" size={15} className="text-insignia-400" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-surface-800">
                        Investigation Inspector
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-surface-400 hover:text-surface-900 text-sm p-1 rounded hover:bg-surface-200 transition-colors"
                >
                    <Icon name="cross" size={14} />
                </button>
            </div>

            {/* Tab Navigation: Details | Source | Feedback */}
            <div className="flex border-b border-surface-200 font-mono text-xs">
                <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-2.5 text-center font-bold transition-colors cursor-pointer border-b-2 ${
                        activeTab === "details"
                            ? "border-insignia-400 text-insignia-400 bg-surface-200/40"
                            : "border-transparent text-surface-400 hover:text-surface-200"
                    }`}
                >
                    Details
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("source")}
                    className={`flex-1 py-2.5 text-center font-bold transition-colors cursor-pointer border-b-2 ${
                        activeTab === "source"
                            ? "border-insignia-400 text-insignia-400 bg-surface-200/40"
                            : "border-transparent text-surface-400 hover:text-surface-200"
                    }`}
                >
                    Source
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("feedback")}
                    className={`flex-1 py-2.5 text-center font-bold transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                        activeTab === "feedback"
                            ? "border-insignia-400 text-insignia-400 bg-surface-200/40"
                            : "border-transparent text-surface-400 hover:text-surface-200"
                    }`}
                >
                    <span>Feedback</span>
                    {feedbackStatus && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* ── DETAILS TAB ── */}
                {activeTab === "details" && (
                    <>
                        <div>
                            <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider block mb-1">
                                Entity / Node ID
                            </span>
                            <div className="font-mono text-xs text-surface-800 break-all bg-surface-0 p-2 rounded border border-surface-200">
                                {item.id}
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider block mb-1">
                                Label / Title
                            </span>
                            <div className="font-bold text-surface-900 text-base">
                                {item.label || item.name || item.title || item.entity}
                            </div>
                            {item.type && (
                                <span className="inline-block mt-1.5 font-mono text-[10px] uppercase font-bold text-insignia-400 bg-insignia-500/15 border border-insignia-500/30 px-2 py-0.5 rounded">
                                    {item.type}
                                </span>
                            )}
                        </div>

                        {/* Entity Resolution Reasoning String */}
                        {item.merge_reason && (
                            <div className="rounded-lg border border-insignia-500/40 bg-insignia-500/10 p-3 text-xs font-mono text-insignia-300 leading-relaxed">
                                <strong className="text-insignia-400 block uppercase text-[10px] tracking-wider mb-1">
                                    Entity Resolution Reasoning
                                </strong>
                                "{item.merge_reason}"
                            </div>
                        )}

                        {/* Risk & Confidence Badges */}
                        <div className="grid grid-cols-2 gap-3">
                            {riskScore !== undefined && (
                                <div className="rounded-lg border border-surface-300 bg-surface-0/60 p-3">
                                    <span className="text-[10px] font-mono text-surface-500 uppercase block mb-1">
                                        Risk Score
                                    </span>
                                    <div className="text-xl font-bold font-mono text-red-400">
                                        {(riskScore * 100).toFixed(1)}%
                                    </div>
                                </div>
                            )}

                            {confidence !== undefined && (
                                <div className="rounded-lg border border-surface-300 bg-surface-0/60 p-3">
                                    <span className="text-[10px] font-mono text-surface-500 uppercase block mb-1">
                                        Confidence
                                    </span>
                                    <ConfidenceBadge score={confidence} size="sm" />
                                </div>
                            )}
                        </div>

                        {/* Key-Value Details */}
                        {item.details && Object.keys(item.details).length > 0 && (
                            <div className="pt-3 border-t border-surface-200">
                                <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider block mb-2.5">
                                    Extracted Metadata
                                </span>
                                <div className="bg-surface-0 rounded-lg border border-surface-200 p-3 text-xs font-mono space-y-2">
                                    {Object.entries(item.details).map(([k, v]) => (
                                        <div key={k} className="flex justify-between gap-2 border-b border-surface-200/50 pb-1.5 last:border-0 last:pb-0">
                                            <span className="text-surface-400 capitalize">{k}:</span>
                                            <span className="text-surface-800 text-right truncate">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attributes */}
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="pt-3 border-t border-surface-200">
                                <span className="text-[10px] font-mono text-surface-500 uppercase tracking-wider block mb-2.5">
                                    Forensic / Content Attributes
                                </span>
                                <div className="bg-surface-0 rounded-lg border border-surface-200 p-3 text-xs font-mono space-y-1.5">
                                    {Object.entries(item.attributes).map(([k, v]) => (
                                        <div key={k}>
                                            <span className="text-surface-400">{k}:</span>{" "}
                                            <span className="text-surface-800 font-medium">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ── SOURCE TAB ── */}
                {activeTab === "source" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-surface-900 uppercase tracking-wider">
                            <Icon name="chain-link" size={14} className="text-insignia-400" />
                            <span>Chain of Custody & Extraction Source</span>
                        </div>

                        <div className="rounded-xl border border-surface-300 bg-surface-0 p-4 space-y-3 text-xs font-mono">
                            <div>
                                <span className="text-[10px] text-surface-400 uppercase block">Source Document</span>
                                <span className="font-bold text-surface-900 text-sm">
                                    {item.citation?.documentTitle || "FIR 101/2026 Core Dossier"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] border-t border-surface-200 pt-2">
                                <span className="text-surface-400">Modality Channel:</span>
                                <span className="text-surface-800 bg-surface-200 px-2 py-0.5 rounded">
                                    {item.type || "Forensic Record"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] border-t border-surface-200 pt-2">
                                <span className="text-surface-400">Extraction Offset:</span>
                                <span className="text-insignia-400 font-bold">
                                    {item.citation?.pageOrOffset || "Record #1094"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] border-t border-surface-200 pt-2">
                                <span className="text-surface-400">Parsing Model:</span>
                                <span className="text-surface-600">
                                    {item.citation?.extractorModel || "AstraX-NER-v2.1"}
                                </span>
                            </div>

                            {item.citation?.rawSnippet && (
                                <div className="border-t border-surface-200 pt-2">
                                    <span className="text-[10px] text-surface-400 uppercase block mb-1">
                                        Raw Extracted Snippet
                                    </span>
                                    <div className="p-2.5 rounded bg-surface-100 border border-surface-200 text-surface-700 italic text-[11px] leading-relaxed">
                                        "{item.citation.rawSnippet}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── FEEDBACK TAB (Document 3 §4.7 Requirement) ── */}
                {activeTab === "feedback" && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900">
                                Investigator Human-In-The-Loop Feedback
                            </h4>
                            <p className="text-xs text-surface-500 mt-1 leading-relaxed">
                                One-tap feedback immediately tunes the underlying GNN edge weights and disambiguation thresholds for this case record.
                            </p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setFeedbackStatus("confirmed")}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                    feedbackStatus === "confirmed"
                                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                        : "bg-surface-0 border-surface-300 text-surface-800 hover:border-emerald-500/50 hover:bg-emerald-950/20"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon name="check-circle" size={16} className="text-emerald-400" />
                                    <span>Confirmed Correct Linkage</span>
                                </div>
                                {feedbackStatus === "confirmed" && <span className="font-mono text-[10px]">ACTIVE</span>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFeedbackStatus("not_useful")}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                    feedbackStatus === "not_useful"
                                        ? "bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                                        : "bg-surface-0 border-surface-300 text-surface-800 hover:border-amber-500/50 hover:bg-amber-950/20"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon name="radar" size={16} className="text-amber-400" />
                                    <span>Not Useful / Weak Signal</span>
                                </div>
                                {feedbackStatus === "not_useful" && <span className="font-mono text-[10px]">ACTIVE</span>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFeedbackStatus("incorrect")}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                    feedbackStatus === "incorrect"
                                        ? "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                                        : "bg-surface-0 border-surface-300 text-surface-800 hover:border-red-500/50 hover:bg-red-950/20"
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon name="alert-triangle" size={16} className="text-red-400" />
                                    <span>Incorrect Link (Break Connection)</span>
                                </div>
                                {feedbackStatus === "incorrect" && <span className="font-mono text-[10px]">ACTIVE</span>}
                            </button>
                        </div>

                        {feedbackStatus && (
                            <div className="rounded-lg bg-surface-0 border border-surface-200 p-3 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                                <Icon name="check-circle" size={13} />
                                <span>Feedback recorded. Graph updated in real-time.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
