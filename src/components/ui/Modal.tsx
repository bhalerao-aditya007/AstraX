import type { ReactNode } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md rounded-xl border border-surface-300 bg-surface-100 p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-bold text-surface-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-surface-400 transition hover:bg-surface-200 hover:text-surface-800"
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
