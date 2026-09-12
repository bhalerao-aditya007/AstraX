// src/components/dashboard/analytics/NetworkGraph.tsx
import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3-force";
import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import { NODE_THEME_COLORS } from "../../../theme/colors";
import Icon from "../../ui/Icon";

interface NetworkNode extends SimulationNodeDatum {
    id: string;
    label: string;
    type: string;
    badge?: string;
    risk_score?: number;
    is_phantom?: boolean;
    attributes?: Record<string, any>;
    details?: Record<string, any>;
    merge_reason?: string;
}

interface NetworkLink extends SimulationLinkDatum<NetworkNode> {
    id: string;
    source: string | NetworkNode;
    target: string | NetworkNode;
    label: string;
    color?: string;
    style?: string;
    weight?: number;
    probability?: number;
    is_hypothesis?: boolean;
    valid_from?: string;
    valid_to?: string;
    merge_reason?: string;
}

interface NetworkGraphProps {
    data: {
        nodes: any[];
        edges: any[];
    };
    onNodeClick?: (node: any) => void;
    onEdgeClick?: (edge: any) => void;
    theme?: "financial" | "digital" | "communication" | "evidence" | "default";
    showControls?: boolean;
    title?: string;
}

const NODE_RADIUS = 22;

export default function NetworkGraph({
    data,
    onNodeClick,
    theme = "default",
    showControls = true,
    title,
}: NetworkGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Progressive Disclosure Controls
    const [showHypotheses, setShowHypotheses] = useState(false);
    const [temporalDate, setTemporalDate] = useState<string>("2026-09-30");

    // Filtered data based on progressive disclosure
    const filteredEdges = useMemo(() => {
        return (data.edges || []).filter((edge) => {
            // Hypothesis filter
            const isHypo = edge.is_hypothesis || edge.category === "hypothesis" || edge.style === "dashed";
            if (isHypo && !showHypotheses) {
                return false;
            }
            // Temporal filter
            if (edge.valid_from && edge.valid_from > temporalDate) {
                return false;
            }
            return true;
        });
    }, [data.edges, showHypotheses, temporalDate]);

    const activeNodeIds = useMemo(() => {
        const set = new Set<string>();
        for (const edge of filteredEdges) {
            const sId = typeof edge.source === "object" ? edge.source.id : edge.source;
            const tId = typeof edge.target === "object" ? edge.target.id : edge.target;
            set.add(sId);
            set.add(tId);
        }
        return set;
    }, [filteredEdges]);

    const filteredNodes = useMemo(() => {
        // Keep all nodes unless they are phantom and isolated when hypothesis is off
        return (data.nodes || []).filter((node) => {
            if (node.is_phantom && !showHypotheses && !activeNodeIds.has(node.id)) {
                return false;
            }
            return true;
        });
    }, [data.nodes, showHypotheses, activeNodeIds]);

    const rawNodes = useMemo(() => filteredNodes.map((n: any) => ({ ...n })), [filteredNodes]);
    const rawLinks = useMemo(() => filteredEdges.map((e: any) => ({ ...e })), [filteredEdges]);

    const nodesRef = useRef<NetworkNode[]>(rawNodes);
    const linksRef = useRef<NetworkLink[]>(rawLinks);

    useEffect(() => {
        nodesRef.current = rawNodes;
        linksRef.current = rawLinks;
    }, [rawNodes, rawLinks]);

    const transformRef = useRef({ x: 0, y: 0, k: 1 });
    const hoveredRef = useRef<string | null>(null);
    const simRef = useRef<any>(null);

    const hitTest = useCallback((mx: number, my: number): NetworkNode | null => {
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

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const { x, y, k } = transformRef.current;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(k, k);

        // Clamp positions
        for (const node of nodesRef.current) {
            if (node.x == null || node.y == null) continue;
            const padding = NODE_RADIUS + 10;
            const hw = canvas.width / (2 * k) - padding;
            const hh = canvas.height / (2 * k) - padding;
            if (node.x > hw) node.x = hw;
            if (node.x < -hw) node.x = -hw;
            if (node.y > hh) node.y = hh;
            if (node.y < -hh) node.y = -hh;
        }

        const themeMapping = NODE_THEME_COLORS[theme] || NODE_THEME_COLORS.default;

        // ── Render Edges ──────────────────────────────────────────
        for (const link of linksRef.current) {
            const s = link.source as NetworkNode;
            const e = link.target as NetworkNode;
            if (s.x == null || s.y == null || e.x == null || e.y == null) continue;

            const dx = e.x - s.x;
            const dy = e.y - s.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) continue;

            const padding = NODE_RADIUS + 2;
            const targetX = e.x - (dx * padding) / dist;
            const targetY = e.y - (dy * padding) / dist;
            const sourceX = s.x + (dx * padding) / dist;
            const sourceY = s.y + (dy * padding) / dist;

            const isHypothesis = link.is_hypothesis || link.style === "dashed";

            ctx.beginPath();
            ctx.moveTo(sourceX, sourceY);
            ctx.lineTo(targetX, targetY);

            if (isHypothesis) {
                ctx.strokeStyle = "#8b5cf6";
                ctx.lineWidth = 2.0;
                ctx.setLineDash([5, 5]);
            } else {
                ctx.strokeStyle = link.color || "#475569";
                ctx.lineWidth = link.weight ? Math.min(4, link.weight) : 1.5;
                ctx.setLineDash([]);
            }
            ctx.stroke();

            // Arrowhead
            ctx.setLineDash([]);
            const arrowSize = 6 + (link.weight || 0);
            const angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.moveTo(targetX, targetY);
            ctx.lineTo(targetX - arrowSize * Math.cos(angle - Math.PI / 6), targetY - arrowSize * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(targetX - arrowSize * Math.cos(angle + Math.PI / 6), targetY - arrowSize * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fillStyle = isHypothesis ? "#8b5cf6" : (link.color || "#64748b");
            ctx.fill();

            // Label
            if (link.label) {
                const mx = (s.x + e.x) / 2;
                const my = (s.y + e.y) / 2;
                ctx.font = "9px ui-monospace, monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const metrics = ctx.measureText(link.label);
                const bgW = metrics.width + 8;
                const bgH = 14;

                ctx.beginPath();
                ctx.roundRect(mx - bgW / 2, my - bgH / 2 - 6, bgW, bgH, 3);
                ctx.fillStyle = "rgba(11, 15, 20, 0.92)";
                ctx.fill();
                ctx.strokeStyle = isHypothesis ? "rgba(139, 92, 246, 0.4)" : "rgba(71, 85, 105, 0.5)";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = isHypothesis ? "#c4b5fd" : (link.color || "#94a3b8");
                ctx.fillText(link.label, mx, my - 6);
            }
        }

        ctx.setLineDash([]);

        // ── Render Nodes ──────────────────────────────────────────
        for (const node of nodesRef.current) {
            if (node.x == null || node.y == null) continue;

            const isHovered = hoveredRef.current === node.id;
            const colors = themeMapping[node.type] || themeMapping.default;
            const isPhantom = node.is_phantom || node.type === "phantom";

            ctx.save();
            ctx.translate(node.x, node.y);

            // Glow ring for hovered or phantom nodes
            if (isHovered || isPhantom) {
                ctx.beginPath();
                ctx.arc(0, 0, NODE_RADIUS + 7, 0, Math.PI * 2);
                ctx.fillStyle = isPhantom ? "rgba(139, 92, 246, 0.25)" : colors.glow;
                ctx.fill();
            }

            // Node Geometry
            if (isPhantom) {
                // Dashed Circle for Phantom
                ctx.beginPath();
                ctx.arc(0, 0, NODE_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = "#161026";
                ctx.fill();
                ctx.strokeStyle = "#8b5cf6";
                ctx.lineWidth = isHovered ? 2.5 : 1.75;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            } else if (node.type === "company" || node.type === "bank_account") {
                // Rect for institutional accounts
                ctx.beginPath();
                ctx.roundRect(-NODE_RADIUS, -NODE_RADIUS, NODE_RADIUS * 2, NODE_RADIUS * 2, 6);
                ctx.fillStyle = colors.fill;
                ctx.fill();
                ctx.strokeStyle = colors.stroke;
                ctx.lineWidth = isHovered ? 2.5 : 1.5;
                ctx.stroke();
            } else if (node.type === "wallet" || node.type === "device") {
                // Hexagon for crypto wallets / digital devices
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const hx = NODE_RADIUS * Math.cos(angle);
                    const hy = NODE_RADIUS * Math.sin(angle);
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.fillStyle = colors.fill;
                ctx.fill();
                ctx.strokeStyle = colors.stroke;
                ctx.lineWidth = isHovered ? 2.5 : 1.5;
                ctx.stroke();
            } else {
                // Circle for persons, phones, locations
                ctx.beginPath();
                ctx.arc(0, 0, NODE_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = colors.fill;
                ctx.fill();
                ctx.strokeStyle = colors.stroke;
                ctx.lineWidth = isHovered ? 2.5 : 1.5;
                ctx.stroke();
            }

            // High Risk Indicator Dot
            if (node.risk_score && node.risk_score > 0.8) {
                ctx.beginPath();
                ctx.arc(NODE_RADIUS * 0.7, -NODE_RADIUS * 0.7, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#ef4444";
                ctx.fill();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Node Label
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (isPhantom) {
                ctx.fillStyle = "#c4b5fd";
                ctx.font = "bold 11px system-ui";
                ctx.fillText("?", 0, -2);
            } else {
                const words = (node.label || "").split(" ");
                if (words.length > 1 && words[0].length <= 10) {
                    ctx.fillText(words[0], 0, -4);
                    ctx.fillText(words[1].substring(0, 10), 0, 6);
                } else {
                    ctx.fillText((node.label || "").substring(0, 10), 0, 0);
                }
            }

            // Node Badge (Subtext)
            if (node.badge || isPhantom) {
                ctx.fillStyle = isPhantom ? "#a78bfa" : "#94a3b8";
                ctx.font = "9px ui-monospace, monospace";
                ctx.fillText(isPhantom ? "HYPOTHESIS" : (node.badge || ""), 0, NODE_RADIUS + 11);
            }

            ctx.restore();
        }

        ctx.restore();
    }, [theme]);

    // Force simulation initialization and updates
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
            if (transformRef.current.x === 0 && transformRef.current.y === 0) {
                transformRef.current.x = rect.width / 2;
                transformRef.current.y = rect.height / 2;
            }
        };
        resize();

        const sim = forceSimulation<NetworkNode>(nodesRef.current)
            .force("link", forceLink<NetworkNode, NetworkLink>(linksRef.current).id((d) => d.id).distance(110))
            .force("charge", forceManyBody().strength(-320))
            .force("center", forceCenter(0, 0))
            .force("collide", forceCollide(NODE_RADIUS + 12));

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
    }, [render, rawNodes, rawLinks]);

    // Pan & Drag Handlers
    const dragRef = useRef<{ node: NetworkNode | null; offsetX: number; offsetY: number }>({
        node: null, offsetX: 0, offsetY: 0,
    });
    const panRef = useRef<{ active: boolean; startX: number; startY: number; startTx: number; startTy: number }>({
        active: false, startX: 0, startY: 0, startTx: 0, startTy: 0,
    });

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
        if (canvas) canvas.style.cursor = node ? "pointer" : "default";

        if (node) {
            if (hoveredRef.current !== node.id) {
                hoveredRef.current = node.id;
                render();
            }
        } else if (hoveredRef.current !== null) {
            hoveredRef.current = null;
            render();
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
        if (node && onNodeClick) {
            onNodeClick(node);
        }
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

    const resetZoom = () => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        transformRef.current = { x: rect.width / 2, y: rect.height / 2, k: 1 };
        render();
    };

    const zoomIn = () => {
        transformRef.current.k = Math.min(3, transformRef.current.k * 1.25);
        render();
    };

    const zoomOut = () => {
        transformRef.current.k = Math.max(0.3, transformRef.current.k * 0.8);
        render();
    };

    return (
        <div className="relative h-full w-full flex flex-col bg-surface-0 rounded-xl overflow-hidden border border-surface-300">
            {/* Top Toolbar / Progressive Disclosure Controls */}
            {showControls && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-300 bg-surface-100/90 px-4 py-2.5 z-20">
                    <div className="flex items-center gap-2">
                        {title && (
                            <span className="text-xs font-bold uppercase tracking-wider text-surface-900 mr-2">
                                {title}
                            </span>
                        )}
                        {/* Toggle Hypothesis Layer */}
                        <button
                            type="button"
                            onClick={() => setShowHypotheses(!showHypotheses)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono font-bold transition-all ${
                                showHypotheses
                                    ? "bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                    : "bg-surface-200 border-surface-300 text-surface-400 hover:text-surface-200 hover:bg-surface-300"
                            }`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${showHypotheses ? "bg-purple-400 animate-ping" : "bg-surface-400"}`} />
                            <span>Hypothesis Layer: {showHypotheses ? "ON" : "OFF"}</span>
                        </button>
                    </div>

                    {/* Temporal Slider & Zoom Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-surface-500">
                            <span>Time Filter:</span>
                            <input
                                type="date"
                                value={temporalDate}
                                onChange={(e) => setTemporalDate(e.target.value)}
                                className="rounded border border-surface-300 bg-surface-0 px-2 py-0.5 text-xs text-surface-700 font-mono focus:border-insignia-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-1 border-l border-surface-200 pl-3">
                            <button
                                type="button"
                                onClick={zoomIn}
                                className="h-6 w-6 rounded bg-surface-200 text-surface-400 hover:text-white flex items-center justify-center text-xs font-bold"
                                title="Zoom In"
                            >
                                +
                            </button>
                            <button
                                type="button"
                                onClick={zoomOut}
                                className="h-6 w-6 rounded bg-surface-200 text-surface-400 hover:text-white flex items-center justify-center text-xs font-bold"
                                title="Zoom Out"
                            >
                                -
                            </button>
                            <button
                                type="button"
                                onClick={resetZoom}
                                className="h-6 px-2 rounded bg-surface-200 text-surface-400 hover:text-white text-[10px] font-mono flex items-center justify-center"
                                title="Reset View"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Canvas Container */}
            <div ref={containerRef} className="relative flex-1 w-full bg-surface-0 min-h-[380px]">
                {/* Tactical grid background overlay */}
                <div className="absolute inset-0 bg-tactical-grid opacity-15 pointer-events-none" />

                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleClick}
                    onWheel={handleWheel}
                    className="absolute inset-0 h-full w-full outline-none select-none"
                />
            </div>

            {/* Bottom Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-300 bg-surface-100/90 px-4 py-2 z-20 text-[11px] font-mono text-surface-500">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Evidentiary Link</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-0 w-3 border-b-2 border-dashed border-purple-400" />
                        <span className="text-purple-300">GNN Hypothesis (Predicted)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span>High Risk / Flagged</span>
                    </div>
                </div>

                <div className="text-[10px] text-surface-400">
                    Click any node or link to view entity-resolution reasoning string
                </div>
            </div>
        </div>
    );
}
