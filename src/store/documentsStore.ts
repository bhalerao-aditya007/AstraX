import { create } from "zustand";

import type { Document } from "../services/documents";
import {
    getDocuments,
    deleteDocument as svcDeleteDocument,
} from "../services/documents";

interface DocumentsState {
    documents: Document[];
    isLoading: boolean;
    error: string | null;

    fetchDocuments: (caseId: string) => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
    addDocument: (document: Document) => void;
    updateDocument: (document: Document) => void;
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
    documents: [],
    isLoading: false,
    error: null,

    fetchDocuments: async (caseId: string) => {
        set({ isLoading: true, error: null });

        try {
            const documents = await getDocuments(caseId);
            set({ documents, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load documents",
            });
        }
    },

    deleteDocument: async (id: string) => {
        await svcDeleteDocument(id);
        set((state) => ({
            documents: state.documents.filter((d) => d.id !== id),
        }));
    },

    addDocument: (document: Document) => {
        set((state) => ({ documents: [...state.documents, document] }));
    },

    updateDocument: (document: Document) => {
        set((state) => ({
            documents: state.documents.map((d) =>
                d.id === document.id ? document : d
            ),
        }));
    },
}));