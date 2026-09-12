import { useRef, useEffect, useState, useCallback } from "react";
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
} from "d3-force";
import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";

// ── Types ────────────────────────────────────────────────────────
interface GraphNode extends SimulationNodeDatum {
    id: string;
    label: string;
    type: string;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
    source: string;
    target: string;
    label?: string;
}

// ── Mock Data ────────────────────────────────────────────────────
const MOCK_NODES: GraphNode[] = [
    { id: "p1", label: "Rajesh Sharma", type: "Person" },
    { id: "p2", label: "Anita Desai", type: "Person" },
    { id: "ph1", label: "+91 98765 43210", type: "Phone" },
    { id: "ph2", label: "+91 87654 32109", type: "Phone" },
    { id: "fa1", label: "HDFC ****4521", type: "Financial Account" },
    { id: "fa2", label: "SBI ****7890", type: "Financial Account" },
    { id: "t1", label: "₹5.2L Transfer", type: "Transaction" },
    { id: "t2", label: "₹12L Withdrawal", type: "Transaction" },
    { id: "t3", label: "₹1.8L Deposit", type: "Transaction" },
    { id: "d1", label: "MacBook Pro", type: "Device" },
    { id: "d2", label: "iPhone 15", type: "Device" },
    { id: "doc1", label: "Police Report", type: "Document" },
    { id: "doc2", label: "Bank Statement", type: "Document" },
    { id: "o1", label: "Gold Chain", type: "Object" },
    { id: "org1", label: "Acme Holdings", type: "Organization" },
    { id: "loc1", label: "Mumbai, MH", type: "Location" },
    { id: "loc2", label: "Pune, MH", type: "Location" },
];

const MOCK_LINKS: GraphLink[] = [
    { source: "p1", target: "ph1", label: "owns" },
    { source: "p2", target: "ph2", label: "owns" },
    { source: "p1", target: "fa1", label: "account holder" },
    { source: "p2", target: "fa2", label: "account holder" },
    { source: "fa1", target: "t1", label: "outgoing" },
    { source: "fa2", target: "t1", label: "incoming" },
    { source: "fa1", target: "t2", label: "outgoing" },
    { source: "fa2", target: "t3", label: "incoming" },
    { source: "p1", target: "d1", label: "uses" },
    { source: "p1", target: "d2", label: "uses" },
    { source: "p1", target: "doc1", label: "mentioned in" },
    { source: "p2", target: "doc2", label: "mentioned in" },
    { source: "p1", target: "o1", label: "possesses" },
    { source: "p1", target: "org1", label: "works at" },
    { source: "org1", target: "loc1", label: "located in" },
    { source: "p2", target: "loc2", label: "resides in" },
    { source: "t2", target: "loc1", label: "at" },
    { source: "doc1", target: "t1", label: "references" },
];

// ── Entity Colors ────────────────────────────────────────────────
const TYPE_COLORS: Record<string, { fill: string; stroke: string; bg: string }> = {
    Person:              { fill: "#3b82f6", stroke: "#2563eb", bg: "bg-blue-500" },
    Phone:               { fill: "#8b5cf6", stroke: "#7c3aed", bg: "bg-purple-500" },
    "Financial Account": { fill: "#10b981", stroke: "#059669", bg: "bg-emerald-500" },
    Transaction:         { fill: "#f59e0b", stroke: "#d97706", bg: "bg-amber-500" },
    Device:              { fill: "#6366f1", stroke: "#4f46e5", bg: "bg-indigo-500" },
    Document:            { fill: "#ec4899", stroke: "#db2777", bg: "bg-pink-500" },
    Object:              { fill: "#14b8a6", stroke: "#0d9488", bg: "bg-teal-500" },
    Organization:        { fill: "#f97316", stroke: "#ea580c", bg: "bg-orange-500" },
    Location:            { fill: "#06b6d4", stroke: "#0891b2", bg: "bg-cyan-500" },
};

const NODE_RADIUS = 22;

export default function KnowledgeGraph() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

    // Simulation data (mutable refs to avoid re-renders)
    const nodesRef = useRef<GraphNode[]>(MOCK_NODES.map((n) => ({ ...n })));
    const linksRef = useRef<GraphLink[]>(MOCK_LINKS.map((l) => ({ ...l })));
    const simRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);

    // Selection refs for the render loop to access without triggering a full effect rebuild
    const selectedNodeRef = useRef<string | null>(null);
    const hoveredNodeRef = useRef<string | null>(null);

    // Transform state for pan/zoom
    const transformRef = useRef({ x: 0, y: 0, k: 1 });
    const dragRef = useRef<{ node: GraphNode | null; offsetX: number; offsetY: number }>({
        node: null, offsetX: 0, offsetY: 0,
    });
    const panRef = useRef<{ active: boolean; startX: number; startY: number; startTx: number; startTy: number }>({
        active: false, startX: 0, startY: 0, startTx: 0, startTy: 0,
    });

    // ── Hit test ──────────────────────────────────────────────────
    const hitTest = useCallback((mx: number, my: number): GraphNode | null => {
        const t = transformRef.current;
        const wx = (mx - t.x) / t.k;
        const wy = (my - t.y) / t.k;

        for (let i = nodesRef.current.length - 1; i >= 0; i--) {
            const n = nodesRef.current[i];
            const dx = (n.x ?? 0) - wx;
            const dy = (n.y ?? 0) - wy;
            if (dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS) return n;
        }
        return null;
    }, []);

    // ── Render ────────────────────────────────────────────────────
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const t = transformRef.current;
        const activeId = selectedNodeRef.current ?? hoveredNodeRef.current;

        // Build connected set on the fly
        const connected = new Set<string>();
        if (activeId) {
            connected.add(activeId);
            for (const l of linksRef.current) {
                const s = (l.source as unknown as GraphNode).id;
                const e = (l.target as unknown as GraphNode).id;
                if (s === activeId) connected.add(e);
                if (e === activeId) connected.add(s);
            }
        }

        ctx.save();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.k, t.k);

        // ── Edges ──
        for (const link of linksRef.current) {
            const s = link.source as unknown as GraphNode;
            const e = link.target as unknown as GraphNode;
            if (s.x == null || s.y == null || e.x == null || e.y == null) continue;

            const sId = s.id;
            const eId = e.id;
            const isActive = activeId && (connected.has(sId) && connected.has(eId));
            const opacity = activeId ? (isActive ? 0.9 : 0.1) : 0.5;

            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(e.x, e.y);
            ctx.strokeStyle = isActive ? "#1e40af" : "#334155";
            ctx.lineWidth = isActive ? 2.0 : 1.2;
            ctx.globalAlpha = opacity;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // ── Nodes ──
        for (const node of nodesRef.current) {
            if (node.x == null || node.y == null) continue;

            const isActive = activeId ? connected.has(node.id) : true;
            const isHighlighted = node.id === activeId;
            const colors = TYPE_COLORS[node.type] ?? { fill: "#6b778c", stroke: "#505f79" };
            const opacity = activeId ? (isActive ? 1 : 0.15) : 1;

            ctx.globalAlpha = opacity;

            // Glow for highlighted
            if (isHighlighted) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, NODE_RADIUS + 6, 0, Math.PI * 2);
                ctx.fillStyle = colors.fill + "30";
                ctx.fill();
            }

            // Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = isHighlighted ? colors.fill : colors.fill + "dd";
            ctx.fill();
            ctx.strokeStyle = colors.stroke;
            ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
            ctx.stroke();

            // Label
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${9}px system-ui, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const parts = node.label.split(" ");
            if (parts.length > 1 && node.label.length > 10) {
                ctx.fillText(parts[0], node.x, node.y - 4);
                ctx.fillText(parts.slice(1).join(" ").substring(0, 10), node.x, node.y + 6);
            } else {
                ctx.fillText(node.label.substring(0, 12), node.x, node.y);
            }

            // Type label below
            ctx.fillStyle = activeId && !isActive ? "transparent" : "#6b778c";
            ctx.font = "10px system-ui, sans-serif";
            ctx.fillText(node.type, node.x, node.y + NODE_RADIUS + 12);

            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }, []);

    // ── Simulation setup ──────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            // Center if we haven't interacted yet
            if (transformRef.current.x === 0 && transformRef.current.y === 0) {
                transformRef.current.x = rect.width / 2;
                transformRef.current.y = rect.height / 2;
            }
        };
        resize();

        const sim = forceSimulation<GraphNode>(nodesRef.current)
            .force("link", forceLink<GraphNode, GraphLink>(linksRef.current).id((d) => d.id).distance(100))
            .force("charge", forceManyBody().strength(-300))
            .force("center", forceCenter(0, 0))
            .force("collide", forceCollide(NODE_RADIUS + 8));

        // Pre-tick to reduce initial fluctuation
        for (let i = 0; i < 40; ++i) sim.tick();
        
        sim.on("tick", render);

        simRef.current = sim;

        const ro = new ResizeObserver(() => {
            resize();
            render();
        });
        ro.observe(container);

        return () => {
            sim.stop();
            ro.disconnect();
        };
    }, [render]);

    // Update refs when state changes
    useEffect(() => {
        selectedNodeRef.current = selectedNode;
        render(); // Trigger a redraw
    }, [selectedNode, render]);

    // ── Mouse handlers ────────────────────────────────────────────
    const getMousePos = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        const node = hitTest(pos.x, pos.y);

        if (node) {
            dragRef.current = {
                node,
                offsetX: (node.x ?? 0) - (pos.x - transformRef.current.x) / transformRef.current.k,
                offsetY: (node.y ?? 0) - (pos.y - transformRef.current.y) / transformRef.current.k,
            };
            node.fx = node.x;
            node.fy = node.y;
            simRef.current?.alphaTarget(0.3).restart();
        } else {
            panRef.current = {
                active: true,
                startX: pos.x,
                startY: pos.y,
                startTx: transformRef.current.x,
                startTy: transformRef.current.y,
            };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const pos = getMousePos(e);

        if (dragRef.current.node) {
            const t = transformRef.current;
            dragRef.current.node.fx = (pos.x - t.x) / t.k + dragRef.current.offsetX;
            dragRef.current.node.fy = (pos.y - t.y) / t.k + dragRef.current.offsetY;
            render();
            return;
        }

        if (panRef.current.active) {
            transformRef.current.x = panRef.current.startTx + (pos.x - panRef.current.startX);
            transformRef.current.y = panRef.current.startTy + (pos.y - panRef.current.startY);
            render();
            return;
        }

        const node = hitTest(pos.x, pos.y);
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = node ? "grab" : "default";

        if (node) {
            if (hoveredNodeRef.current !== node.id) {
                hoveredNodeRef.current = node.id;
                render();
            }
            setTooltip({ x: pos.x, y: pos.y, node });
        } else {
            if (hoveredNodeRef.current !== null) {
                hoveredNodeRef.current = null;
                render();
            }
            setTooltip(null);
        }
    };

    const handleMouseUp = () => {
        if (dragRef.current.node) {
            dragRef.current.node.fx = null;
            dragRef.current.node.fy = null;
            simRef.current?.alphaTarget(0);
            dragRef.current = { node: null, offsetX: 0, offsetY: 0 };
        }
        panRef.current.active = false;
    };

    const handleClick = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        const node = hitTest(pos.x, pos.y);
        setSelectedNode(node ? (node.id === selectedNode ? null : node.id) : null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const pos = getMousePos(e);
        const t = transformRef.current;
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        const newK = Math.max(0.3, Math.min(3, t.k * factor));

        t.x = pos.x - (pos.x - t.x) * (newK / t.k);
        t.y = pos.y - (pos.y - t.y) * (newK / t.k);
        t.k = newK;
        render();
    };

    const resetView = () => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        transformRef.current = { x: rect.width / 2, y: rect.height / 2, k: 1 };
        setSelectedNode(null);
        hoveredNodeRef.current = null;
        render();
    };

    // ── Legend ─────────────────────────────────────────────────────
    const types = Object.keys(TYPE_COLORS);

    return (
        <div className="rounded-xl border border-surface-200 bg-surface-0 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-surface-200 px-5 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                    Knowledge Graph
                </h3>
                <button
                    type="button"
                    onClick={resetView}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-surface-500 transition hover:bg-surface-100 hover:text-surface-700"
                >
                    Reset View
                </button>
            </div>

            <div ref={containerRef} className="relative h-[420px] w-full bg-surface-50">
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleClick}
                    onWheel={handleWheel}
                    className="h-full w-full outline-none"
                />

                {/* Tooltip */}
                {tooltip && (
                    <div
                        className="pointer-events-none absolute z-10 rounded-lg border border-surface-300 bg-surface-100 px-3 py-2 shadow-xl"
                        style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
                    >
                        <p className="text-xs font-bold text-surface-900 font-mono">{tooltip.node.label}</p>
                        <p className="text-[10px] text-surface-400 uppercase tracking-wider">{tooltip.node.type}</p>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 border-t border-surface-200 px-5 py-3 bg-surface-0">
                {types.map((type) => (
                    <div key={type} className="flex items-center gap-1.5">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: TYPE_COLORS[type].fill }}
                        />
                        <span className="text-[10px] font-medium text-surface-500">{type}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
