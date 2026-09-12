import type { Document } from "../../services/documents";

type UploadStage =
    | "idle"
    | "initiating"
    | "uploading"
    | "confirming"
    | "processing"
    | "done"
    | "error";

interface UploadProgressProps {
    stage: UploadStage;
    document: Document | null;
    error: string | null;
    onDone: () => void;
}

const stageLabels: Record<UploadStage, string> = {
    idle: "",
    initiating: "Preparing upload…",
    uploading: "Uploading file…",
    confirming: "Confirming upload…",
    processing: "Processing document…",
    done: "Upload complete",
    error: "Upload failed",
};

const stageOrder: UploadStage[] = [
    "initiating",
    "uploading",
    "confirming",
    "processing",
    "done",
];

export default function UploadProgress({
    stage,
    document,
    error,
    onDone,
}: UploadProgressProps) {
    if (stage === "idle") return null;

    const currentIndex = stageOrder.indexOf(stage);

    return (
        <div className="mt-4 rounded-lg border border-surface-300 bg-surface-200 p-4">
            {/* Step indicators */}
            <div className="mb-4 flex items-center gap-2">
                {stageOrder.map((s, i) => {
                    const isDone = i < currentIndex || stage === "done";
                    const isCurrent = s === stage;
                    const isError = stage === "error" && i === currentIndex;

                    return (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-mono font-bold transition-all ${
                                    isError
                                        ? "bg-rose-500 text-white"
                                        : isDone
                                          ? "bg-emerald-500 text-surface-0 font-bold"
                                          : isCurrent
                                            ? "border-2 border-amber-400 bg-transparent text-amber-400"
                                            : "border border-surface-400 bg-transparent text-surface-500"
                                }`}
                            >
                                {isDone ? "✓" : i + 1}
                            </div>

                            {i < stageOrder.length - 1 && (
                                <div
                                    className={`h-px w-4 ${
                                        isDone
                                            ? "bg-emerald-500/50"
                                            : "bg-surface-400/40"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <p
                className={`text-xs font-mono ${
                    stage === "error"
                        ? "text-rose-400"
                        : stage === "done"
                          ? "text-emerald-400"
                          : "text-surface-200"
                }`}
            >
                {stage === "error" && error ? error : stageLabels[stage]}
            </p>

            {stage !== "done" && stage !== "error" && (
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface-300 border-t-amber-400" />
                    <span className="text-xs font-mono text-surface-400">Processing stream...</span>
                </div>
            )}

            {stage === "done" && document && (
                <div className="mt-3">
                    <p className="text-xs font-mono text-surface-400">
                        <span className="font-semibold text-surface-200">
                            {document.title}
                        </span>{" "}
                        ingested into evidentiary archive. Status:{" "}
                        <span className="text-emerald-400 font-semibold uppercase">
                            {document.status}
                        </span>
                    </p>

                    <button
                        type="button"
                        onClick={onDone}
                        className="mt-3 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-surface-0 hover:bg-amber-400 transition shadow"
                    >
                        Acknowledge
                    </button>
                </div>
            )}
        </div>
    );
}
