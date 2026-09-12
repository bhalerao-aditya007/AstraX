// src/components/ui/SourceCitationPopover.tsx
import React, { useState } from "react";
import Icon from "./Icon";
import ConfidenceBadge from "./ConfidenceBadge";

export interface CitationSource {
    documentTitle: string;
    documentType?: "image" | "text" | "voice" | "video" | "cdr" | "cctv";
    pageOrOffset?: string;
    extractedAt?: string;
    confidenceScore?: number;
    rawSnippet?: string;
    extractorModel?: string;
}

interface SourceCitationPopoverProps {
    source: CitationSource;
    children?: React.ReactNode;
    className?: string;
}

export default function SourceCitationPopover({
    source,
    children,
    className = "",
}: SourceCitationPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span className={`relative inline-block ${className}`}>
            {children ? (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    className="cursor-pointer border-b border-dotted border-insignia-400/60 hover:text-insignia-300 hover:border-insignia-300 transition-colors"
                    title="Click to view extraction source"
                >
                    {children}
                </span>
            ) : (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    title="View Extraction Citation"
                    className="inline-flex items-center gap-1 rounded bg-surface-200/80 px-1.5 py-0.5 text-[11px] font-mono text-surface-400 hover:bg-surface-300 hover:text-insignia-400 transition-colors ml-1.5"
                >
                    <Icon name="chain-link" size={11} />
                    <span>src</span>
                </button>
            )}

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-0 top-full mt-2 z-50 w-80 rounded-xl border border-surface-300 bg-surface-100 p-4 shadow-2xl text-left"
                    >
                        <div className="flex items-start justify-between gap-2 border-b border-surface-200 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-insignia-500/20 text-insignia-400">
                                    <Icon name="evidence-tag" size={13} />
                                </div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900">
                                    Source Verification
                                </h4>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-surface-500 hover:text-surface-900 text-xs p-1"
                            >
                                <Icon name="cross" size={12} />
                            </button>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div>
                                <span className="text-surface-500 block text-[10px] uppercase font-mono tracking-wider">
                                    Document / Channel
                                </span>
                                <span className="font-semibold text-surface-800 break-words">
                                    {source.documentTitle}
                                </span>
                            </div>

                            {source.pageOrOffset && (
                                <div className="flex justify-between items-center font-mono text-[11px]">
                                    <span className="text-surface-500">Location Reference:</span>
                                    <span className="text-surface-700 bg-surface-200 px-1.5 py-0.5 rounded">
                                        {source.pageOrOffset}
                                    </span>
                                </div>
                            )}

                            {source.confidenceScore !== undefined && (
                                <div className="flex justify-between items-center">
                                    <span className="text-surface-500 text-[11px]">Model Confidence:</span>
                                    <ConfidenceBadge score={source.confidenceScore} size="sm" />
                                </div>
                            )}

                            {source.extractorModel && (
                                <div className="flex justify-between items-center text-[11px] font-mono">
                                    <span className="text-surface-500">Extractor:</span>
                                    <span className="text-surface-400">{source.extractorModel}</span>
                                </div>
                            )}

                            {source.rawSnippet && (
                                <div className="mt-2 pt-2 border-t border-surface-200">
                                    <span className="text-surface-500 block text-[10px] uppercase font-mono tracking-wider mb-1">
                                        Raw Extracted Excerpt
                                    </span>
                                    <div className="rounded bg-surface-0 border border-surface-300/80 p-2 font-mono text-[11px] text-surface-700 leading-relaxed italic max-h-28 overflow-y-auto">
                                        "{source.rawSnippet}"
                                    </div>
                                </div>
                            )}

                            {source.extractedAt && (
                                <div className="text-[10px] text-surface-500 font-mono text-right pt-1">
                                    Extracted: {source.extractedAt}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </span>
    );
}
