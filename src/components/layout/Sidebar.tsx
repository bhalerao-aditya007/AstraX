import { useEffect, useState } from "react";

import { useCasesStore } from "../../store/casesStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import type { Case } from "../../services/cases";

import CaseList from "../cases/CaseList";
import CaseModal from "../cases/CaseModal";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";

type ModalState =
    | { mode: "closed" }
    | { mode: "create" }
    | { mode: "edit"; caseItem: Case };

export default function Sidebar() {
    const {
        cases,
        isLoading,
        error,
        fetchCases,
        createCase,
        updateCase,
        deleteCase,
    } = useCasesStore();

    const { selectedCaseId, clearCase } = useWorkspaceStore();

    const [modal, setModal] = useState<ModalState>({ mode: "closed" });
    const [deleteTarget, setDeleteTarget] = useState<Case | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    function openCreate() {
        setModal({ mode: "create" });
    }

    function openEdit(caseItem: Case) {
        setModal({ mode: "edit", caseItem });
    }

    function openDelete(caseItem: Case) {
        setDeleteError(null);
        setDeleteTarget(caseItem);
    }

    function closeModal() {
        setModal({ mode: "closed" });
    }

    async function handleModalSubmit(name: string) {
        if (modal.mode === "create") {
            await createCase({ name });
        } else if (modal.mode === "edit") {
            await updateCase(modal.caseItem.id, { name });
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteCase(deleteTarget.id);

            if (selectedCaseId === deleteTarget.id) {
                clearCase();
            }

            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(
                err instanceof Error ? err.message : "Failed to delete case"
            );
        } finally {
            setIsDeleting(false);
        }
    }

    const activeCount = cases.length;

    return (
        <>
            <aside className="flex w-72 shrink-0 flex-col bg-surface-50 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-300/50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                        <Icon name="folder" size={13} className="text-surface-500" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-surface-500">
                            Cases
                        </h2>
                        <span className="text-[9px] font-mono text-surface-400 bg-surface-200/60 px-1.5 py-0.5 rounded">
                            {activeCount}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        title="New case"
                        className="flex h-6 w-6 items-center justify-center rounded text-surface-500 transition hover:bg-insignia-500/12 hover:text-insignia-400"
                    >
                        <Icon name="plus" size={13} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-1.5">
                    {isLoading && <Loader label="Loading cases…" />}

                    {error && !isLoading && (
                        <div className="px-3 py-2">
                            <p className="text-xs text-red-400 font-mono">{error}</p>
                            <button
                                type="button"
                                onClick={fetchCases}
                                className="mt-1 text-[10px] text-surface-500 underline hover:text-surface-300"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <CaseList
                            cases={cases}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    )}
                </div>
            </aside>

            {/* Create / Edit Modal */}
            {modal.mode !== "closed" && (
                <CaseModal
                    existingCase={
                        modal.mode === "edit" ? modal.caseItem : undefined
                    }
                    onSubmit={handleModalSubmit}
                    onClose={closeModal}
                />
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => !isDeleting && setDeleteTarget(null)}
                    />

                    <div className="relative z-10 w-full max-w-sm rounded-lg border border-surface-300/70 bg-surface-100 p-6 shadow-2xl shadow-black/40 animate-fade-in">
                        <h2 className="text-sm font-bold text-surface-900">
                            Delete case?
                        </h2>

                        <p className="mt-2 text-xs text-surface-500">
                            <span className="font-semibold text-surface-900">
                                {deleteTarget.name}
                            </span>{" "}
                            and all its documents will be permanently deleted.
                        </p>

                        {deleteError && (
                            <p className="mt-3 text-xs text-red-400 font-mono">
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={isDeleting}
                                className="rounded-md border border-surface-300 bg-surface-200 px-3 py-1.5 text-xs font-medium text-surface-400 transition hover:bg-surface-300 hover:text-surface-900 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}