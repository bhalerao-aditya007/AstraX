// src/pages/ExtractionSummary.tsx
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import FactSheet from "../components/summary/FactSheet";
import Icon from "../components/ui/Icon";
import { useCasesStore } from "../store/casesStore";
import { mockFactSheet } from "../data/mockCaseData";

export default function ExtractionSummary() {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const cases = useCasesStore((state) => state.cases);
    const fetchCases = useCasesStore((state) => state.fetchCases);

    useEffect(() => {
        if (cases.length === 0) {
            fetchCases();
        }
    }, [cases.length, fetchCases]);

    const currentCase = cases.find((c) => c.id === caseId) || {
        id: caseId || "case-1",
        name: "FIR 101/2026: Apex Financial Syndicate",
        track: (mockFactSheet.track as 1 | 2),
        triage_reason: mockFactSheet.triageReason,
    };

    const caseFactData = {
        ...mockFactSheet,
        caseId: currentCase.id,
        firNumber: currentCase.name,
        track: (currentCase.track ?? 2) as 1 | 2,
        triageReason: currentCase.triage_reason || mockFactSheet.triageReason,
    };

    return (
        <div className="min-h-screen bg-surface-0 flex flex-col font-sans">
            <Navbar />

            {/* Tactical Grid Background */}
            <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

            {/* Main Content */}
            <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                {/* Navigation Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/intake")}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-400 hover:text-surface-200 hover:bg-surface-200 transition-colors"
                        >
                            <Icon name="arrow-left" size={14} />
                            <span>Back to Evidence Intake</span>
                        </button>
                        <span className="text-surface-500 text-xs">•</span>
                        <Link
                            to="/dashboard"
                            className="text-xs text-surface-400 hover:text-surface-200 transition-colors"
                        >
                            Case Directory
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400">
                            Multi-Source Ingestion Verified
                        </span>
                    </div>
                </div>

                {/* The 7-Section Fact Sheet */}
                <FactSheet
                    data={caseFactData}
                    caseId={currentCase.id}
                    isEmbedded={false}
                />
            </main>
        </div>
    );
}
