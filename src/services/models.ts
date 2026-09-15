// src/services/models.ts
import { apiRequest } from "./api";
import { USE_MOCK_API } from "../config";
import type { Document } from "./documents";

export interface ModelTriggerResponse {
    message: string;
}

/**
 * Trigger FIR OCR Pipeline on scanned image document
 * POST /api/models/fir-ocr/{doc_id}
 */
export async function triggerFirOcr(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `FIR OCR extraction completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/fir-ocr/${docId}`, {
        method: "POST",
    });
}

/**
 * Trigger ANPR Plate Detection + OCR Pipeline
 * POST /api/models/anpr/{doc_id}
 */
export async function triggerAnpr(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `ANPR completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/anpr/${docId}`, {
        method: "POST",
    });
}

/**
 * Trigger YOLO Surveillance Detection Pipeline
 * POST /api/models/yolo/{doc_id}
 */
export async function triggerYolo(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `YOLO detection completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/yolo/${docId}`, {
        method: "POST",
    });
}

/**
 * Trigger ASR Whisper Transcription Pipeline
 * POST /api/models/asr/{doc_id}
 */
export async function triggerAsr(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `ASR transcription completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/asr/${docId}`, {
        method: "POST",
    });
}

/**
 * Trigger Financial Structuring Analysis Pipeline
 * POST /api/models/financial/{doc_id}
 */
export async function triggerFinancial(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `Financial analysis completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/financial/${docId}`, {
        method: "POST",
    });
}

/**
 * Trigger NER Entity Extraction Pipeline
 * POST /api/models/ner/{doc_id}
 */
export async function triggerNer(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `NER extraction completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/ner/${docId}`, {
        method: "POST",
    });
}

/**
 * Trigger Handwritten OCR Pipeline
 * POST /api/models/ocr/{doc_id}
 */
export async function triggerOcr(docId: string): Promise<ModelTriggerResponse> {
    if (USE_MOCK_API) {
        return { message: `Handwritten OCR completed for document ${docId}` };
    }
    return apiRequest<ModelTriggerResponse>(`/api/models/ocr/${docId}`, {
        method: "POST",
    });
}

/**
 * Intelligently pick and trigger the right AI model based on document type and content heuristics
 */
export async function triggerModelForDocument(doc: Document): Promise<ModelTriggerResponse> {
    const text = `${doc.title} ${doc.description}`.toLowerCase();

    switch (doc.document_type) {
        case "voice":
            return triggerAsr(doc.id);

        case "video":
            return triggerYolo(doc.id);

        case "text":
            if (
                text.includes("bank") ||
                text.includes("statement") ||
                text.includes("cdr") ||
                text.includes("ledger") ||
                text.includes("mule") ||
                text.includes("transaction")
            ) {
                return triggerFinancial(doc.id);
            }
            return triggerNer(doc.id);

        case "image":
        default:
            if (
                text.includes("plate") ||
                text.includes("vehicle") ||
                text.includes("anpr") ||
                text.includes("car")
            ) {
                return triggerAnpr(doc.id);
            }
            if (
                text.includes("cctv") ||
                text.includes("surveillance") ||
                text.includes("camera") ||
                text.includes("frame")
            ) {
                return triggerYolo(doc.id);
            }
            return triggerFirOcr(doc.id);
    }
}
