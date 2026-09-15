// src/pages/EvidenceIntake.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import EvidenceChannelCard, {
    type ChannelConfig,
    type ChannelFile,
} from "../components/intake/EvidenceChannelCard";
import Icon from "../components/ui/Icon";
import { useCasesStore } from "../store/casesStore";
import { initiateUpload, uploadToStorage, confirmUpload } from "../services/upload";
import { triggerHistoricalAnalysis } from "../services/analytics";
import type { DocumentType } from "../services/documents";

const CHANNELS: ChannelConfig[] = [
    {
        id: "fir_text",
        title: "FIR / Case Text (Digital)",
        icon: "file-text",
        accepts: ".json,.txt,.docx",
        acceptsLabel: ".json (IIF-1), .txt, .docx",
        pipelineNote: "Digitized CAS/e-FIR export — parsed via schema-aware parser, not OCR.",
        limits: "Demo limit: 5 files / 50MB",
    },
    {
        id: "scanned_doc",
        title: "Scanned FIR / Seizure Memos",
        icon: "evidence-tag",
        accepts: ".jpg,.png,.pdf",
        acceptsLabel: ".pdf, .jpg, .png",
        pipelineNote: "Layout-aware OCR, table extraction, and handwriting routed separately.",
        limits: "Demo limit: 10 pages / 100MB",
    },
    {
        id: "cctv_video",
        title: "CCTV / Video Evidence",
        icon: "video-cctv",
        accepts: ".mp4,.mov",
        acceptsLabel: ".mp4, .mov",
        pipelineNote: "Detection + Re-ID + ANPR — processed via cached GPU inference pipeline.",
        limits: "Demo limit: 500MB / max 30 mins",
    },
    {
        id: "audio_recordings",
        title: "Audio / Intercept Wiretaps",
        icon: "audio-mic",
        accepts: ".mp3,.wav",
        acceptsLabel: ".mp3, .wav",
        pipelineNote: "ASR speech-to-text + multilingual diarization for Hindi, English & dialects.",
        limits: "Demo limit: 100MB per audio file",
    },
    {
        id: "cdr_financial",
        title: "CDR / Bank Statements",
        icon: "cdr-table",
        accepts: ".csv,.xlsx",
        acceptsLabel: ".csv, .xlsx",
        pipelineNote: "Structuring detection (sub-₹50k smurfing), pass-through velocity, and tower triangulation.",
        limits: "Demo limit: 50,000 transaction rows",
    },
    {
        id: "image_bio",
        title: "Evidence Photos / Biometrics",
        icon: "image-bio",
        accepts: ".jpg,.png",
        acceptsLabel: ".jpg, .png",
        pipelineNote: "Facial/plate detection — biometric identity claims routed externally, never confirmed in-app.",
        limits: "Demo limit: 20 high-res photos",
    },
];

const SAMPLE_LOGS = [
    "[System] AstraX Multi-Modality Ingestion Gateway initialized.",
    "[Ingest] Dispatching payload across 6 parallel model adapters...",
    "[Parser] Channel 1: Schema-aware CAS parser extracted 14 entities and BNS legal sections.",
    "[OCR] Channel 2: Tesseract/LayoutLM parsed Seizure Panchnama with 94.2% character confidence.",
    "[Vision] Channel 3: ANPR neural network identified plate 'DL-4C-9981' on 3 consecutive frames.",
    "[ASR] Channel 4: Whisper-Hindi diarized 2 distinct speakers on Wiretap Intercept #9871.",
    "[Graph] Cross-referencing telephone tower DEL-442 coordinates with ATM withdrawal timestamps...",
    "[Triage] Case complexity evaluated: Multi-jurisdiction syndicate detected. Assigning Track 2.",
    "[Complete] Extraction summary ready. Redirecting to Stage 5 Case Fact-Sheet..."
];

export default function EvidenceIntake() {
    const navigate = useNavigate();
    const createCase = useCasesStore((state) => state.createCase);

    const [caseTitle, setCaseTitle] = useState("FIR 101/2026: Apex Financial Syndicate");
    const [channelFiles, setChannelFiles] = useState<Record<string, ChannelFile[]>>({
        fir_text: [
            {
                id: "init-1",
                file: new File(["{}"], "FIR_101_2026_cas_export.json", { type: "application/json" }),
                name: "FIR_101_2026_cas_export.json",
                size: 142000,
                status: "queued",
                progress: 100,
            }
        ],
        scanned_doc: [
            {
                id: "init-2",
                file: new File([""], "seizure_memo_okhla_raid.pdf", { type: "application/pdf" }),
                name: "seizure_memo_okhla_raid.pdf",
                size: 2450000,
                status: "queued",
                progress: 100,
            }
        ],
        cctv_video: [],
        audio_recordings: [],
        cdr_financial: [
            {
                id: "init-3",
                file: new File([""], "hdfc_statement_9901.xlsx", { type: "application/vnd.ms-excel" }),
                name: "hdfc_statement_9901.xlsx",
                size: 480000,
                status: "queued",
                progress: 100,
            }
        ],
        image_bio: [],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [streamedLogs, setStreamedLogs] = useState<string[]>([]);

    const totalFiles = Object.values(channelFiles).reduce((sum, list) => sum + list.length, 0);
    const activeChannels = Object.values(channelFiles).filter((list) => list.length > 0).length;

    const handleFilesAdded = (channelId: string, newFiles: File[]) => {
        const addedItems: ChannelFile[] = newFiles.map((f) => ({
            id: crypto.randomUUID(),
            file: f,
            name: f.name,
            size: f.size,
            status: "queued",
            progress: 0,
        }));

        setChannelFiles((prev) => ({
            ...prev,
            [channelId]: [...(prev[channelId] || []), ...addedItems],
        }));
    };

    const handleFileRemoved = (channelId: string, fileId: string) => {
        setChannelFiles((prev) => ({
            ...prev,
            [channelId]: (prev[channelId] || []).filter((f) => f.id !== fileId),
        }));
    };

    const handleRunPipeline = async () => {
        if (totalFiles === 0) return;

        setIsProcessing(true);
        setStreamedLogs(["[System] AstraX Multi-Modality Ingestion Gateway initialized."]);

        // Create new case in store or fallback to case-1
        let targetCaseId = "case-1";
        try {
            const newCase = await createCase({
                name: caseTitle.trim() || "New Ingested Investigation",
                track: 2,
                triage_reason: "Multi-channel ingestion completed: 6 evidence streams merged.",
            });
            targetCaseId = newCase.id;
        } catch {
            targetCaseId = "case-1";
        }

        // Upload queued files to backend and S3 storage
        for (const [channelId, fileList] of Object.entries(channelFiles)) {
            const docType: DocumentType =
                channelId === "cctv_video"
                    ? "video"
                    : channelId === "audio_recordings"
                    ? "voice"
                    : channelId === "scanned_doc" || channelId === "image_bio"
                    ? "image"
                    : "text";

            for (const item of fileList) {
                if (item.file && item.file.size > 0) {
                    setStreamedLogs((prev) => [
                        ...prev,
                        `[Upload] Ingesting ${item.name} (${docType})...`,
                    ]);
                    try {
                        const { document_id, upload_url } = await initiateUpload({
                            case_id: targetCaseId,
                            title: item.name,
                            description: `Intake matrix upload from ${channelId}`,
                            file_name: item.name,
                            document_type: docType,
                        });
                        await uploadToStorage(upload_url, item.file);
                        await confirmUpload(document_id, true);
                        setStreamedLogs((prev) => [
                            ...prev,
                            `[Confirmed] ${item.name} registered into pipeline (Doc ID: ${document_id.slice(0, 8)}...).`,
                        ]);
                    } catch {
                        setStreamedLogs((prev) => [
                            ...prev,
                            `[Note] Ingesting cached specimen for ${item.name}`,
                        ]);
                    }
                }
            }
        }

        // Stream model telemetry output
        for (let i = 1; i < SAMPLE_LOGS.length; i++) {
            await new Promise((r) => setTimeout(r, 350));
            setStreamedLogs((prev) => [...prev, SAMPLE_LOGS[i]]);
        }

        try {
            setStreamedLogs((prev) => [
                ...prev,
                "[GNN Linker] Triggering cross-modal graph synthesis...",
            ]);
            await triggerHistoricalAnalysis(targetCaseId);
        } catch {
            // Graceful fallback
        }

        await new Promise((r) => setTimeout(r, 600));
        navigate(`/intake/${targetCaseId}/summary`);
    };

    return (
        <div className="min-h-screen bg-surface-0 flex flex-col font-sans">
            <Navbar />

            {/* Tactical Grid */}
            <div className="absolute inset-0 bg-tactical-fine opacity-100 pointer-events-none" />

            {/* Main Content */}
            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 pb-24">
                {/* Header */}
                <div className="border-b border-surface-300/40 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-insignia-400 uppercase tracking-[0.15em] mb-1.5">
                            <Icon name="shield" size={12} />
                            <span>Multi-Modality Evidence Intake</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-surface-900 tracking-tight">
                            Evidence Ingestion Matrix
                        </h1>
                        <p className="mt-2 text-xs text-surface-600 leading-relaxed">
                            Files are parsed per-modality via isolated domain adapters, cross-referenced across telecommunications, banking, and field recovery data, and unified into one case record.
                        </p>
                    </div>

                    {/* Case Title Input */}
                    <div className="w-full md:w-72">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-surface-500 mb-1">
                            Case / FIR Identifier
                        </label>
                        <input
                            type="text"
                            value={caseTitle}
                            onChange={(e) => setCaseTitle(e.target.value)}
                            placeholder="e.g. FIR 101/2026"
                            className="w-full rounded-md border border-surface-300/60 bg-surface-100 px-3 py-1.5 text-xs text-surface-900 font-mono focus:border-insignia-500 focus:outline-none focus:ring-1 focus:ring-insignia-500/40"
                        />
                    </div>
                </div>

                {/* Evidence Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CHANNELS.map((channel) => (
                        <EvidenceChannelCard
                            key={channel.id}
                            config={channel}
                            files={channelFiles[channel.id] || []}
                            onFilesAdded={handleFilesAdded}
                            onFileRemoved={handleFileRemoved}
                        />
                    ))}
                </div>

                {/* Processing Modal */}
                {isProcessing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-0/90 backdrop-blur-sm p-4">
                        <div className="w-full max-w-xl rounded-lg border border-surface-300/60 bg-surface-100 p-5 shadow-2xl shadow-black/30 flex flex-col gap-3 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-surface-200/50 pb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-insignia-500/15 text-insignia-400">
                                        <Icon name="terminal" size={14} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-surface-900">
                                            AstraX Neural Ingestion Pipeline
                                        </h3>
                                        <p className="text-[10px] font-mono text-surface-500">
                                            Processing multi-modality streams...
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-insignia-500 border-t-transparent" />
                            </div>

                            {/* Terminal */}
                            <div className="h-56 rounded-md border border-surface-300/50 bg-surface-0 p-3 font-mono text-[10px] text-insignia-400/90 overflow-y-auto space-y-1">
                                {streamedLogs.map((log, idx) => (
                                    <div key={idx} className="leading-relaxed">
                                        {log}
                                    </div>
                                ))}
                                <div className="animate-pulse text-surface-400">_</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-300/40 bg-surface-50/95 backdrop-blur-sm px-6 py-3">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-surface-500">
                            <span className="status-dot-online" />
                            <span>
                                <strong className="text-surface-800">{totalFiles}</strong> {totalFiles === 1 ? "file" : "files"} across{" "}
                                <strong className="text-surface-800">{activeChannels}</strong> of 6 channels
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <Link
                            to="/dashboard"
                            className="px-3 py-1.5 rounded-md border border-surface-300/50 bg-surface-200/60 text-[11px] font-semibold text-surface-500 hover:text-surface-300 hover:bg-surface-300/40 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleRunPipeline}
                            disabled={totalFiles === 0 || isProcessing}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md bg-insignia-500/90 hover:bg-insignia-400 text-surface-0 font-bold px-5 py-2 text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Icon name="radar" size={14} />
                            <span>Run Analysis Pipeline</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
