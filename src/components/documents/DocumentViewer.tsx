import { useEffect, useState } from "react";

import type { Document } from "../../services/documents";
import { getDownloadUrl, getDocument } from "../../services/documents";
import { triggerModelForDocument } from "../../services/models";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentsStore } from "../../store/documentsStore";

import StatusBadge from "../ui/StatusBadge";
import Loader from "../ui/Loader";

interface DocumentViewerProps {
    document: Document;
}

const VIEWABLE_STATUSES = new Set(["success", "finish"]);

export default function DocumentViewer({ document }: DocumentViewerProps) {
    const clearDocument = useWorkspaceStore((state) => state.clearDocument);
    const deleteFromStore = useDocumentsStore((state) => state.deleteDocument);
    const updateStoreDocument = useDocumentsStore((state) => state.updateDocument);

    const [currentDoc, setCurrentDoc] = useState<Document>(document);

    useEffect(() => {
        setCurrentDoc(document);
    }, [document]);

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [urlLoading, setUrlLoading] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [descExpanded, setDescExpanded] = useState(false);

    const [isExtracting, setIsExtracting] = useState(false);
    const [isModelRunning, setIsModelRunning] = useState(false);
    const [modelStatusText, setModelStatusText] = useState<string | null>(null);
    const [displayedExtraction, setDisplayedExtraction] = useState("");

    // Reset extraction view when document changes
    useEffect(() => {
        setDisplayedExtraction("");
        setIsExtracting(false);
    }, [document.id]);

    const handleExtractAnimation = () => {
        if (!currentDoc.extracted_information) return;
        setIsExtracting(true);
        setDisplayedExtraction("");
        
        const fullText = JSON.stringify(currentDoc.extracted_information, null, 2);
        let currentIndex = 0;
        
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedExtraction(fullText.slice(0, currentIndex));
                currentIndex += Math.floor(Math.random() * 3) + 1; // type 1-3 chars at a time
            } else {
                clearInterval(interval);
                setIsExtracting(false);
            }
        }, 10);
    };

    const handleRunAIInference = async () => {
        setIsModelRunning(true);
        setModelStatusText("Dispatching document to AstraX AI inference pipeline...");
        try {
            const res = await triggerModelForDocument(currentDoc);
            setModelStatusText(res.message || "Model inference complete. Refreshing metadata...");
            try {
                const refreshed = await getDocument(currentDoc.id);
                setCurrentDoc(refreshed);
                updateStoreDocument(refreshed);
                if (refreshed.extracted_information) {
                    setDisplayedExtraction(JSON.stringify(refreshed.extracted_information, null, 2));
                }
            } catch {
                // Keep current document state if refresh fails
            }
        } catch (err) {
            setModelStatusText(
                err instanceof Error ? err.message : "Inference pipeline encountered an error"
            );
        } finally {
            setIsModelRunning(false);
        }
    };

    useEffect(() => {
        if (!VIEWABLE_STATUSES.has(document.status)) {
            setDownloadUrl(null);
            setUrlError(null);
            return;
        }

        let cancelled = false;

        async function fetchUrl() {
            setUrlLoading(true);
            setUrlError(null);
            setDownloadUrl(null);

            try {
                const { download_url } = await getDownloadUrl(document.id);
                if (!cancelled) setDownloadUrl(download_url);
            } catch (err) {
                if (!cancelled) {
                    setUrlError(
                        err instanceof Error ? err.message : "Failed to load document URL"
                    );
                }
            } finally {
                if (!cancelled) setUrlLoading(false);
            }
        }

        fetchUrl();

        return () => {
            cancelled = true;
        };
    }, [document.id, document.status]);

    async function handleDelete() {
        if (!confirm(`Delete "${document.title}"?`)) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteFromStore(document.id);
            clearDocument();
        } catch (err) {
            setDeleteError(
                err instanceof Error ? err.message : "Failed to delete document"
            );
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex h-full flex-col">
            {/* ── Header ───────────────────────────────────── */}
            <div className="border-b border-surface-200 pb-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => clearDocument()}
                                title="Back to documents"
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-surface-400 transition hover:bg-surface-200 hover:text-surface-700"
                            >
                                ←
                            </button>

                            <h1 className="truncate text-xl font-bold text-surface-900">
                                {document.title}
                            </h1>
                        </div>

                        <div className="mt-2 pl-10 text-sm text-surface-500">
                            <p className={descExpanded ? "" : "line-clamp-3"}>
                                {document.description}
                            </p>
                            {document.description && document.description.length > 100 && (
                                <button 
                                    onClick={() => setDescExpanded(!descExpanded)}
                                    className="mt-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                                >
                                    {descExpanded ? "Show less" : "Show more"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge status={document.status} />

                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in new tab"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-300 text-surface-400 transition hover:bg-surface-200 hover:text-surface-800"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            title="Delete document"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-300 text-surface-400 transition hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                {deleteError && (
                    <p className="mt-2 text-sm text-red-600">{deleteError}</p>
                )}
            </div>

            {/* ── Body ─────────────────────────────────────── */}
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-6">

                {/* Document preview */}
                {VIEWABLE_STATUSES.has(document.status) && (
                    <section>
                        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-surface-500">
                            Document Preview
                        </h2>

                        {urlLoading && <Loader label="Loading document…" />}

                        {urlError && (
                            <div className="rounded-xl border border-surface-200 p-6 text-sm text-red-600">
                                {urlError}
                            </div>
                        )}

                        {downloadUrl && !urlLoading && (
                            <div className="overflow-hidden rounded-xl border border-surface-200 shadow-sm bg-surface-0 w-full aspect-[1/1.414]">
                                <iframe
                                    src={downloadUrl}
                                    title={document.title}
                                    className="h-full w-full bg-transparent"
                                />
                            </div>
                        )}
                    </section>
                )}

                {/* Status-specific messages */}
                {currentDoc.status === "processing" && (
                    <div className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 text-sm text-blue-300">
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                        This document is currently being processed. The preview will be available when processing is complete.
                    </div>
                )}

                {currentDoc.status === "pending" && (
                    <div className="rounded-xl border border-surface-300 bg-surface-100 p-5 text-sm text-surface-400">
                        This document is pending upload confirmation.
                    </div>
                )}

                {currentDoc.status === "failed" && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300">
                        Processing failed for this document. No preview is available.
                    </div>
                )}

                {/* Metadata */}
                <section>
                    <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-surface-500">
                        Metadata
                    </h2>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <div className="rounded-lg border border-surface-200 bg-surface-100 p-3">
                            <p className="text-[10px] uppercase font-mono tracking-wider text-surface-500">Document ID</p>
                            <p className="mt-1 truncate text-xs font-mono text-amber-400">{currentDoc.id}</p>
                        </div>
                        <div className="rounded-lg border border-surface-200 bg-surface-100 p-3">
                            <p className="text-[10px] uppercase font-mono tracking-wider text-surface-500">Case ID</p>
                            <p className="mt-1 truncate text-xs font-mono text-surface-300">{currentDoc.case_id}</p>
                        </div>
                        <div className="rounded-lg border border-surface-200 bg-surface-100 p-3">
                            <p className="text-[10px] uppercase font-mono tracking-wider text-surface-500">Type</p>
                            <p className="mt-1 text-xs font-mono capitalize text-surface-300">{currentDoc.document_type}</p>
                        </div>
                        <div className="rounded-lg border border-surface-200 bg-surface-100 p-3">
                            <p className="text-[10px] uppercase font-mono tracking-wider text-surface-500">Created</p>
                            <p className="mt-1 text-xs font-mono text-surface-400">{new Date(currentDoc.created_at).toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg border border-surface-200 bg-surface-100 p-3">
                            <p className="text-[10px] uppercase font-mono tracking-wider text-surface-500">Updated</p>
                            <p className="mt-1 text-xs font-mono text-surface-400">{new Date(currentDoc.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </section>

                {/* Extracted information & Model inference */}
                <section>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                            Extracted Information & AI Models
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleRunAIInference}
                                disabled={isModelRunning}
                                className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-400 transition disabled:opacity-50 cursor-pointer shadow-sm"
                            >
                                <svg className={`h-3.5 w-3.5 ${isModelRunning ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>{isModelRunning ? "Running AI Model..." : "Run AI Model Pipeline"}</span>
                            </button>

                            {currentDoc.extracted_information && (
                                <button
                                    type="button"
                                    onClick={handleExtractAnimation}
                                    disabled={isExtracting}
                                    className="flex items-center gap-1.5 rounded-lg border border-surface-300 bg-surface-200 px-2.5 py-1.5 text-xs font-semibold text-surface-700 hover:bg-surface-300 transition disabled:opacity-50 cursor-pointer"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                    <span>{isExtracting ? "Parsing..." : "Replay Extraction"}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {modelStatusText && (
                        <div className="mb-3 flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-mono text-purple-300">
                            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                            <span>{modelStatusText}</span>
                        </div>
                    )}

                    {currentDoc.extracted_information ? (
                        <div className="relative overflow-x-auto rounded-xl border border-surface-200 bg-surface-100 p-4 font-mono text-sm text-surface-700 shadow-inner">
                            <pre>{displayedExtraction || JSON.stringify(currentDoc.extracted_information, null, 2)}{isExtracting && <span className="animate-pulse">_</span>}</pre>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-surface-200 bg-surface-100 p-6 text-sm text-surface-500">
                            {currentDoc.status === "processing"
                                ? "Extraction is in progress."
                                : currentDoc.status === "failed"
                                  ? "Extraction failed for this document."
                                  : "No extracted information available yet. Click 'Run AI Model Pipeline' above to trigger inference."}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}