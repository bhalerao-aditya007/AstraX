export default function Loader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex items-center gap-2 text-xs font-mono text-surface-400">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface-300 border-t-amber-400" />
            {label}
        </div>
    );
}
