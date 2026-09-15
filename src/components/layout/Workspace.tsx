// src/components/layout/Workspace.tsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDocumentsStore } from "../../store/documentsStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useCasesStore } from "../../store/casesStore";
import type { Document } from "../../services/documents";

import DocumentList from "../documents/DocumentList";
import UploadDocument from "../upload/UploadDocument";
import NetworkGraph from "../dashboard/analytics/NetworkGraph";
import FactSheet from "../summary/FactSheet";
import { USE_MOCK_API } from "../../config";
import { synthesizeFactSheetFromDocuments } from "../../utils/factSheetSynthesizer";
import TrackBadge from "../ui/TrackBadge";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import { mockFactSheet, mockFinancialTracing } from "../../data/mockCaseData";

export default function Workspace() {
    const selectedCaseId = useWorkspaceStore((state) => state.selectedCaseId);

    const {
        documents,
        isLoading,
        error,
        fetchDocuments,
        addDocument,
    } = useDocumentsStore();

    const cases = useCasesStore((state) => state.cases);
    const selectedCase = cases.find((c) => c.id === selectedCaseId);

    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        if (selectedCaseId) {
            fetchDocuments(selectedCaseId);
        }
    }, [selectedCaseId, fetchDocuments]);

    if (!selectedCaseId) {
        return (
            <main className="flex min-w-0 flex-1 items-center justify-center bg-surface-0 p-6">
                <div className="text-center rounded-2xl border border-surface-300 bg-surface-100 p-12 shadow-xl max-w-md">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-200 border border-surface-300 text-surface-400">
                        <Icon name="folder" size={26} />
                    </div>
                    <h2 className="text-lg font-bold text-surface-900">
                        Select an Operational Case
                    </h2>
                    <p className="mt-2 text-xs text-surface-500 leading-relaxed font-mono">
                        Choose a case from the sidebar directory to view its evidentiary files, summary fact-sheet, and topological overview.
                    </p>
                    <Link
                        to="/intake"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 font-bold px-4 py-2 text-xs transition-colors shadow"
                    >
                        <Icon name="plus" size={13} />
                        <span>Initiate New Evidence Intake</span>
                    </Link>
                </div>
            </main>
        );
    }

    const workspaceFactSheet = useMemo(() => {
        if (USE_MOCK_API && documents.length === 0) {
            return {
                ...mockFactSheet,
                caseId: selectedCase?.id || selectedCaseId,
                firNumber: selectedCase?.name || "Case Workspace",
                track: ((selectedCase?.track ?? 2) as 1 | 2),
                triageReason: selectedCase?.triage_reason || mockFactSheet.triageReason,
            };
        }
        return synthesizeFactSheetFromDocuments(
            documents,
            selectedCase?.id || selectedCaseId,
            selectedCase?.name || "Case Workspace",
            ((selectedCase?.track ?? 2) as 1 | 2),
            selectedCase?.triage_reason || "Active Case Workspace"
        );
    }, [documents, selectedCase, selectedCaseId]);

    const isTrack2 = (selectedCase?.track ?? 2) === 2;

    return (
        <>
            <main className="min-w-0 flex-1 overflow-y-auto bg-surface-0 p-6 lg:p-8 space-y-6">
                {/* ── Case Metadata & Action Header ─────────── */}
                <div className="rounded-xl border border-surface-300 bg-surface-100 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-surface-900 tracking-tight">
                                    {selectedCase?.name ?? "Case Workspace"}
                                </h1>
                                <TrackBadge
                                    track={(selectedCase?.track as 1 | 2) || 2}
                                    triageReason={selectedCase?.triage_reason}
                                />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono text-surface-500">
                                <span>
                                    {documents.length} {documents.length === 1 ? "document" : "documents on file"}
                                </span>
                                <span>•</span>
                                <span>Version {selectedCase?.version || 1}.0</span>
                            </div>
                        </div>

                        {/* Open Full Dashboard CTA for Track 2 */}
                        {isTrack2 && (
                            <Link
                                to={`/cases/${selectedCaseId}`}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 font-bold px-5 py-2.5 text-xs transition-all shadow-md shadow-insignia-500/20 cursor-pointer shrink-0"
                            >
                                <Icon name="radar" size={14} />
                                <span>Open Full Analysis Workspace</span>
                                <Icon name="arrow-right" size={14} />
                            </Link>
                        )}
                    </div>
                    
                    <p className="text-xs text-surface-600 leading-relaxed mt-4 pt-4 border-t border-surface-200">
                        {selectedCase?.triage_reason ||
                            "This case investigates organized financial and telecommunication irregularities. Multi-modality pipelines correlate extracted entities across banking ledgers and surveillance records."}
                    </p>
                </div>

                {/* ── Network Graph Slim Preview (Unified Graph) ──────────── */}
                <div className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-900 flex items-center gap-2">
                                <Icon name="network-graph" size={15} className="text-insignia-400" />
                                <span>Case Knowledge Graph Preview</span>
                            </h3>
                            <p className="text-xs text-surface-500 mt-0.5">
                                Real-time topological rendering of primary suspect interactions.
                            </p>
                        </div>
                        {isTrack2 && (
                            <Link
                                to={`/cases/${selectedCaseId}#knowledge-graph`}
                                className="text-xs font-mono text-insignia-400 hover:underline"
                            >
                                Full Screen Interactive Graph →
                            </Link>
                        )}
                    </div>

                    <div className="h-[360px] w-full">
                        <NetworkGraph
                            data={mockFinancialTracing}
                            theme="digital"
                            showControls={false}
                        />
                    </div>
                </div>

                {/* ── Documents List ────────────────── */}
                <div className="rounded-xl border border-surface-300 bg-surface-100 p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-surface-900">
                                Case Evidence Files
                            </h2>
                            <p className="text-xs text-surface-500 mt-0.5 font-mono">
                                Uploaded digital and scanned exhibits
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowUpload(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 font-bold px-3 py-1.5 text-xs transition-colors shadow"
                        >
                            <Icon name="upload" size={13} />
                            <span>Upload Exhibit</span>
                        </button>
                    </div>

                    {isLoading && <Loader label="Loading exhibits…" />}

                    {error && !isLoading && (
                        <div className="rounded-xl border border-surface-300 bg-surface-0 p-6">
                            <p className="text-sm text-red-400 font-mono">{error}</p>
                            <button
                                type="button"
                                onClick={() => fetchDocuments(selectedCaseId)}
                                className="mt-2 text-xs text-surface-400 underline hover:text-white"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <DocumentList documents={documents} />
                    )}
                </div>

                {/* ── Persistent Embedded Fact Sheet (Document Requirement §3.7) ────────── */}
                <div className="pt-2">
                    <FactSheet
                        data={workspaceFactSheet}
                        caseId={selectedCase?.id || selectedCaseId}
                        isEmbedded={true}
                    />
                </div>
            </main>

            {/* Upload modal */}
            {showUpload && (
                <UploadDocument
                    caseId={selectedCaseId}
                    onUploaded={(doc: Document) => {
                        addDocument(doc);
                    }}
                    onClose={() => setShowUpload(false)}
                />
            )}
        </>
    );
}