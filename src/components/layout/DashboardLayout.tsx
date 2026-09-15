// src/components/layout/DashboardLayout.tsx
import { useEffect, useState, useRef } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentsStore } from "../../store/documentsStore";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";
import DocumentViewer from "../documents/DocumentViewer";
import Icon from "../ui/Icon";

export default function DashboardLayout() {
    const selectedDocumentId = useWorkspaceStore((state) => state.selectedDocumentId);
    const documents = useDocumentsStore((state) => state.documents);
    const selectedDocument = documents.find((d) => d.id === selectedDocumentId);

    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(false);
    
    // Resizing logic for right panel
    const [rightWidth, setRightWidth] = useState(520);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 320 && newWidth < window.innerWidth * 0.8) {
                setRightWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                document.body.style.cursor = "";
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Auto-open document viewer when a document is selected
    useEffect(() => {
        if (selectedDocumentId) {
            setRightOpen(true);
        }
    }, [selectedDocumentId]);

    return (
        <div className="flex h-screen flex-col bg-surface-0 font-sans text-surface-700 overflow-hidden">
            <Navbar />
            
            {/* Command Bar */}
            <div className="flex items-center justify-between border-b border-surface-300/50 bg-surface-50 px-4 py-1 z-20 font-mono text-[10px]">
                <div className="flex items-center gap-2.5">
                    <button 
                        onClick={() => setLeftOpen(!leftOpen)}
                        className="flex items-center gap-1.5 rounded px-2 py-0.5 text-surface-500 hover:text-surface-300 hover:bg-surface-200/40 transition-colors cursor-pointer"
                    >
                        <Icon name="folder" size={11} />
                        <span>{leftOpen ? "Hide Cases" : "Show Cases"}</span>
                    </button>
                    <span className="text-surface-400/40">│</span>
                    <span className="text-surface-500 uppercase tracking-wider">Operational Records Database</span>
                </div>

                {selectedDocumentId && (
                    <button 
                        onClick={() => setRightOpen(!rightOpen)}
                        className="flex items-center gap-1.5 rounded px-2 py-0.5 text-surface-500 hover:text-surface-300 hover:bg-surface-200/40 transition-colors cursor-pointer"
                    >
                        <span>{rightOpen ? "Hide Document" : "Show Document"}</span>
                        <Icon name="file-text" size={11} />
                    </button>
                )}
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
                {/* Left Panel: Cases List */}
                <div
                    className={`transition-all duration-300 ease-in-out border-r border-surface-300/50 bg-surface-50 flex shrink-0 ${
                        leftOpen ? "w-72 opacity-100" : "w-0 opacity-0 overflow-hidden border-none"
                    }`}
                >
                    <div className="w-72 flex shrink-0 h-full">
                        <Sidebar />
                    </div>
                </div>

                {/* Middle Panel: Workspace */}
                <div className="flex min-w-0 flex-1 flex-col bg-surface-0 overflow-y-auto">
                    <Workspace />
                </div>

                {/* Right Panel: Document Viewer */}
                {rightOpen && selectedDocument && (
                    <>
                        {/* Resizer Handle */}
                        <div 
                            className="w-1 cursor-col-resize hover:bg-insignia-500/50 active:bg-insignia-500 z-30 transition-colors bg-surface-300/50"
                            onMouseDown={() => {
                                isDraggingRef.current = true;
                                document.body.style.cursor = "col-resize";
                            }}
                        />

                        <div 
                            style={{ width: `${rightWidth}px` }} 
                            className="shrink-0 border-l border-surface-300/50 bg-surface-50 h-full flex flex-col z-20 shadow-2xl shadow-black/30"
                        >
                            <DocumentViewer document={selectedDocument} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}