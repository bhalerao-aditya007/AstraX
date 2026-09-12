// src/components/layout/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import Icon from "../ui/Icon";

export default function Navbar() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-300 bg-surface-100/95 px-5 z-30 font-sans backdrop-blur-md">
            {/* Logo + Emblem */}
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-insignia-500/15 border border-insignia-500/40 text-insignia-400 shadow-[0_0_12px_rgba(201,162,39,0.2)] group-hover:scale-105 transition-transform">
                        <Icon name="shield" size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-extrabold tracking-tight text-surface-900 leading-none flex items-center gap-1.5">
                            <span>AstraX</span>
                            <span className="text-[10px] font-mono font-bold bg-insignia-500/20 text-insignia-300 px-1.5 py-0.2 rounded border border-insignia-500/30">
                                OPS
                            </span>
                        </span>
                        <span className="text-[9px] font-mono tracking-wider text-surface-400 uppercase mt-0.5">
                            Criminal Network Intelligence
                        </span>
                    </div>
                </Link>

                {/* Primary Nav Links */}
                <nav className="hidden sm:flex items-center gap-1 font-mono text-xs">
                    <Link
                        to="/intake"
                        className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                            isActive("/intake")
                                ? "bg-insignia-500/15 text-insignia-400 border border-insignia-500/30"
                                : "text-surface-400 hover:text-surface-200 hover:bg-surface-200/50"
                        }`}
                    >
                        Evidence Intake
                    </Link>
                    <Link
                        to="/dashboard"
                        className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                            isActive("/dashboard") || isActive("/cases")
                                ? "bg-insignia-500/15 text-insignia-400 border border-insignia-500/30"
                                : "text-surface-400 hover:text-surface-200 hover:bg-surface-200/50"
                        }`}
                    >
                        Case Directory
                    </Link>
                </nav>
            </div>

            {/* Right Status Indicator */}
            <div className="flex items-center gap-4 text-xs font-mono">
                <div className="hidden md:flex items-center gap-2 text-surface-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span>Air-Gapped Node #DEL-04</span>
                </div>

                <Link
                    to="/intake"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 font-bold px-3 py-1.5 text-xs transition-colors shadow cursor-pointer"
                >
                    <Icon name="plus" size={13} />
                    <span>New Intake</span>
                </Link>
            </div>
        </header>
    );
}