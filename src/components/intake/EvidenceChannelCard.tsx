// src/components/intake/EvidenceChannelCard.tsx
import { useRef } from "react";
import Icon, { type IconName } from "../ui/Icon";

export interface ChannelFile {
    id: string;
    file: File;
    name: string;
    size: number;
    status: "queued" | "parsing" | "extracted" | "failed";
    progress: number;
    extractedSnippet?: string;
}

export interface ChannelConfig {
    id: string;
    title: string;
    icon: IconName;
    accepts: string;
    acceptsLabel: string;
    pipelineNote: string;
    limits: string;
}

interface EvidenceChannelCardProps {
    config: ChannelConfig;
    files: ChannelFile[];
    onFilesAdded: (channelId: string, newFiles: File[]) => void;
    onFileRemoved: (channelId: string, fileId: string) => void;
}

export default function EvidenceChannelCard({
    config,
    files,
    onFilesAdded,
    onFileRemoved,
}: EvidenceChannelCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const hasFiles = files.length > 0;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesAdded(config.id, Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            className={`flex flex-col rounded-xl border transition-all duration-200 ${
                hasFiles
                    ? "border-insignia-500/40 bg-surface-100/95 shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                    : "border-surface-300/80 bg-surface-50/70 hover:border-surface-400"
            }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-surface-300/60 p-4">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                            hasFiles
                                ? "bg-insignia-500/15 border-insignia-500/40 text-insignia-400 shadow-[0_0_10px_rgba(201,162,39,0.2)]"
                                : "bg-surface-200 border-surface-300 text-surface-400"
                        }`}
                    >
                        <Icon name={config.icon} size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-surface-900 tracking-tight">
                            {config.title}
                        </h3>
                        <p className="text-[11px] font-mono text-surface-500 mt-0.5">
                            {config.acceptsLabel}
                        </p>
                    </div>
                </div>

                {hasFiles ? (
                    <span className="inline-flex items-center gap-1 rounded bg-insignia-500/15 px-2 py-0.5 text-[11px] font-mono font-bold text-insignia-400 border border-insignia-500/30">
                        <span>{files.length}</span>
                        <span>{files.length === 1 ? "file" : "files"}</span>
                    </span>
                ) : (
                    <span className="rounded bg-surface-200/60 px-2 py-0.5 text-[10px] font-mono text-surface-500 uppercase tracking-wider">
                        not provided
                    </span>
                )}
            </div>

            {/* Pipeline Note Banner */}
            <div className="bg-surface-200/40 border-b border-surface-300/40 px-4 py-2 text-[11px] text-surface-600 flex items-start gap-2">
                <Icon name="radar" size={12} className="text-insignia-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{config.pipelineNote}</span>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                {/* Dropzone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => inputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-surface-400/80 bg-surface-0/60 py-5 px-3 text-center transition-colors hover:border-insignia-400/70 hover:bg-insignia-500/5 group"
                >
                    <Icon
                        name="upload"
                        size={20}
                        className="text-surface-500 group-hover:text-insignia-400 transition-colors mb-1.5"
                    />
                    <p className="text-xs font-semibold text-surface-700 group-hover:text-surface-900">
                        Drag & drop files or <span className="text-insignia-400 underline">browse</span>
                    </p>
                    <p className="text-[10px] font-mono text-surface-500 mt-0.5">
                        {config.limits}
                    </p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={config.accepts}
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            onFilesAdded(config.id, Array.from(e.target.files));
                        }
                    }}
                    className="hidden"
                />

                {/* File List */}
                {hasFiles && (
                    <div className="space-y-2 mt-1 max-h-36 overflow-y-auto pr-1">
                        {files.map((fileItem) => (
                            <div
                                key={fileItem.id}
                                className="flex items-center justify-between rounded-lg border border-surface-300 bg-surface-0/80 px-2.5 py-1.5 text-xs font-mono"
                            >
                                <div className="min-w-0 flex-1 pr-2">
                                    <div className="truncate font-medium text-surface-800">
                                        {fileItem.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-surface-500">
                                        <span>{(fileItem.size / 1024).toFixed(1)} KB</span>
                                        <span>•</span>
                                        <span className="text-emerald-400 uppercase font-semibold">
                                            {fileItem.status}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFileRemoved(config.id, fileItem.id);
                                    }}
                                    className="text-surface-500 hover:text-red-400 transition-colors p-1"
                                    title="Remove file"
                                >
                                    <Icon name="cross" size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
