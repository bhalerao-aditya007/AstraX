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
    mockPhantomLeads,
    mockTheories,
    mockMOMatches,
} from "../data/mockCaseData";
import {
    triggerHistoricalAnalysis,
    getCaseGraph,
    type GraphData,
    type AnalysisReport,
} from "../services/analytics";

const SCROLLSPY_SECTIONS = [
    { id: "fact-sheet", label: "Fact Sheet", icon: "file-text", num: "01" },
    { id: "lead-board", label: "Lead Board", icon: "shield", num: "02" },
    { id: "knowledge-graph", label: "Knowledge Graph", icon: "network-graph", num: "03" },
    { id: "financial-tracing", label: "Financial Tracing", icon: "wallet", num: "04" },
    { id: "communication-analysis", label: "Communications", icon: "phone-tower", num: "05" },
    { id: "digital-forensics", label: "Digital Forensics", icon: "terminal", num: "06" },
    { id: "forensic-evidence", label: "Physical Evidence", icon: "evidence-tag", num: "07" },
    { id: "geo-location", label: "Geo-Intelligence", icon: "map-pin", num: "08" },
    { id: "timeline", label: "Chronology", icon: "clock", num: "09" },
    { id: "identity-resolution", label: "Identity Resolution", icon: "fingerprint", num: "10" },
    { id: "mo-matches", label: "MO / Serial Matches", icon: "radar", num: "11" },
    { id: "theories", label: "Crime Theories", icon: "scale-justice", num: "12" },
    { id: "investigative-brief", label: "Narrative Brief", icon: "file-text", num: "13" },
    { id: "audit-log", label: "Audit & Confidence", icon: "check-circle", num: "14" },
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

    // Live AI Analysis State
    const [liveReport, setLiveReport] = useState<AnalysisReport | null>(null);
    const [liveGraph, setLiveGraph] = useState<GraphData | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const mainScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cases.length === 0) fetchCases();
        if (caseId) {
            fetchDocuments(caseId);
            getCaseGraph(caseId)
                .then((g) => {
                    if (g && g.nodes?.length > 0) setLiveGraph(g);
                })
                .catch(() => {});
        }
    }, [caseId, cases.length, fetchCases, fetchDocuments]);

    const handleRunAIAnalysis = async () => {
        if (!caseId) return;
        setIsAnalyzing(true);
        try {
            const [report, graph] = await Promise.all([
                triggerHistoricalAnalysis(caseId),
                getCaseGraph(caseId),
            ]);
            setLiveReport(report);
            if (graph && graph.nodes?.length > 0) {
                setLiveGraph(graph);
            }
            setDeltaDiffApplied(true);
        } catch (err) {
            console.error("Historical analysis error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const caseData = cases.find((c) => c.id === caseId) || {
        id: caseId || "case-1",
        name: "FIR 101/2026: Apex Financial Syndicate Investigation",
        track: 2,
        triage_reason: "Multi-layered syndicate: 4 shell entities, Wasabi crypto mixer cluster, and international burner relays.",
        version: deltaDiffApplied ? 3 : 2,
    };

    const liveIdentityData =
        liveReport?.entities && liveReport.entities.length > 0
            ? {
                  target: caseData.name || "Primary Subject",
                  candidates: liveReport.entities.map((e, idx) => ({
                      id: e.id || `live-cand-${idx}`,
                      name: e.name,
                      confidence: 88,
                      source: e.source || "Live AstraX NLP Pipeline",
                      matchingAttributes: e.matchingAttributes || ["Identified in FIR extraction record"],
                      conflictingAttributes: [] as string[],
                      reasoning: `Extracted via AstraX live entity resolution pipeline for ${caseData.name}.`,
                  })),
              }
            : undefined;

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

    /* ─── Section Header Helper ─── */
    const SectionHeader = ({ num, icon, title, subtitle }: { num: string; icon: string; title: string; subtitle: string }) => (
        <div className="panel-header mb-4">
            <div>
                <h3 className="text-sm font-bold text-surface-900 tracking-tight flex items-center gap-2">
                    <span className="text-[10px] font-mono text-surface-500 font-medium">{num}</span>
                    <Icon name={icon as any} size={14} className="text-insignia-400" />
                    <span>{title}</span>
                </h3>
                <p className="text-[10px] text-surface-500 mt-0.5 ml-[52px]">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen flex-col bg-surface-0 font-sans text-surface-700 overflow-hidden">
            <Navbar />

            {/* Tactical Grid Background */}
            <div className="absolute inset-0 bg-tactical-fine opacity-100 pointer-events-none" />

            {/* 3-Zone Workspace Shell */}
            <div className="relative flex min-h-0 flex-1 overflow-hidden z-10">
                {/* ── ZONE 1: LEFT RAIL ── */}
                <aside
                    className={`transition-all duration-300 ease-in-out border-r border-surface-300/50 bg-surface-50 flex flex-col shrink-0 overflow-hidden ${
                        isLeftRailOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-none"
                    }`}
                >
                    <div className="w-72 flex flex-col h-full overflow-hidden">
                        {/* Case Header */}
                        <div className="p-3 border-b border-surface-300/50 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-surface-500 hover:text-insignia-400 transition-colors"
                                >
                                    <Icon name="arrow-left" size={11} />
                                    <span>Case Directory</span>
                                </Link>
                                <span className="font-mono text-[9px] text-insignia-400 font-bold bg-insignia-500/10 px-1.5 py-0.5 rounded border border-insignia-500/20">
                                    v{caseData.version || 2}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-xs font-bold text-surface-900 leading-snug line-clamp-2">
                                    {caseData.name}
                                </h1>
                                <div className="mt-1.5">
                                    <TrackBadge track={(caseData.track as 1 | 2) || 2} size="sm" />
                                </div>
                            </div>

                            {/* AI Reconstruction */}
                            <button
                                type="button"
                                disabled={isAnalyzing}
                                onClick={handleRunAIAnalysis}
                                className="w-full flex items-center justify-center gap-2 rounded-md bg-violet-600/90 hover:bg-violet-500 text-white font-bold px-3 py-1.5 text-[11px] transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Icon name="radar" size={12} />
                                <span>{isAnalyzing ? "Synthesizing..." : "Run AI Reconstruction"}</span>
                            </button>

                            {/* Add Evidence */}
                            <button
                                type="button"
                                onClick={() => setIsDeltaModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 rounded-md bg-insignia-500/90 hover:bg-insignia-400 text-surface-0 font-bold px-3 py-1.5 text-[11px] transition-all cursor-pointer"
                            >
                                <Icon name="upload" size={12} />
                                <span>Add New Evidence</span>
                            </button>
                        </div>

                        {/* Scrollspy Navigation */}
                        <div className="p-2.5 border-b border-surface-300/50">
                            <span className="section-label block mb-1.5 px-2">
                                Analysis Sections
                            </span>
                            <nav className="space-y-px max-h-44 overflow-y-auto pr-1">
                                {SCROLLSPY_SECTIONS.map((sec) => (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        onClick={() => scrollToSection(sec.id)}
                                        className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[10px] font-mono text-left transition-colors cursor-pointer ${
                                            activeSection === sec.id
                                                ? "bg-insignia-500/10 text-insignia-400 font-bold border-l-2 border-insignia-400"
                                                : "text-surface-500 hover:text-surface-300 hover:bg-surface-200/30"
                                        }`}
                                    >
                                        <span className="text-surface-500/60 w-4 text-right">{sec.num}</span>
                                        <span className="truncate">{sec.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Case Documents */}
                        <div className="flex-1 overflow-y-auto p-2.5 flex flex-col">
                            <div className="flex items-center justify-between mb-1.5 px-2">
                                <span className="section-label">
                                    Evidence Files ({documents.length})
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1">
                                <DocumentList documents={documents} />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Left Rail Toggle */}
                <button
                    type="button"
                    onClick={() => setIsLeftRailOpen(!isLeftRailOpen)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex h-10 w-3 items-center justify-center rounded-r bg-surface-200/80 border border-l-0 border-surface-300/50 text-surface-500 hover:text-insignia-400 hover:bg-surface-200 transition-colors"
                    title={isLeftRailOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    <Icon name={isLeftRailOpen ? "chevron-right" : "chevron-right"} size={9} className={isLeftRailOpen ? "rotate-180" : ""} />
                </button>

                {/* ── ZONE 2: CENTER MAIN ── */}
                <main
                    ref={mainScrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-5 scroll-smooth"
                >
                    {/* Delta Banner */}
                    {deltaDiffApplied && (
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-start justify-between gap-3 animate-fade-in">
                            <div className="flex items-start gap-2">
                                <Icon name="check-circle" size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-xs font-bold text-emerald-200">
                                        Delta Ingestion Synced (v3 Active)
                                    </strong>
                                    <span className="text-[10px]">
                                        4 new facts reconciled into Fact-Sheet, Amit Singh beneficial ownership verified, and Crime Theory upgraded to v3.
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDeltaDiffApplied(false)}
                                className="text-surface-500 hover:text-white text-[10px] shrink-0"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* 1. FACT SHEET */}
                    <section id="fact-sheet" className="scroll-mt-4">
                        <FactSheet
                            data={liveReport?.fact_sheet || mockFactSheet}
                            caseId={caseData.id}
                            isEmbedded={true}
                            showDiffIndicator={deltaDiffApplied}
                            onJumpToSection={scrollToSection}
                        />
                    </section>

                    {/* 2. LEAD BOARD */}
                    <section id="lead-board" className="panel p-4 shadow-sm scroll-mt-4">
                        <LeadBoard
                            data={
                                liveReport?.priority_leads && liveReport.priority_leads.length > 0
                                    ? liveReport.priority_leads.map((lead) => ({
                                          id: lead.entity_id,
                                          title: lead.display_name,
                                          phantomType: "person" as const,
                                          confidenceScore: lead.score,
                                          status: "open" as const,
                                          dateIdentified: "Live Inference",
                                          sourceDocument: "AstraX AI Historical Linker",
                                          partialAttributes: {
                                              gnn_probability: `${(lead.components.gnn_probability * 100).toFixed(1)}%`,
                                              centrality: `${(lead.components.centrality * 100).toFixed(1)}%`,
                                              mo_similarity: `${(lead.components.mo_similarity * 100).toFixed(1)}%`,
                                          },
                                          recommendedAction: "Verify cross-case linkage and cell tower overlaps",
                                      }))
                                    : mockPhantomLeads
                            }
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

                    {/* 3. KNOWLEDGE GRAPH */}
                    <section id="knowledge-graph" className="panel p-4 shadow-sm scroll-mt-4 space-y-3">
                        <SectionHeader
                            num="03"
                            icon="network-graph"
                            title="GNN Holistic Entity Network"
                            subtitle="Force-directed topology merging confirmed evidentiary ties with probabilistic hypothesis edges."
                        />

                        <div className="h-[480px] w-full">
                            <NetworkGraph
                                data={liveGraph || GNN_SYNTHESIZED_DATA}
                                theme="digital"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 4. FINANCIAL TRACING */}
                    <section id="financial-tracing" className="panel p-4 shadow-sm scroll-mt-4 space-y-4">
                        <SectionHeader
                            num="04"
                            icon="wallet"
                            title="Financial Tracing & Structuring Anomalies"
                            subtitle="Fund flow tracking from domestic corporate accounts to offshore crypto wash clusters."
                        />

                        {/* Structuring Alerts */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                                        merge_reason: `GBM flagged anomalous cadence with ${alert.riskScore * 100}% certainty`
                                    })}
                                    className="cursor-pointer rounded-md border border-amber-500/25 bg-amber-950/15 p-3 text-xs hover:border-amber-400/50 transition-colors flex flex-col justify-between gap-1.5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="font-bold text-amber-300 font-mono text-[10px]">
                                            {alert.patternType}
                                        </div>
                                        <ConfidenceBadge score={alert.confidence} size="sm" />
                                    </div>
                                    <div className="font-mono text-[10px] text-surface-700">
                                        {alert.accountNumber} ({alert.bankName})
                                    </div>
                                    <div className="text-[9px] text-amber-400/70 font-mono">
                                        {alert.totalAmount}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-[400px] w-full">
                            <NetworkGraph
                                data={mockFinancialTracing}
                                theme="financial"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 5. COMMUNICATION ANALYSIS */}
                    <section id="communication-analysis" className="panel p-4 shadow-sm scroll-mt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200/50 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-surface-500 font-medium">05</span>
                                    <Icon name="phone-tower" size={14} className="text-violet-400" />
                                    <span>Telecommunications & Burner Churn Analysis</span>
                                </h3>
                                <p className="text-[10px] text-surface-500 mt-0.5 ml-[52px]">
                                    CDR link frequency and VoIP intermediary relay detection.
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-1.5 rounded-md bg-red-950/40 border border-red-500/25 px-2.5 py-1 text-[10px] font-mono text-red-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                                <span>High Churn: Burner +91-9871 active 4 days</span>
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
                    <section id="digital-forensics" className="panel p-4 shadow-sm scroll-mt-4 space-y-3">
                        <SectionHeader
                            num="06"
                            icon="terminal"
                            title="Digital Forensics Artifacts"
                            subtitle="Seized device file systems, carve reports, and encrypted databases."
                        />
                        <div className="h-[400px] w-full">
                            <NetworkGraph
                                data={mockDigitalForensics}
                                theme="digital"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 7. FORENSIC EVIDENCE */}
                    <section id="forensic-evidence" className="panel p-4 shadow-sm scroll-mt-4 space-y-3">
                        <SectionHeader
                            num="07"
                            icon="evidence-tag"
                            title="Physical Forensic Evidence & Lab Matches"
                            subtitle="CFSL DNA, latent fingerprints, and toolmark striations."
                        />
                        <div className="h-[400px] w-full">
                            <NetworkGraph
                                data={mockForensicEvidence}
                                theme="evidence"
                                onNodeClick={(node) => setSelectedItem(node)}
                            />
                        </div>
                    </section>

                    {/* 8. GEO-INTELLIGENCE */}
                    <section id="geo-location" className="panel p-4 shadow-sm scroll-mt-4 space-y-3">
                        <SectionHeader
                            num="08"
                            icon="map-pin"
                            title="Geospatial Intelligence & Movement"
                            subtitle="Chronological movement vector linking suspect locations and drop points."
                        />
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
                        <IdentityResolutionView
                            data={liveIdentityData}
                            onSelectCandidate={(cand) => setSelectedItem(cand)}
                        />
                    </section>

                    {/* 11. MO MATCHES */}
                    <section id="mo-matches" className="panel p-4 shadow-sm scroll-mt-4">
                        <MOMatchList
                            data={
                                liveReport?.mo_matches?.matched_historical_cases &&
                                liveReport.mo_matches.matched_historical_cases.length > 0
                                    ? liveReport.mo_matches.matched_historical_cases
                                    : mockMOMatches
                            }
                        />
                    </section>

                    {/* 12. CRIME THEORIES */}
                    <section id="theories" className="scroll-mt-4">
                        <TheoryBoard
                            data={
                                liveReport?.theories && liveReport.theories.length > 0
                                    ? liveReport.theories
                                    : mockTheories
                            }
                            onJumpToLead={scrollToSection}
                        />
                    </section>

                    {/* 13. INVESTIGATIVE BRIEF */}
                    <section id="investigative-brief" className="panel p-5 shadow-sm scroll-mt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-200/50 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-surface-900 tracking-tight flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-surface-500 font-medium">13</span>
                                    <Icon name="file-text" size={14} className="text-insignia-400" />
                                    <span>Investigative Brief & Judicial Narrative</span>
                                </h3>
                                <p className="text-[10px] text-surface-500 mt-0.5 ml-[52px]">
                                    Cited brief compliant with Section 105, Bharatiya Sakshya Adhiniyam (BSA), 2023.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => alert("Dossier exported to BSA-2023 certified PDF with SHA-256 cryptographic chain-of-custody seal.")}
                                className="inline-flex items-center gap-1.5 rounded-md border border-insignia-500/30 bg-insignia-500/10 hover:bg-insignia-500/20 text-insignia-300 px-3 py-1.5 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                            >
                                <Icon name="shield" size={11} />
                                <span>Export BSA-2023 Document</span>
                            </button>
                        </div>

                        {/* Narrative */}
                        <div className="bg-surface-0/50 border border-surface-300/50 rounded-lg p-4 text-xs text-surface-700 leading-relaxed space-y-3 font-sans">
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

                        {/* Reasoning Trace */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowReasoningTrace(!showReasoningTrace)}
                                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-insignia-400 hover:text-insignia-300 font-bold transition-colors cursor-pointer"
                            >
                                <Icon name="terminal" size={11} />
                                <span>{showReasoningTrace ? "Hide AI Reasoning Trace" : "Show AI Reasoning Trace"}</span>
                                <Icon name="chevron-down" size={10} className={`transition-transform ${showReasoningTrace ? "rotate-180" : ""}`} />
                            </button>

                            {showReasoningTrace && (
                                <div className="mt-2 rounded-lg border border-surface-300/50 bg-surface-0 p-3 font-mono text-[10px] text-insignia-300/80 leading-relaxed space-y-1 animate-fade-in">
                                    <div>[Step 1] Entity Extraction: NER model extracted 24 named candidates across FIR text and seizure memo.</div>
                                    <div>[Step 2] Identity Disambiguation: Resolved 'Rajesh K. Sharma' to primary suspect node (score: 94%).</div>
                                    <div>[Step 3] Graph Synthesis: Constructed multi-partite graph linking HDFC, ICICI, Apex Logistics, and BTC Wallet.</div>
                                    <div>[Step 4] GNN Link Prediction: Inferred hidden ownership edge between Amit Singh and Apex Logistics (probability: 92%).</div>
                                    <div>[Step 5] Case Triage: Classified investigation as Track 2 (Complex Syndicate) due to multi-hop cross-border layering.</div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 14. AUDIT & CONFIDENCE */}
                    <section id="audit-log" className="panel p-4 shadow-sm scroll-mt-4 space-y-3">
                        <SectionHeader
                            num="14"
                            icon="check-circle"
                            title='Audit & Confidence — "Leads Not Verdicts"'
                            subtitle="Transparent audit log of algorithmic merges, anomaly detections, and human verifications."
                        />

                        <div className="space-y-1.5 font-mono text-[10px]">
                            {mockAuditLog.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-md border border-surface-300/50 bg-surface-0/40"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-insignia-400 font-bold shrink-0 tabular-nums">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span className="text-surface-700 font-bold">{log.action}:</span>
                                        <span className="text-surface-500">{log.description}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <ConfidenceBadge score={log.confidence} size="sm" />
                                        <span className="text-[9px] bg-surface-200/60 px-1.5 py-0.5 rounded text-surface-500">
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

            {/* Delta Ingestion Modal */}
            <DeltaIngestionModal
                caseId={caseData.id}
                isOpen={isDeltaModalOpen}
                onClose={() => setIsDeltaModalOpen(false)}
                onDeltaComplete={() => setDeltaDiffApplied(true)}
            />
        </div>
    );
}
