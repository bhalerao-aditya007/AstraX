import { USE_MOCK_API } from "../config";

import * as mockDocuments from "./mock/documents";
import { apiRequest } from "./api";

export type DocumentStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "finish";

export type DocumentType = "image" | "text" | "voice" | "video";

export interface Document {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  document_type: DocumentType;
  object_key: string;
  extracted_information: Record<
    string,
    unknown
  > | null;
  case_id: string;
  created_at: string;
  updated_at: string;
}

export async function getDocuments(
  caseId?: string
): Promise<Document[]> {
  if (USE_MOCK_API) {
    return mockDocuments.getDocuments(caseId);
  }

  const query = caseId
    ? `?case_id=${encodeURIComponent(caseId)}`
    : "";

  return apiRequest<Document[]>(
    `/api/documents${query}`
  );
}

export async function getDocument(
  id: string
): Promise<Document> {
  if (USE_MOCK_API) {
    return mockDocuments.getDocument(id);
  }

  return apiRequest<Document>(
    `/api/documents/${id}`
  );
}

export async function deleteDocument(
  id: string
): Promise<{ message: string }> {
  if (USE_MOCK_API) {
    return mockDocuments.deleteDocument(id);
  }

  return apiRequest<{ message: string }>(
    `/api/documents/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function getDownloadUrl(
  id: string
): Promise<{ download_url: string }> {
  if (USE_MOCK_API) {
    return mockDocuments.getDownloadUrl(id);
  }

  return apiRequest<{ download_url: string }>(
    `/api/documents/${id}/download`
  );
}