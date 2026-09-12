import { USE_MOCK_API } from "../config";

import * as mockCases from "./mock/cases";
import { apiRequest } from "./api";

export interface Case {
  id: string;
  name: string;
  track?: 1 | 2;
  triage_reason?: string;
  version?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCaseInput {
  name: string;
  track?: 1 | 2;
  triage_reason?: string;
}

export interface UpdateCaseInput {
  name?: string;
  track?: 1 | 2;
  triage_reason?: string;
  version?: number;
}

// ─────────────────────────────────────
// GET CASES
// ─────────────────────────────────────

export async function getCases(): Promise<Case[]> {
  if (USE_MOCK_API) {
    return mockCases.getCases();
  }

  return apiRequest<Case[]>("/api/cases");
}

// ─────────────────────────────────────
// GET CASE
// ─────────────────────────────────────

export async function getCase(
  id: string
): Promise<Case> {
  if (USE_MOCK_API) {
    return mockCases.getCase(id);
  }

  return apiRequest<Case>(`/api/cases/${id}`);
}

// ─────────────────────────────────────
// CREATE CASE
// ─────────────────────────────────────

export async function createCase(
  data: CreateCaseInput
): Promise<Case> {
  if (USE_MOCK_API) {
    return mockCases.createCase(data);
  }

  return apiRequest<Case>("/api/cases", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────
// UPDATE CASE
// ─────────────────────────────────────

export async function updateCase(
  id: string,
  data: UpdateCaseInput
): Promise<Case> {
  if (USE_MOCK_API) {
    return mockCases.updateCase(id, data);
  }

  return apiRequest<Case>(`/api/cases/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────
// DELETE CASE
// ─────────────────────────────────────

export async function deleteCase(
  id: string
): Promise<{ message: string }> {
  if (USE_MOCK_API) {
    return mockCases.deleteCase(id);
  }

  return apiRequest<{ message: string }>(
    `/api/cases/${id}`,
    {
      method: "DELETE",
    }
  );
}