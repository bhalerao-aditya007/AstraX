import type { DocumentStatus } from "../../services/documents";

interface StatusBadgeProps {
    status: DocumentStatus;
}

const config: Record<
    DocumentStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className: "bg-surface-200 text-surface-400 border border-surface-300",
    },
    processing: {
        label: "Processing",
        className: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
    },
    success: {
        label: "Success",
        className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    },
    failed: {
        label: "Failed",
        className: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    },
    finish: {
        label: "Finished",
        className: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
    },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { label, className } = config[status] ?? {
        label: status,
        className: "bg-surface-200 text-surface-600",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
        >
            {label}
        </span>
    );
}
