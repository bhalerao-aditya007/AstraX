import type { Document } from "../../services/documents";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentsStore } from "../../store/documentsStore";
import StatusBadge from "../ui/StatusBadge";

interface DocumentItemProps {
    document: Document;
}

export default function DocumentItem({ document }: DocumentItemProps) {
    const selectedDocumentId = useWorkspaceStore((state) => state.selectedDocumentId);
    const selectDocument = useWorkspaceStore((state) => state.selectDocument);
    const clearDocument = useWorkspaceStore((state) => state.clearDocument);
    const deleteDocument = useDocumentsStore((state) => state.deleteDocument);

    const isSelected = selectedDocumentId === document.id;

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm(`Delete "${document.title}"?`)) return;

        try {
            if (isSelected) clearDocument();
            await deleteDocument(document.id);
        } catch {
            // Error handled silently
        }
    }

    return (
        <div
            onClick={() => selectDocument(document.id)}
            className={`group relative cursor-pointer rounded-xl border p-4 transition ${
                isSelected
                    ? "border-amber-500/50 bg-amber-500/10 shadow-sm"
                    : "border-surface-200 bg-surface-100 hover:border-surface-300 hover:bg-surface-200/60 hover:shadow-sm"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-surface-400">
                        {document.document_type === "image" && (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                        )}
                        {document.document_type === "voice" && (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                        )}
                        {document.document_type === "text" && (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-surface-900">
                            {document.title}
                        </h3>
                    <p className="mt-1 truncate text-xs text-surface-500">
                        {document.description}
                    </p>
                </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={document.status} />

                    <button
                        type="button"
                        onClick={handleDelete}
                        title="Delete document"
                        className={`flex h-6 w-6 items-center justify-center rounded text-surface-400 transition hover:bg-rose-500/20 hover:text-rose-400 ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-2.5 flex items-center gap-3 text-xs text-surface-400">
                <span className="capitalize">{document.document_type}</span>
                <span>·</span>
                <span>{new Date(document.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}