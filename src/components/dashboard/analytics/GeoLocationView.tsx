// src/components/dashboard/analytics/GeoLocationView.tsx
import { useState, useMemo } from "react";
import { mockGeoLocation } from "../../../data/mockCaseData";
import Icon from "../../ui/Icon";
import SourceCitationPopover from "../../ui/SourceCitationPopover";

export default function GeoLocationView({
    onSelect,
}: {
    onSelect?: (item: any) => void;
}) {
    const [selectedId, setSelectedId] = useState<string | null>("geo-1");

    // Sort chronologically for drawing the sequential movement route
    const sortedPoints = useMemo(() => {
        return [...mockGeoLocation].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }, []);

    // Calculate bounding box for normalized pseudo-map
    const lats = mockGeoLocation.map((g) => g.lat);
    const lngs = mockGeoLocation.map((g) => g.lng);

    const minLat = Math.min(...lats) - 0.015;
    const maxLat = Math.max(...lats) + 0.015;
    const minLng = Math.min(...lngs) - 0.015;
    const maxLng = Math.max(...lngs) + 0.015;

    const selectedPoint = mockGeoLocation.find((g) => g.id === selectedId);

    const handleSelect = (point: (typeof mockGeoLocation)[0]) => {
        setSelectedId(point.id);
        if (onSelect) {
            onSelect({
                id: point.id,
                label: point.label,
                type: point.type,
                details: {
                    entity: point.entity,
                    lat: point.lat.toFixed(4),
                    lng: point.lng.toFixed(4),
                    timestamp: new Date(point.timestamp).toLocaleString(),
                    ...(point as any).details,
                },
                citation: (point as any).citation,
                merge_reason: `Geospatial coordinate match at [${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}]`,
            });
        }
    };

    // Calculate projected coordinates for SVG path lines
    const projectedPoints = useMemo(() => {
        return sortedPoints.map((point) => {
            const x = ((point.lng - minLng) / (maxLng - minLng)) * 100;
            const y = ((maxLat - point.lat) / (maxLat - minLat)) * 100;
            return { ...point, x, y };
        });
    }, [sortedPoints, minLat, maxLat, minLng, maxLng]);

    return (
        <div className="flex h-full min-h-[420px] flex-col relative bg-surface-0 rounded-xl overflow-hidden border border-surface-300">
            {/* Dark Ops Night-Mode Topographic / Satellite Texture */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(11, 15, 20, 0.85), rgba(11, 15, 20, 0.85)),
                        radial-gradient(circle at 60% 40%, rgba(201, 162, 39, 0.08) 0%, transparent 60%)
                    `,
                }}
            />

            {/* Subtle tactical grid overlay */}
            <div className="absolute inset-0 bg-tactical-grid opacity-25 pointer-events-none" />

            {/* Header / Legend Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-surface-100/90 backdrop-blur-md border border-surface-300 p-3 rounded-lg shadow-xl text-xs max-w-xs">
                <div className="flex items-center gap-2">
                    <Icon name="radar" size={15} className="text-insignia-400" />
                    <h3 className="text-surface-900 font-bold uppercase tracking-wider text-[11px]">
                        Movement Intelligence & Route Vector
                    </h3>
                </div>
                <p className="text-surface-500 text-[11px] mt-1 font-mono">
                    Sequential route tracing between surveillance pings
                </p>

                <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] font-mono text-surface-400 border-t border-surface-200 pt-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Residence</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span>Incident Raid</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>ATM / Ping</span>
                    </div>
                </div>
            </div>

            {/* Map Canvas Layer */}
            <div className="relative flex-1 w-full h-full min-h-[380px]">
                {/* SVG Route Lines Connecting Sequential Points */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>

                    {projectedPoints.map((pt, idx) => {
                        if (idx === 0) return null;
                        const prev = projectedPoints[idx - 1];
                        return (
                            <line
                                key={idx}
                                x1={`${prev.x}%`}
                                y1={`${prev.y}%`}
                                x2={`${pt.x}%`}
                                y2={`${pt.y}%`}
                                stroke="url(#routeGradient)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                className="animate-pulse"
                            />
                        );
                    })}
                </svg>

                {/* Markers */}
                {projectedPoints.map((point, idx) => {
                    let color = "bg-surface-400";
                    if (point.type === "residence") color = "bg-blue-400";
                    if (point.type === "incident") color = "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]";
                    if (point.type === "financial" || point.type === "communication") color = "bg-amber-400";

                    const isSelected = selectedId === point.id;

                    return (
                        <div
                            key={point.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                            style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                            }}
                            onClick={() => handleSelect(point)}
                        >
                            {/* Ping animation for incidents */}
                            {point.type === "incident" && (
                                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
                            )}

                            {/* Location Marker Dot with Sequential Number */}
                            <div
                                className={`relative flex items-center justify-center rounded-full border-2 border-surface-0 shadow-lg ${color} transition-all duration-200 ${
                                    isSelected
                                        ? "w-6 h-6 scale-125 ring-2 ring-insignia-400"
                                        : "w-5 h-5 group-hover:scale-110"
                                }`}
                            >
                                <span className="font-mono text-[9px] font-bold text-surface-0">
                                    {idx + 1}
                                </span>
                            </div>

                            {/* Hover Tag */}
                            <div className="absolute top-full mt-1.5 left-1/2 transform -translate-x-1/2 bg-surface-100/95 border border-surface-300 text-surface-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap z-30 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {point.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Details Panel Overlay */}
            {selectedPoint && (
                <div className="absolute bottom-3 left-3 right-3 bg-surface-100/95 backdrop-blur-md border border-surface-300 p-3.5 rounded-xl shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs z-30 font-sans">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-surface-900 text-sm">
                                {selectedPoint.label}
                            </span>
                            <span className="font-mono text-[10px] uppercase font-bold text-insignia-400 bg-insignia-500/15 px-1.5 py-0.5 rounded">
                                {selectedPoint.type}
                            </span>
                        </div>

                        <div className="text-surface-500 mt-1 flex items-center gap-2 flex-wrap text-xs">
                            <span>Subject: <strong className="text-surface-700">{selectedPoint.entity}</strong></span>
                            {selectedPoint.details && (
                                <>
                                    <span>•</span>
                                    <span>{Object.values(selectedPoint.details)[0]}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-right font-mono">
                        <div>
                            <div className="text-insignia-400 text-xs font-bold">
                                {new Date(selectedPoint.timestamp).toLocaleString()}
                            </div>
                            <div className="text-surface-500 text-[10px] mt-0.5">
                                LAT: {selectedPoint.lat.toFixed(4)} | LNG: {selectedPoint.lng.toFixed(4)}
                            </div>
                        </div>

                        {(selectedPoint as any).citation && (
                            <SourceCitationPopover source={(selectedPoint as any).citation} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}