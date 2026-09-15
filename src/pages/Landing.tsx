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

const marqueeItems = [
    { text: "National Automated Fingerprint Identification System (NAFIS) Biometric De-Duplication", color: "text-emerald-400" },
    { text: "Inter-State Cyber Syndicate Attribution & GNN Topology Reconstruction", color: "text-insignia-400" },
    { text: "Multi-Banking CDR, IPDR & Layered Mule Account Financial Forensics", color: "text-surface-300" },
    { text: "Bharatiya Nyaya Sanhita (BNS) Statutory Offence Taxonomy & Section Mapping", color: "text-insignia-300" },
    { text: "Decentralized Crypto Mixer Peel-Chain & Asset Recovery Tracking", color: "text-purple-400" },
    { text: "Air-Gapped Sovereign Digital Evidence Chain-of-Custody (BSA 2023)", color: "text-surface-300" },
];

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
            {/* Header Nav */}
            <nav className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-6 border-b border-surface-200/50">
                <div className="flex items-center gap-3">
                    <img
                        src="/astrax-logo.png"
                        alt="AstraX Logo"
                        className="h-9 w-9 rounded-lg object-contain shadow-[0_0_15px_rgba(201,162,39,0.25)]"
                    />
                    <span
                        className="text-xl font-extrabold tracking-tight text-surface-900 leading-none"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        AstraX
                    </span>
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

            {/* Hero */}
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
                            <span className="text-insignia-400">Organized Crime Cells</span>
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
                            className="mt-10 flex flex-wrap items-center gap-4"
                        >
                            <Link
                                to="/intake"
                                className="inline-flex items-center gap-2 rounded-xl bg-insignia-500 px-6 py-3.5 text-sm font-bold text-surface-0 shadow-lg shadow-insignia-500/25 hover:bg-insignia-400 hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <Icon name="upload" size={16} />
                                <span>Ingest Case Evidence</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl border border-surface-300 bg-surface-100/80 px-6 py-3.5 text-sm font-bold text-surface-800 hover:bg-surface-200 hover:text-white transition-all backdrop-blur-sm"
                            >
                                <Icon name="folder" size={16} />
                                <span>View Case History</span>
                            </Link>
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

                            {/* Compact Tactical Callout Pill */}
                            <div className="absolute -left-4 top-1/4 hidden rounded-lg border border-emerald-500/40 bg-surface-100/95 backdrop-blur-md px-3.5 py-2 shadow-2xl sm:flex items-center gap-2.5 font-mono">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                                    Verified Intelligence Link
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Marquee Strip */}
            <section className="border-y border-surface-200/80 bg-surface-50 py-4 overflow-hidden">
                <div className="relative flex w-full overflow-hidden">
                    <div className="animate-marquee flex whitespace-nowrap items-center text-xs font-mono font-bold tracking-wider uppercase py-1">
                        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
                            <span key={idx} className="inline-flex items-center shrink-0">
                                <span className={`mx-2 ${item.color}`}>{item.text}</span>
                                <img
                                    src="/emblem.png"
                                    alt=""
                                    aria-hidden="true"
                                    className="h-6 w-auto object-contain mx-6 inline-block opacity-90 drop-shadow-[0_0_8px_rgba(201,162,39,0.35)] shrink-0"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem Section */}
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

            {/* Features */}
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

            {/* Visual Insight Section */}
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
                            Transparent Link Probabilities - Leads Not Verdicts
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

            {/* Footer */}
            <footer className="border-t border-surface-200/80 bg-surface-50 py-12 text-surface-500 text-xs">
                <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/astrax-logo.png"
                            alt="AstraX Logo"
                            className="h-7 w-7 rounded-lg object-contain"
                        />
                        <span className="font-extrabold text-surface-900 text-sm tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                            AstraX
                        </span>
                        <span className="font-mono text-[11px] text-surface-400">| Tactical Crime Graph Intelligence</span>
                    </div>

                    <p className="font-mono">
                        Designed for State Police Cyber Crime Cells • Air Gapped System
                    </p>
                </div>
            </footer>
        </div>
    );
}
