import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "danger";
    size?: "sm" | "md";
    children: ReactNode;
}

const variantClasses = {
    primary:
        "bg-amber-500 text-surface-0 font-bold hover:bg-amber-400 disabled:opacity-50 shadow-sm transition",
    ghost:
        "border border-surface-300 bg-surface-200 text-surface-300 hover:bg-surface-300 hover:text-surface-900 disabled:opacity-50 transition",
    danger:
        "bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-50 transition",
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
};

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
