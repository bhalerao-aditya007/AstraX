// src/pages/Landing.tsx
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardImage from "../assets/dashboard.png";
import graphImage from "../assets/graph.png";
import Icon from "../components/ui/Icon";

const HeroScene = lazy(() => import("../components/landing/HeroScene.tsx"));

const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
    }),
};

const features = [
    {
        icon: "upload" as const,
        title: "Multi-Source Evidentiary Intake",
        desc: "Ingest and parse FIR text, scanned seizure memos, CCTV footage, wiretap audio, and bank CDR ledgers across isolated domain pipelines.",
    },
    {
        icon: "fingerprint" as const,
        title: "Entity Correlation & Disambiguation",
        desc: "Automatically correlate identifiers across fragmented systems to disambiguate targets, identify alias networks, and isolate shell entities.",
    },
    {
        icon: "network-graph" as const,
        title: "GNN Link Analysis & Reconstruction",
        desc: "Deploy Graph Neural Networks to uncover hidden criminal hierarchies, detect pass-through fund layering, and synthesize testable event theories.",
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-surface-0 font-sans text-surface-700 selection:bg-insignia-500/30 selection:text-white">
            {/* ── Nav ─────────────────────────────────── */}
            <nav className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-6 border-b border-surface-200/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-insignia-500/15 border border-insignia-500/40 text-insignia-400 shadow-[0_0_15px_rgba(201,162,39,0.25)]">
                        <Icon name="shield" size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tight text-surface-900 leading-none">
                            AstraX
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-surface-400 uppercase mt-0.5">
                            SIH26189 Ops Platform
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard"
                        className="rounded-lg border border-surface-300 bg-surface-100 px-4 py-2 text-xs font-semibold text-surface-300 hover:text-white hover:bg-surface-200 transition-colors"
                    >
                        Case Directory
                    </Link>
                    <Link
                        to="/intake"
                        className="rounded-lg bg-insignia-500 hover:bg-insignia-400 text-surface-0 px-4 py-2 text-xs font-bold transition-all shadow-md shadow-insignia-500/20 cursor-pointer"
                    >
                        Run Pipeline
                    </Link>
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────── */}
            <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-radial from-surface-50/80 to-surface-0">
                {/* 3D Neural Hero Background */}
                <div className="absolute inset-0 z-0 opacity-75">
                    <Suspense fallback={null}>
                        <HeroScene />
                    </Suspense>
                </div>

                {/* Tactical grid background overlay */}
                <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-12">
                    <div className="max-w-2xl lg:w-1/2">
                        {/* Domain Tag */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={0}
                            className="inline-flex items-center gap-2 rounded-full border border-insignia-500/30 bg-insignia-500/10 px-3 py-1 text-xs font-mono font-bold text-insignia-400 mb-6"
                        >
                            <span className="h-2 w-2 rounded-full bg-insignia-400 animate-pulse" />
                            <span>Criminal Network & Syndicate Analysis</span>
                        </motion.div>

                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={1}
                            className="text-4xl font-black leading-[1.12] tracking-tight text-surface-900 sm:text-5xl lg:text-6xl"
                        >
                            Tactical Graph Intelligence for{" "}
                            <span className="text-insignia-400">Organized Crime Cells.</span>
                        </motion.h1>

                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={2}
                            className="mt-6 text-base leading-relaxed text-surface-600 sm:text-lg"
                        >
                            Autonomous multi-modality evidence ingestion, entity de-duplication, and GNN link prediction. Purpose-built for state police cyber cells to reconstruct syndicate operations while preserving strict evidentiary chain-of-custody.
                        </motion.p>

                        {/* EXACTLY TWO PRIMARY CTAs (Document Requirement) */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={3}
                            className="mt-8 flex flex-wrap items-center gap-4"
                        >
                            {/* CTA 1: Primary Amber */}
                            <Link
                                to="/intake"
                                className="flex items-center gap-2 rounded-xl bg-insignia-500 px-7 py-3.5 text-sm font-extrabold text-surface-0 shadow-lg shadow-insignia-500/25 transition-all hover:bg-insignia-400 hover:shadow-insignia-500/35 cursor-pointer"
                            >
                                <Icon name="radar" size={16} />
                                <span>Run New Analysis</span>
                            </Link>

                            {/* CTA 2: Secondary Outlined */}
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 rounded-xl border border-surface-300 bg-surface-100/90 px-7 py-3.5 text-sm font-bold text-surface-200 shadow-sm transition-all hover:bg-surface-200 hover:border-surface-400 cursor-pointer"
                            >
                                <Icon name="folder" size={16} />
                                <span>View Case History</span>
                            </Link>
                        </motion.div>

                        {/* One-Line Trust Strip (Document Requirement) */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={4}
                            className="mt-8 pt-6 border-t border-surface-200/60 flex items-center gap-2 text-xs font-mono text-surface-400"
                        >
                            <Icon name="shield" size={14} className="text-insignia-400 shrink-0" />
                            <span>BSA 2023-aligned • DPDP-compliant • On-prem deployable</span>
                        </motion.div>
                    </div>

                    {/* Right Hero Image Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className="mt-16 lg:mt-0 lg:w-1/2"
                    >
                        <div className="relative rounded-2xl bg-surface-100 border border-surface-300/80 p-2 shadow-2xl">
                            <img
                                src={dashboardImage}
                                alt="AstraX Tactical Dashboard"
                                className="w-full rounded-xl object-cover border border-surface-300"
                            />

                            {/* Tactical Callout Pill */}
                            <div className="absolute -left-6 top-1/3 hidden rounded-xl border border-insignia-500/40 bg-surface-100/95 backdrop-blur-md p-3.5 shadow-2xl sm:block w-52 font-mono">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="h-2 w-2 rounded-full bg-insignia-400 animate-ping" />
                                    <span className="text-[11px] font-bold text-insignia-300 uppercase">
                                        Active Linkage
                                    </span>
                                </div>
                                <div className="text-xs font-bold text-surface-900">Apex Logistics LLC</div>
                                <div className="text-[10px] text-surface-500 mt-0.5">Hidden Owner: 92% Match</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Marquee Strip ────────── */}
            <section className="border-y border-surface-200/80 bg-surface-50 py-4 overflow-hidden">
                <div className="relative flex w-full overflow-hidden">
                    <div className="animate-marquee flex whitespace-nowrap items-center text-xs font-mono font-bold text-surface-400 uppercase tracking-widest">
                        <span className="mx-6 text-insignia-400">BNS Statutory Taxonomy</span>
                        <span className="mx-6">•</span>
                        <span className="mx-6">Graph Neural Network Link Prediction</span>
                        <span className="mx-6">•</span>
                        <span className="mx-6 text-emerald-400">NAFIS Biometric Fingerprint Integration</span>
                        <span className="mx-6">•</span>
                        <span className="mx-6">GBM Financial Structuring Anomaly Detection</span>
                        <span className="mx-6">•</span>
                        <span className="mx-6 text-purple-400">Wasabi Crypto Mixer Peel-Chain Cluster</span>
                        <span className="mx-6">•</span>
                        <span className="mx-6">BNS Statutory Taxonomy</span>
                        <span className="mx-6">•</span>
                        <span className="mx-6">Graph Neural Network Link Prediction</span>
                    </div>
                </div>
            </section>

            {/* ── Problem Section ───────────────── */}
            <section className="py-24 bg-surface-0">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0}
                        className="mb-16 max-w-3xl"
                    >
                        <div className="text-xs font-mono font-bold text-insignia-400 uppercase tracking-widest mb-2">
                            The Fragmentation Bottleneck
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            Modern Syndicates Operate in Data Silos
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-surface-600">
                            Organized criminal networks intentionally split communications across disposable VoIP carriers, route payments below statutory reporting thresholds, and hide beneficial ownership behind layered corporate fronts.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-surface-600">
                            While investigative agencies gather gigabytes of evidence from seized devices, tower pings, and bank statements, manual analysis across unintegrated portals produces investigative paralysis. AstraX bridges this gap by unifying isolated evidence channels into an active, evidence-backed knowledge graph.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Features ────────────────────────────── */}
            <section className="py-24 bg-surface-50 border-t border-surface-200/80">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0}
                        className="mb-16 text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            A Unified Tactical Analytical Ecosystem
                        </h2>
                        <p className="mt-4 text-base text-surface-600">
                            Engineered for high information density, strict evidentiary provenance, and accelerated prosecutorial briefs.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUp}
                                custom={i}
                                className="rounded-xl bg-surface-100 border border-surface-300 p-8 shadow-sm transition-all hover:border-insignia-500/40 hover:bg-surface-100/90"
                            >
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-insignia-500/15 border border-insignia-500/30 text-insignia-400">
                                    <Icon name={f.icon} size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-surface-900">{f.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-surface-600">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Visual Insight Section ───────────────── */}
            <section className="py-24 bg-surface-0 border-t border-surface-200/80">
                <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-1/2"
                    >
                        <div className="overflow-hidden rounded-2xl border border-surface-300 shadow-2xl bg-surface-100 p-2">
                            <img
                                src={graphImage}
                                alt="Network Graph Visualization"
                                className="w-full rounded-xl object-cover border border-surface-300"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={0}
                        className="mt-12 lg:mt-0 lg:w-1/2"
                    >
                        <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            Transparent Link Probabilities — Leads Not Verdicts
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-surface-600">
                            Every AI-derived prediction in AstraX is accompanied by plain-language qualifiers and interactive source citations. Hypotheses remain clearly distinguished from confirmed forensic evidence.
                        </p>

                        <div className="mt-8 space-y-4 font-mono text-xs">
                            <div className="flex items-start gap-3 rounded-lg border border-surface-300 bg-surface-100 p-3">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1" />
                                <div>
                                    <strong className="text-surface-900 block">Confirmed Evidentiary Basis</strong>
                                    <span className="text-surface-500">KYC mandates, NAFIS prints, and banking UTR records.</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-purple-500/40 bg-purple-950/20 border-dashed p-3">
                                <span className="h-2 w-2 rounded-full bg-purple-400 mt-1" />
                                <div>
                                    <strong className="text-purple-300 block">Probabilistic GNN Hypotheses</strong>
                                    <span className="text-surface-500">Unconfirmed links tagged with confidence intervals for further human inquiry.</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────── */}
            <footer className="border-t border-surface-200/80 bg-surface-50 py-12 text-surface-500 text-xs">
                <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-insignia-500/15 border border-insignia-500/30 text-insignia-400">
                            <Icon name="shield" size={14} />
                        </div>
                        <span className="font-extrabold text-surface-900 text-sm tracking-tight">AstraX</span>
                        <span className="font-mono text-[11px] text-surface-400">| SIH26189 Official Command Suite</span>
                    </div>

                    <p className="font-mono">
                        Designed for State Police Cyber Crime Cells • Air-Gapped / On-Prem Architecture
                    </p>
                </div>
            </footer>
        </div>
    );
}
