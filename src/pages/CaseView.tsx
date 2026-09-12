// src/pages/CaseView.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useCasesStore } from "../store/casesStore";
import { useDocumentsStore } from "../store/documentsStore";
import Navbar from "../components/layout/Navbar";
import DocumentList from "../components/documents/DocumentList";
import Icon from "../components/ui/Icon";
import TrackBadge from "../components/ui/TrackBadge";
import ConfidenceBadge from "../components/ui/ConfidenceBadge";
import SourceCitationPopover from "../components/ui/SourceCitationPopover";

// Center Analytics Components
import FactSheet from "../components/summary/FactSheet";
import LeadBoard from "../components/dashboard/analytics/LeadBoard";
import NetworkGraph from "../components/dashboard/analytics/NetworkGraph";
import GeoLocationView from "../components/dashboard/analytics/GeoLocationView";
import TimelineView from "../components/dashboard/analytics/TimelineView";
import IdentityResolutionView from "../components/dashboard/analytics/IdentityResolutionView";
import MOMatchList from "../components/dashboard/analytics/MOMatchList";
import TheoryBoard from "../components/dashboard/analytics/TheoryBoard";

// Drawers & Modals
import CaseWorkspaceDrawer from "../components/dashboard/CaseWorkspaceDrawer";
import DeltaIngestionModal from "../components/dashboard/DeltaIngestionModal";

import {
    mockFactSheet,
    mockFinancialTracing,
    mockDigitalForensics,
    mockCommunicationAnalysis,
    mockForensicEvidence,
    mockStructuringAlerts,
    mockAuditLog,
} from "../data/mockCaseData";

const SCROLLSPY_SECTIONS = [
    { id: "fact-sheet", label: "01. Fact Sheet", icon: "file-text" },
    { id: "lead-board", label: "02. Lead Board", icon: "shield" },
    { id: "knowledge-graph", label: "03. Knowledge Graph", icon: "network-graph" },
    { id: "financial-tracing", label: "04. Financial Tracing", icon: "wallet" },
    { id: "communication-analysis", label: "05. Communication", icon: "phone-tower" },
    { id: "digital-forensics", label: "06. Digital Forensics", icon: "terminal" },
    { id: "forensic-evidence", label: "07. Physical Evidence", icon: "evidence-tag" },
    { id: "geo-location", label: "08. Geo-Intelligence", icon: "map-pin" },
    { id: "timeline", label: "09. Chronology", icon: "clock" },
    { id: "identity-resolution", label: "10. Identity Resolution", icon: "fingerprint" },
    { id: "mo-matches", label: "11. MO / Serial Matches", icon: "radar" },
    { id: "theories", label: "12. Crime Theories", icon: "scale-justice" },
    { id: "investigative-brief", label: "13. Narrative Brief", icon: "file-text" },
    { id: "audit-log", label: "14. Audit & Confidence", icon: "check-circle" },
];

const GNN_SYNTHESIZED_DATA = {
    nodes: [
        { id: "ENT-RAJESH", label: "Rajesh Sharma", type: "person", badge: "Primary Suspect", risk_score: 0.95, merge_reason: "Direct KYC & surveillance fingerprint match" },
        { id: "ENT-VIKRAM", label: "Vikram Malhotra", type: "person", badge: "Associate", risk_score: 0.88, merge_reason: "Co-accused identified in Okhla warehouse seizure" },
        { id: "ENT-PHONE-9871", label: "Burner +91-9871...", type: "phone", badge: "Evidentiary", risk_score: 0.72, merge_reason: "Tower ping registered in South Delhi DEL-442" },
        { id: "ENT-BANK-HDFC", label: "HDFC A/C 9901", type: "bank_account", badge: "Laundering Hub", risk_score: 0.91, merge_reason: "Sole signatory mandate confirmed by HDFC compliance" },
        { id: "ENT-COMPANY-APEX", label: "Apex Logistics LLC", type: "company", badge: "Front Entity", risk_score: 0.85, merge_reason: "Fictitious ROC filing with forged Aadhaar credentials" },
        { id: "ENT-PERSON-AMIT", label: "Amit Singh", type: "person", badge: "Candidate Financier", risk_score: 0.78, merge_reason: "Beneficial ownership inferred from shared net-banking IP" },
        { id: "ENT-WALLET-BTC", label: "Wallet 0x8A1...", type: "wallet", badge: "High Risk", risk_score: 0.99, merge_reason: "Wasabi mixer cluster peel-chain tracking" },
        { id: "PHANTOM-DRIVER", label: "Phantom-Driver", type: "phantom", is_phantom: true, badge: "HYPOTHESIS", risk_score: 0.81, merge_reason: "Masked ATM operator identified at 08:00 AM" },
    ],
    edges: [
        { id: "g-e1", source: "ENT-RAJESH", target: "ENT-VIKRAM", label: "co_accused (142 calls)", color: "#475569", valid_from: "2026-08-01", is_hypothesis: false },
        { id: "g-e2", source: "ENT-RAJESH", target: "ENT-PHONE-9871", label: "owner", color: "#475569", valid_from: "2026-08-05", is_hypothesis: false },
        { id: "g-e3", source: "ENT-RAJESH", target: "ENT-BANK-HDFC", label: "signatory", color: "#475569", valid_from: "2024-01-01", is_hypothesis: false },
        { id: "g-e4", source: "ENT-BANK-HDFC", target: "ENT-COMPANY-APEX", label: "transferred ₹5M", color: "#ef4444", valid_from: "2026-08-10", is_hypothesis: false },
        { id: "g-e5", source: "ENT-VIKRAM", target: "ENT-COMPANY-APEX", label: "director nominee", color: "#475569", valid_from: "2026-08-20", is_hypothesis: false },
        { id: "g-e6", source: "ENT-COMPANY-APEX", target: "ENT-WALLET-BTC", label: "launder_path (96%)", color: "#8b5cf6", style: "dashed", is_hypothesis: true, probability: 0.96, valid_from: "2026-08-25", merge_reason: "GNN link prediction based on wallet withdrawal telemetry" },
        { id: "g-e7", source: "ENT-PERSON-AMIT", target: "ENT-COMPANY-APEX", label: "hidden_owner (92%)", color: "#8b5cf6", style: "dashed", is_hypothesis: true, probability: 0.92, valid_from: "2026-08-28", merge_reason: "Co-occurrence with proxy director on registration IP" },
        { id: "g-e8", source: "ENT-PHONE-9871", target: "PHANTOM-DRIVER", label: "suspected_relay (84%)", color: "#8b5cf6", style: "dashed", is_hypothesis: true, probability: 0.84, valid_from: "2026-09-04", merge_reason: "Cell tower overlap at ATM transaction minute" },
    ]
};

export default function CaseView() {
    const { caseId } = useParams();
    const cases = useCasesStore((state) => state.cases);
    const fetchCases = useCasesStore((state) => state.fetchCases);
    const { documents, fetchDocuments } = useDocumentsStore();

    // Scrollspy state
    const [activeSection, setActiveSection] = useState("fact-sheet");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDeltaModalOpen, setIsDeltaModalOpen] = useState(false);
    const [deltaDiffApplied, setDeltaDiffApplied] = useState(false);
    const [showReasoningTrace, setShowReasoningTrace] = useState(false);
    const [isLeftRailOpen, setIsLeftRailOpen] = useState(true);

    const mainScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cases.length === 0) fetchCases();
        if (caseId) fetchDocuments(caseId);
    }, [caseId, cases.length, fetchCases, fetchDocuments]);

    const caseData = cases.find((c) => c.id === caseId) || {
        id: caseId || "case-1",
        name: "FIR 101/2026: Apex Financial Syndicate Investigation",
        track: 2,
        triage_reason: "Multi-layered syndicate: 4 shell entities, Wasabi crypto mixer cluster, and international burner relays.",
        version: deltaDiffApplied ? 3 : 2,
    };

    // Scrollspy Intersection Observer
    useEffect(() => {
        const container = mainScrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const sectionElements = SCROLLSPY_SECTIONS.map((s) => ({
                id: s.id,
                el: document.getElementById(s.id),
            })).filter((s) => s.el !== null);

            const scrollPosition = container.scrollTop + 160;

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const item = sectionElements[i];
                if (item.el && item.el.offsetTop <= scrollPosition) {
                    setActiveSection(item.id);
                    break;
                }
            }
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (secId: string) => {
        const el = document.getElementById(secId);
        if (el && mainScrollRef.current) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(secId);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-surface-0 font-sans text-surface-700 overflow-hidden">
            <Navbar />

            {/* Tactical Grid Background Motif */}
            <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />

            {/* 3-Zone Workspace Shell */}
            <div className="relative flex min-h-0 flex-1 overflow-hidden z-10">
                {/* ── ZONE 1: LEFT RAIL (COLLAPSIBLE) ── */}
                <aside
                    className={`transition-all duration-300 ease-in-out border-r border-surface-300 bg-surface-100 flex flex-col shrink-0 overflow-hidden ${
                        isLeftRailOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-none"
                    }`}
                >
                    <div className="w-80 flex flex-col h-full overflow-hidden">
                        {/* Case Header & Track Badge */}
                        <div className="p-4 border-b border-surface-200/80 bg-surface-100/90 space-y-3">
                            <div className="flex items-center justify-between">
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-surface-400 hover:text-insignia-400 transition-colors"
                                >
                                    <Icon name="arrow-left" size={13} />
                                    <span>Case Directory</span>
                                </Link>
                                <span className="font-mono text-[11px] text-insignia-400 font-bold bg-insignia-500/10 px-2 py-0.5 rounded border border-insignia-500/20">
                                    v{caseData.version || 2}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-sm font-bold text-surface-900 leading-snug line-clamp-2">
                                    {caseData.name}
                                </h1>
                                <div className="mt-2">
                                    <TrackBadge track={(caseData.track as 1 | 2) || 2} size="sm" />
                                </div>
                            </div>

                            {/* Add New Evidence Button (Delta Ingestion) */}
                            <button
                                type="button"
                                onClick={() => setIsDeltaModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 font-bold px-3 py-2 text-xs transition-all shadow-sm cursor-pointer"
                            >
                                <Icon name="upload" size={14} />
                                <span>Add New Evidence</span>
                            </button>
                        </div>

                        {/* Scrollspy Jump-Links */}
                        <div className="p-3 border-b border-surface-200/80">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-bold block mb-2 px-2">
                                Analysis Jump Links
                            </span>
                            <nav className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                                {SCROLLSPY_SECTIONS.map((sec) => (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        onClick={() => scrollToSection(sec.id)}
                                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-mono text-left transition-colors cursor-pointer ${
                                            activeSection === sec.id
                                                ? "bg-insignia-500/15 text-insignia-400 font-bold border-l-2 border-insignia-400"
                                                : "text-surface-400 hover:text-surface-200 hover:bg-surface-200/50"
                                        }`}
                                    >
                                        <span className="truncate">{sec.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Case Documents Sub-List */}
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col">
                            <div className="flex items-center justify-between mb-2 px-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 font-bold">
                                    Case Evidence Files ({documents.length})
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1">
                                <DocumentList documents={documents} />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Left Rail Toggle Bar */}
                <button
                    type="button"
                    onClick={() => setIsLeftRailOpen(!isLeftRailOpen)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex h-12 w-3.5 items-center justify-center rounded-r bg-surface-200 border border-l-0 border-surface-300 text-surface-400 hover:text-white transition-colors"
                    title={isLeftRailOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    <Icon name={isLeftRailOpen ? "chevron-right" : "chevron-right"} size={10} className={isLeftRailOpen ? "rotate-180" : ""} />
                </button>

                {/* ── ZONE 2: CENTER (CONTINUOUSLY SCROLLABLE MAIN COLUMN) ── */}
                <main
                    ref={mainScrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 scroll-smooth"
                >
                    {/* Delta Ingestion Banner (shown if delta diff was applied) */}
                    {deltaDiffApplied && (
                        <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex items-start justify-between gap-3 shadow-lg">
                            <div className="flex items-start gap-2.5">
                                <Icon name="check-circle" size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-sm font-bold text-emerald-200">
                                        Delta Ingestion Synced (v3 Active)
                                    </strong>
                                    <span>
                                        4 new facts reconciled into Fact-Sheet, Amit Singh beneficial ownership verified, and Crime Theory upgraded to v3.
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDeltaDiffApplied(false)}
                                className="text-surface-400 hover:text-white text-xs"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* 1. FACT SHEET */}
                    <section id="fact-sheet" className="scroll-mt-4">
                        <FactSheet
                            data={mockFactSheet}
                            caseId={caseData.id}
                            isEmbedded={true}
                            showDiffIndicator={deltaDiffApplied}
                            onJumpToSection={scrollToSection}
                        />
                    </section>

                    {/* 2. INVESTIGATIVE LEAD BOARD */}
                    <section id="lead-board" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4">
                        <LeadBoard
                            onSelectLead={(lead) => {
                                setSelectedItem({
                                    id: lead.id,
                                    name: lead.title,
                                    type: `phantom_${lead.phantomType}`,
                                    confidence: lead.confidenceScore,
                                    details: {
                                        status: lead.status,
                                        recommendedAction: lead.recommendedAction,
                                        identifiedDate: lead.dateIdentified,
                                        ...lead.partialAttributes,
                                    },
                                    citation: {
                                        documentTitle: lead.sourceDocument,
                                        confidenceScore: lead.confidenceScore,
                                        pageOrOffset: "Lead Dossier",
                                        rawSnippet: `Unresolved lead attributes: ${JSON.stringify(lead.partialAttributes)}`
                                    },
                                    merge_reason: `Phantom Entity created from partial identifier match in ${lead.sourceDocument}`
                                });
                            }}
                        />
                    </section>

                    {/* 3. KNOWLEDGE GRAPH / GNN OUTPUT */}
                    <section id="knowledge-graph" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                    <Icon name="network-graph" size={16} className="text-insignia-400" />
                                    <span>Graph Neural Network (GNN) Holistic Entity Network</span>
                                </h3>
                                <p className="text-xs text-surface-500 mt-0.5">
                                    Unified force-directed topology merging confirmed evidentiary ties with probabilistic hypothesis edges.
                                </p>
                            </div>
                        </div>

                        <div className="h-[460px] w-full">
                            <NetworkGraph
                                data={GNN_SYNTHESIZED_DATA}
                                theme="digital"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 4. FINANCIAL TRACING + STRUCTURING ALERTS */}
                    <section id="financial-tracing" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200/80 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                    <Icon name="wallet" size={16} className="text-emerald-400" />
                                    <span>Financial Tracing & GBM Structuring Anomalies</span>
                                </h3>
                                <p className="text-xs text-surface-500 mt-0.5">
                                    Fund flow tracking from domestic corporate bank accounts to offshore crypto wash clusters.
                                </p>
                            </div>
                        </div>

                        {/* Compact Structuring-Alert List (GBM Output) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {mockStructuringAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    onClick={() => setSelectedItem({
                                        id: alert.id,
                                        name: alert.patternType,
                                        type: "structuring_anomaly",
                                        risk_score: alert.riskScore,
                                        confidence: alert.confidence,
                                        details: {
                                            account: alert.accountNumber,
                                            bank: alert.bankName,
                                            amount: alert.totalAmount,
                                            timeWindow: alert.timeWindow,
                                            gbmFeatures: alert.gbmFeatures.join("; "),
                                        },
                                        merge_reason: `GBM Gradient Boosted Model flagged anomalous cadence with ${alert.riskScore * 100}% certainty`
                                    })}
                                    className="cursor-pointer rounded-lg border border-amber-500/40 bg-amber-950/20 p-3.5 text-xs hover:border-amber-400 transition-colors flex flex-col justify-between gap-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="font-bold text-amber-300 font-mono text-[11px]">
                                            {alert.patternType}
                                        </div>
                                        <ConfidenceBadge score={alert.confidence} size="sm" />
                                    </div>
                                    <div className="font-mono text-[11px] text-surface-800">
                                        {alert.accountNumber} ({alert.bankName})
                                    </div>
                                    <div className="text-[10px] text-amber-400/80 font-mono">
                                        {alert.totalAmount}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-[420px] w-full mt-2">
                            <NetworkGraph
                                data={mockFinancialTracing}
                                theme="financial"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 5. COMMUNICATION ANALYSIS */}
                    <section id="communication-analysis" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200/80 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                    <Icon name="phone-tower" size={16} className="text-purple-400" />
                                    <span>Telecommunications & Burner Churn Analysis</span>
                                </h3>
                                <p className="text-xs text-surface-500 mt-0.5">
                                    Call detail record (CDR) link frequency and VoIP intermediary relay detection.
                                </p>
                            </div>

                            {/* Burner Churn Alert Strip */}
                            <div className="inline-flex items-center gap-2 rounded bg-red-950/60 border border-red-500/40 px-3 py-1 text-xs font-mono text-red-300">
                                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                                <span>High Churn Alert: Burner +91-9871 active 4 days only</span>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <NetworkGraph
                                data={mockCommunicationAnalysis}
                                theme="communication"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 6. DIGITAL FORENSICS */}
                    <section id="digital-forensics" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-4">
                        <div className="border-b border-surface-200/80 pb-3">
                            <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                <Icon name="terminal" size={16} className="text-blue-400" />
                                <span>Digital Forensics Artifacts & File Carving</span>
                            </h3>
                            <p className="text-xs text-surface-500 mt-0.5">
                                Seized MacBook and iPhone file systems, carve reports, and encrypted databases.
                            </p>
                        </div>
                        <div className="h-[400px] w-full">
                            <NetworkGraph
                                data={mockDigitalForensics}
                                theme="digital"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 7. FORENSIC EVIDENCE */}
                    <section id="forensic-evidence" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-4">
                        <div className="border-b border-surface-200/80 pb-3">
                            <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                <Icon name="evidence-tag" size={16} className="text-amber-400" />
                                <span>Physical Forensic Evidence & Laboratory Matches</span>
                            </h3>
                            <p className="text-xs text-surface-500 mt-0.5">
                                CFSL DNA swabbing, latent fingerprints, and toolmark striations.
                            </p>
                        </div>
                        <div className="h-[400px] w-full">
                            <NetworkGraph
                                data={mockForensicEvidence}
                                theme="evidence"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 8. GEO-LOCATION INTELLIGENCE */}
                    <section id="geo-location" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-3">
                        <div className="border-b border-surface-200/80 pb-3">
                            <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                <Icon name="map-pin" size={16} className="text-insignia-400" />
                                <span>Geospatial Intelligence & Movement Route</span>
                            </h3>
                            <p className="text-xs text-surface-500 mt-0.5">
                                Chronological movement vector linking primary suspect residence, drop points, and exfiltration attempt.
                            </p>
                        </div>
                        <div className="h-[440px] w-full">
                            <GeoLocationView onSelect={(item) => setSelectedItem(item)} />
                        </div>
                    </section>

                    {/* 9. TIMELINE */}
                    <section id="timeline" className="scroll-mt-4">
                        <TimelineView onSelect={(item) => setSelectedItem(item)} />
                    </section>

                    {/* 10. IDENTITY RESOLUTION */}
                    <section id="identity-resolution" className="scroll-mt-4">
                        <IdentityResolutionView onSelectCandidate={(cand) => setSelectedItem(cand)} />
                    </section>

                    {/* 11. MO-SIMILARITY / SERIAL-CRIME MATCHES */}
                    <section id="mo-matches" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4">
                        <MOMatchList />
                    </section>

                    {/* 12. CRIME RECONSTRUCTION THEORIES */}
                    <section id="theories" className="scroll-mt-4">
                        <TheoryBoard onJumpToLead={scrollToSection} />
                    </section>

                    {/* 13. INVESTIGATIVE BRIEF */}
                    <section id="investigative-brief" className="rounded-xl border border-surface-300 bg-surface-100 p-6 shadow-sm scroll-mt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-200/80 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                    <Icon name="file-text" size={16} className="text-insignia-400" />
                                    <span>Investigative Brief & Judicial Narrative</span>
                                </h3>
                                <p className="text-xs text-surface-500 mt-0.5">
                                    Cited natural-language brief compliant with Section 105 of the Bharatiya Sakshya Adhiniyam (BSA), 2023.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => alert("Dossier exported to BSA-2023 certified PDF with SHA-256 cryptographic chain-of-custody seal.")}
                                className="inline-flex items-center gap-2 rounded-lg border border-insignia-500/40 bg-insignia-500/10 hover:bg-insignia-500/20 text-insignia-300 px-3.5 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
                            >
                                <Icon name="shield" size={13} />
                                <span>Export BSA-2023 Document</span>
                            </button>
                        </div>

                        {/* Paragraph Narrative with Per-Sentence Clickable Citations */}
                        <div className="bg-surface-0/70 border border-surface-300 rounded-xl p-5 text-sm text-surface-800 leading-relaxed space-y-3 font-sans">
                            <p>
                                <SourceCitationPopover
                                    source={{
                                        documentTitle: "FIR 101/2026 Core Registration",
                                        pageOrOffset: "Page 1, Col 2",
                                        confidenceScore: 0.99,
                                        rawSnippet: "Accused Rajesh Sharma initiated corporate breach of trust against complainant Narang Exports."
                                    }}
                                >
                                    The investigation in FIR 101/2026 establishes that Rajesh Sharma acted as the syndicate principal, coordinating financial inducements amounting to ₹5 Crore through fraudulent bills of lading.
                                </SourceCitationPopover>{" "}
                                <SourceCitationPopover
                                    source={{
                                        documentTitle: "MCA Incorporation Dossier",
                                        pageOrOffset: "SPICe+ Verification",
                                        confidenceScore: 0.96,
                                        rawSnippet: "Apex Logistics LLC incorporated using falsified Aadhaar credentials under fictitious nominee."
                                    }}
                                >
                                    To provide commercial legitimacy, Apex Logistics LLC was incorporated using forged identity credentials, with nominee directorship maintained through proxy associates.
                                </SourceCitationPopover>{" "}
                                <SourceCitationPopover
                                    source={{
                                        documentTitle: "HDFC Bank Statement #9901",
                                        pageOrOffset: "Transaction UTR #HDFC9921",
                                        confidenceScore: 0.98,
                                        rawSnippet: "Rapid transfer of ₹4.8M to secondary ICICI account within 48 hours."
                                    }}
                                >
                                    Banking telemetry reflects high-velocity fund layering, where funds credited to HDFC A/C 9901 were disbursed within 48 hours to secondary intermediary accounts.
                                </SourceCitationPopover>
                            </p>

                            <p>
                                <SourceCitationPopover
                                    source={{
                                        documentTitle: "Blockchain Forensic Wasabi Clustering",
                                        pageOrOffset: "Cluster #99201",
                                        confidenceScore: 0.88,
                                        rawSnippet: "Conversion of ₹4.8M to 14.2 BTC followed by Wasabi peel-chain mixer routing."
                                    }}
                                >
                                    Forensic cryptocurrency analysis further identified the conversion of illicit proceeds into 14.2 BTC, which were subsequently routed through a Wasabi peel-chain coin-join mixer to an offshore exchange cluster.
                                </SourceCitationPopover>{" "}
                                <SourceCitationPopover
                                    source={{
                                        documentTitle: "Raid Panchnama Exhibit A",
                                        pageOrOffset: "Page 3",
                                        confidenceScore: 1.0,
                                        rawSnippet: "Detention of Vikram Malhotra at Okhla warehouse site."
                                    }}
                                >
                                    Physical enforcement operations conducted on September 4, 2026 resulted in the raid of an unregistered Okhla warehouse, where co-conspirator Vikram Malhotra was detained on-site alongside 50kg contraband.
                                </SourceCitationPopover>{" "}
                                <SourceCitationPopover
                                    source={{
                                        documentTitle: "LOC Intercept Record",
                                        pageOrOffset: "Notice LOC-2026-11",
                                        confidenceScore: 1.0,
                                        rawSnippet: "Subject Rajesh Sharma intercepted at IGI Airport Gate 14 attempting flight EK-512 exfiltration."
                                    }}
                                >
                                    Simultaneously, target Rajesh Sharma was intercepted at IGI Airport Terminal 3 attempting exfiltration on flight EK-512 under forged travel credentials.
                                </SourceCitationPopover>
                            </p>
                        </div>

                        {/* Expandable LLM Reasoning Trace */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowReasoningTrace(!showReasoningTrace)}
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-insignia-400 hover:text-insignia-300 font-bold transition-colors cursor-pointer"
                            >
                                <Icon name="terminal" size={13} />
                                <span>{showReasoningTrace ? "Hide AI Reasoning Trace" : "Show AI Reasoning Trace (Chain-of-Thought)"}</span>
                                <Icon name="chevron-down" size={12} className={`transition-transform ${showReasoningTrace ? "rotate-180" : ""}`} />
                            </button>

                            {showReasoningTrace && (
                                <div className="mt-3 rounded-xl border border-surface-300 bg-surface-0 p-4 font-mono text-xs text-insignia-300/90 leading-relaxed space-y-1.5 shadow-inner">
                                    <div>[Step 1] Entity Extraction: NER model extracted 24 named candidates across FIR text and seizure memo.</div>
                                    <div>[Step 2] Identity Disambiguation: Resolved 'Rajesh K. Sharma' to primary suspect node (score: 94%).</div>
                                    <div>[Step 3] Graph Synthesis: Constructed multi-partite graph linking HDFC, ICICI, Apex Logistics, and BTC Wallet.</div>
                                    <div>[Step 4] GNN Link Prediction: Inferred hidden ownership edge between Amit Singh and Apex Logistics (probability: 92%).</div>
                                    <div>[Step 5] Case Triage: Classified investigation as Track 2 (Complex Syndicate) due to multi-hop cross-border layering.</div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 14. AUDIT & CONFIDENCE PANEL */}
                    <section id="audit-log" className="rounded-xl border border-surface-300 bg-surface-100 p-5 shadow-sm scroll-mt-4 space-y-3">
                        <div className="border-b border-surface-200/80 pb-3">
                            <h3 className="text-base font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                <Icon name="check-circle" size={16} className="text-emerald-400" />
                                <span>Audit & Confidence Ledger — "Leads Not Verdicts"</span>
                            </h3>
                            <p className="text-xs text-surface-500 mt-0.5">
                                Transparent audit log of algorithmic merges, anomaly detections, and human verifications.
                            </p>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                            {mockAuditLog.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-surface-300 bg-surface-0/60"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-insignia-400 font-bold shrink-0">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span className="text-surface-800 font-bold">{log.action}:</span>
                                        <span className="text-surface-600">{log.description}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                        <ConfidenceBadge score={log.confidence} size="sm" />
                                        <span className="text-[10px] bg-surface-200 px-2 py-0.5 rounded text-surface-400">
                                            {log.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* ── ZONE 3: RIGHT RAIL (INSPECTOR DRAWER) ── */}
                <CaseWorkspaceDrawer
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            </div>

            {/* Delta Ingestion Slide-Over Modal */}
            <DeltaIngestionModal
                caseId={caseData.id}
                isOpen={isDeltaModalOpen}
                onClose={() => setIsDeltaModalOpen(false)}
                onDeltaComplete={() => setDeltaDiffApplied(true)}
            />
        </div>
    );
}
