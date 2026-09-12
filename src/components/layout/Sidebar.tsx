import { useEffect, useState } from "react";

import { useCasesStore } from "../../store/casesStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import type { Case } from "../../services/cases";

import CaseList from "../cases/CaseList";
import CaseModal from "../cases/CaseModal";
import Loader from "../ui/Loader";

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

    return (
        <>
            <aside className="flex w-72 shrink-0 flex-col border-r border-surface-200 bg-surface-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-surface-200 px-4 py-3.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                        Cases
                    </h2>

                    <button
                        type="button"
                        onClick={openCreate}
                        title="New case"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-surface-500 transition hover:bg-brand-50 hover:text-brand-600"
                    >
                        +
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-2">
                    {isLoading && <Loader label="Loading cases…" />}

                    {error && !isLoading && (
                        <div className="px-3 py-2">
                            <p className="text-sm text-red-600">{error}</p>
                            <button
                                type="button"
                                onClick={fetchCases}
                                className="mt-1 text-xs text-surface-500 underline hover:text-surface-700"
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

                    <div className="relative z-10 w-full max-w-sm rounded-xl border border-surface-200 bg-surface-100 p-6 shadow-2xl">
                        <h2 className="text-base font-bold text-surface-900">
                            Delete case?
                        </h2>

                        <p className="mt-2 text-sm text-surface-400">
                            <span className="font-semibold text-surface-900">
                                {deleteTarget.name}
                            </span>{" "}
                            and all its documents will be permanently deleted.
                        </p>

                        {deleteError && (
                            <p className="mt-3 text-sm text-rose-400 font-mono">
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={isDeleting}
                                className="rounded-lg border border-surface-300 bg-surface-200 px-4 py-2 text-sm font-medium text-surface-300 transition hover:bg-surface-300 hover:text-surface-900 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
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