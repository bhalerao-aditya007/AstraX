// src/components/cases/CaseItem.tsx
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../../store/workspaceStore";
import type { Case } from "../../services/cases";
import Icon from "../ui/Icon";

interface CaseItemProps {
    caseItem: Case;
    onEdit: (caseItem: Case) => void;
    onDelete: (caseItem: Case) => void;
}

export default function CaseItem({ caseItem, onEdit, onDelete }: CaseItemProps) {
    const selectedCaseId = useWorkspaceStore((state) => state.selectedCaseId);
    const selectCase = useWorkspaceStore((state) => state.selectCase);
    const navigate = useNavigate();

    const isSelected = selectedCaseId === caseItem.id;
    const isTrack2 = (caseItem.track ?? 2) === 2;

    return (
        <div
            className={`group relative flex items-center rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer font-sans border ${
                isSelected
                    ? "bg-insignia-500/15 border-insignia-500/40 text-surface-900 font-semibold shadow-sm"
                    : "border-transparent text-surface-400 hover:text-surface-200 hover:bg-surface-200/50"
            }`}
            onClick={() => selectCase(caseItem.id)}
        >
            {/* Left Accent Bar */}
            {isSelected && (
                <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-insignia-400" />
            )}

            {/* Case Icon Avatar */}
            <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                    isSelected
                        ? "bg-insignia-500/20 text-insignia-400 border border-insignia-500/30"
                        : "bg-surface-200 text-surface-400"
                }`}
            >
                <Icon name={isTrack2 ? "network-graph" : "scale-justice"} size={13} />
            </div>

            <div className="ml-2.5 min-w-0 flex-1">
                <div className="truncate text-surface-900 font-medium">{caseItem.name}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-surface-500 mt-0.5">
                    <span className={isTrack2 ? "text-insignia-400" : "text-surface-400"}>
                        Track {caseItem.track ?? 2}
                    </span>
                    <span>•</span>
                    <span>{new Date(caseItem.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex shrink-0 items-center gap-1 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cases/${caseItem.id}`);
                    }}
                    title="Open Case Analysis Workspace"
                    className="flex h-6 w-6 items-center justify-center rounded text-insignia-400 hover:bg-insignia-500/20 transition-colors"
                >
                    <Icon name="external-link" size={13} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(caseItem);
                    }}
                    title="Edit Case Name"
                    className="flex h-6 w-6 items-center justify-center rounded text-surface-400 hover:bg-surface-200 hover:text-surface-200 transition-colors"
                >
                    <Icon name="edit" size={13} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(caseItem);
                    }}
                    title="Delete Case"
                    className="flex h-6 w-6 items-center justify-center rounded text-surface-400 hover:bg-red-950/50 hover:text-red-400 transition-colors"
                >
                    <Icon name="trash" size={13} />
                </button>
            </div>
        </div>
    );
}
