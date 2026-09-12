// src/components/dashboard/DeltaIngestionModal.tsx
import { useState } from "react";
import Icon from "../ui/Icon";
import EvidenceChannelCard, {
    type ChannelConfig,
    type ChannelFile,
} from "../intake/EvidenceChannelCard";

const DELTA_CHANNELS: ChannelConfig[] = [
    {
        id: "fir_text",
        title: "FIR / Supplementary Statements",
        icon: "file-text",
        accepts: ".json,.txt,.docx",
        acceptsLabel: ".json, .txt, .docx",
        pipelineNote: "Supplementary chargesheet or witness statement parser.",
        limits: "Incremental upload: 5 files",
    },
    {
        id: "cdr_financial",
        title: "Supplementary CDR / Ledger",
        icon: "cdr-table",
        accepts: ".csv,.xlsx",
        acceptsLabel: ".csv, .xlsx",
        pipelineNote: "Triggers delta graph edge clustering.",
        limits: "Incremental upload: 5 files",
    },
    {
        id: "cctv_video",
        title: "Additional Video / CCTV",
        icon: "video-cctv",
        accepts: ".mp4,.mov",
        acceptsLabel: ".mp4, .mov",
        pipelineNote: "Delta Re-ID across existing identified suspect embeddings.",
        limits: "Incremental upload: 200MB",
    },
];

const DELTA_LOGS = [
    "[Delta] Ingesting supplementary evidence tranche into case...",
    "[Merge] Re-evaluating graph entity clusters with incremental records...",
    "[Resolution] New phone IMEI matched to Amit Singh net-banking session.",
    "[Diff] 4 new facts added to Fact-Sheet. Lead Board updated.",
    "[Theory] Crime Theory bumped to v2 (superseding preliminary v1).",
    "[Complete] In-place delta analysis complete."
];

interface DeltaIngestionModalProps {
    caseId: string;
    isOpen: boolean;
    onClose: () => void;
    onDeltaComplete: () => void;
}

export default function DeltaIngestionModal({
    isOpen,
    onClose,
    onDeltaComplete,
}: DeltaIngestionModalProps) {
    const [channelFiles, setChannelFiles] = useState<Record<string, ChannelFile[]>>({
        fir_text: [
            {
                id: "delta-1",
                file: new File([""], "supplementary_chargesheet_bns111.docx", { type: "application/docx" }),
                name: "supplementary_chargesheet_bns111.docx",
                size: 240000,
                status: "queued",
                progress: 100,
            }
        ],
        cdr_financial: [],
        cctv_video: [],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [streamedLogs, setStreamedLogs] = useState<string[]>([]);

    if (!isOpen) return null;

    const totalFiles = Object.values(channelFiles).reduce((sum, list) => sum + list.length, 0);

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

    const handleRunDelta = async () => {
        if (totalFiles === 0) return;

        setIsProcessing(true);
        setStreamedLogs([]);

        for (let i = 0; i < DELTA_LOGS.length; i++) {
            await new Promise((r) => setTimeout(r, 400));
            setStreamedLogs((prev) => [...prev, DELTA_LOGS[i]]);
        }

        await new Promise((r) => setTimeout(r, 500));
        setIsProcessing(false);
        onDeltaComplete();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-surface-0/80 backdrop-blur-sm font-sans">
            <div
                className="absolute inset-0"
                onClick={() => !isProcessing && onClose()}
            />

            <div className="relative z-10 h-full w-full max-w-xl bg-surface-100 border-l border-surface-300 shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-surface-200 flex items-center justify-between bg-surface-100/90">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-insignia-500/20 text-insignia-400">
                            <Icon name="upload" size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-surface-900">
                                Delta Evidence Ingestion
                            </h3>
                            <p className="text-xs font-mono text-surface-500">
                                Append evidence to current case record
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="text-surface-400 hover:text-surface-900 p-1 rounded"
                    >
                        <Icon name="cross" size={16} />
                    </button>
                </div>

                {/* Body / Channels Stack */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="text-xs text-surface-600 bg-surface-0 p-3 rounded-lg border border-surface-200 font-mono">
                        Stage 13.1 Delta Pipeline: Ingested evidence will generate an additive diff, update the Fact-Sheet, and produce a versioned Crime Reconstruction Theory.
                    </div>

                    {isProcessing ? (
                        <div className="h-72 rounded-xl border border-surface-300 bg-surface-0 p-4 font-mono text-xs text-insignia-400/95 overflow-y-auto space-y-2">
                            <div className="flex items-center gap-2 text-surface-400 mb-2 border-b border-surface-200 pb-2">
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-insignia-500 border-t-transparent" />
                                <span>Re-running link prediction engine...</span>
                            </div>
                            {streamedLogs.map((log, idx) => (
                                <div key={idx}>{log}</div>
                            ))}
                        </div>
                    ) : (
                        DELTA_CHANNELS.map((channel) => (
                            <EvidenceChannelCard
                                key={channel.id}
                                config={channel}
                                files={channelFiles[channel.id] || []}
                                onFilesAdded={handleFilesAdded}
                                onFileRemoved={handleFileRemoved}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-surface-200 bg-surface-100/95 flex items-center justify-between">
                    <div className="text-xs font-mono text-surface-500">
                        {totalFiles} supplementary files queued
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 rounded-lg border border-surface-300 text-xs font-semibold text-surface-400 hover:text-surface-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleRunDelta}
                            disabled={totalFiles === 0 || isProcessing}
                            className="flex items-center gap-2 rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 font-bold px-4 py-2 text-xs transition-colors shadow disabled:opacity-40 cursor-pointer"
                        >
                            <Icon name="radar" size={14} />
                            <span>Re-run Pipeline</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
