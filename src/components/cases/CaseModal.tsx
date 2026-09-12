import { useState } from "react";
import type { Case } from "../../services/cases";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface CaseModalProps {
    existingCase?: Case;
    onSubmit: (name: string) => Promise<void>;
    onClose: () => void;
}

export default function CaseModal({ existingCase, onSubmit, onClose }: CaseModalProps) {
    const [name, setName] = useState(existingCase?.name ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = Boolean(existingCase);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit(name.trim());
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal title={isEditing ? "Edit Case" : "Create Case"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="case-name" className="mb-1.5 block text-sm font-medium text-surface-700">
                        Case Name
                    </label>
                    <input
                        id="case-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Financial Fraud Investigation"
                        autoFocus
                        className="w-full rounded-lg border border-surface-300 bg-surface-200 px-3 py-2 text-sm text-surface-900 placeholder-surface-500 outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20"
                    />
                </div>

                {error && <p className="text-sm text-rose-400 font-mono">{error}</p>}

                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Saving…" : isEditing ? "Save" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
