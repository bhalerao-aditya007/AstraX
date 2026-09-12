// src/components/landing/HeroScene.tsx
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import type { Mesh, Group } from "three";

function Node({ position, color, size = 0.15 }: { position: [number, number, number]; color: string; size?: number }) {
    const meshRef = useRef<Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.0012;
        }
    });
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.3} metalness={0.8} />
        </mesh>
    );
}

function Edge({ start, end, color = "#c9a227" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) {
    const points = useMemo<[number, number, number][]>(() => [start, end], [start, end]);
    return <Line points={points} color={color} lineWidth={1.2} transparent opacity={0.3} />;
}

function NetworkGraph() {
    const groupRef = useRef<Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.04;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.08;
        }
    });

    // Tactical Ops palette: Amber / Gold nodes with tech blue / purple accents
    const nodes: { pos: [number, number, number]; color: string; size: number }[] = [
        { pos: [0, 0, 0], color: "#c9a227", size: 0.24 },
        { pos: [1.5, 0.8, -0.5], color: "#d4af37", size: 0.17 },
        { pos: [-1.2, 1, 0.6], color: "#3b82f6", size: 0.15 },
        { pos: [0.8, -1.2, 0.8], color: "#c9a227", size: 0.19 },
        { pos: [-1.6, -0.5, -0.3], color: "#8b5cf6", size: 0.16 },
        { pos: [1.8, -0.3, -1], color: "#3b82f6", size: 0.13 },
        { pos: [-0.5, 1.5, -0.8], color: "#d4af37", size: 0.14 },
        { pos: [0.3, -0.8, 1.5], color: "#8b5cf6", size: 0.12 },
        { pos: [-1, -1.3, 0.9], color: "#3b82f6", size: 0.15 },
        { pos: [1.2, 1.2, 0.5], color: "#c9a227", size: 0.12 },
        { pos: [-0.8, 0.2, 1.2], color: "#d4af37", size: 0.13 },
        { pos: [0.5, 0.5, -1.3], color: "#3b82f6", size: 0.14 },
    ];

    const edges: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 9],
        [2, 6], [3, 7], [3, 8], [4, 8], [5, 9], [6, 10],
        [7, 10], [2, 11], [5, 11],
    ];

    return (
        <group ref={groupRef}>
            {edges.map(([a, b], i) => (
                <Edge key={i} start={nodes[a].pos} end={nodes[b].pos} color={i % 2 === 0 ? "#c9a227" : "#3b82f6"} />
            ))}
            {nodes.map((n, i) => (
                <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
                    <Node position={n.pos} color={n.color} size={n.size} />
                </Float>
            ))}
        </group>
    );
}

export default function HeroScene() {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-insignia-500/10 via-transparent to-brand-900/10" />
        );
    }

    return (
        <div className="absolute inset-0 opacity-60">
            <Canvas
                camera={{ position: [0, 0, 5.2], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ pointerEvents: "none" }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.9} color="#c9a227" />
                <pointLight position={[-5, -3, 3]} intensity={0.5} color="#3b82f6" />
                <NetworkGraph />
            </Canvas>
        </div>
    );
}
