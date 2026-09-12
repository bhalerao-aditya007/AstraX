import type {
    Case,
    CreateCaseInput,
    UpdateCaseInput,
} from "../cases";

let mockCases: Case[] = [
    {
        id: "case-1",
        name: "FIR 101/2026: Apex Financial Syndicate Investigation",
        track: 2,
        triage_reason: "Multi-jurisdiction syndicate: 4 shell entities, Wasabi crypto mixer cluster, and international burner relays.",
        version: 2,
        created_at: "2026-09-01T10:00:00Z",
        updated_at: "2026-09-08T11:45:00Z",
    },
    {
        id: "case-2",
        name: "FIR 44/2026: Cybercrime Ransomware Investigation",
        track: 2,
        triage_reason: "Complex network: Multiple compromised nodes, C2 server communications, and Darknet wallet addresses.",
        version: 1,
        created_at: "2026-09-02T11:30:00Z",
        updated_at: "2026-09-02T11:30:00Z",
    },
    {
        id: "case-3",
        name: "NCR 12/2026: Local Commercial Inventory Dispute",
        track: 1,
        triage_reason: "Routine case: Single direct complainant and accused, localized to single precinct. No syndicate pattern detected.",
        version: 1,
        created_at: "2026-09-03T14:20:00Z",
        updated_at: "2026-09-03T14:20:00Z",
    },
];

const delay = (ms = 400) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export async function getCases(): Promise<Case[]> {
    await delay();

    return [...mockCases];
}

export async function getCase(id: string): Promise<Case> {
    await delay();

    const caseItem = mockCases.find(
        (item) => item.id === id
    );

    if (!caseItem) {
        throw new Error("Case not found");
    }

    return { ...caseItem };
}

export async function createCase(
    data: CreateCaseInput
): Promise<Case> {
    await delay();

    const now = new Date().toISOString();

    const newCase: Case = {
        id: crypto.randomUUID(),
        name: data.name,
        track: data.track ?? 2,
        triage_reason: data.triage_reason ?? "Multi-modality evidence ingested across digital channels.",
        version: 1,
        created_at: now,
        updated_at: now,
    };

    mockCases = [newCase, ...mockCases];

    return { ...newCase };
}

export async function updateCase(
    id: string,
    data: UpdateCaseInput
): Promise<Case> {
    await delay();

    const index = mockCases.findIndex(
        (item) => item.id === id
    );

    if (index === -1) {
        throw new Error("Case not found");
    }

    const updatedCase = {
        ...mockCases[index],
        ...(data.name ? { name: data.name } : {}),
        ...(data.track !== undefined ? { track: data.track } : {}),
        ...(data.triage_reason !== undefined ? { triage_reason: data.triage_reason } : {}),
        ...(data.version !== undefined ? { version: data.version } : {}),
        updated_at: new Date().toISOString(),
    };

    mockCases[index] = updatedCase;

    return { ...updatedCase };
}

export async function deleteCase(
    id: string
): Promise<{ message: string }> {
    await delay();

    const exists = mockCases.some(
        (item) => item.id === id
    );

    if (!exists) {
        throw new Error("Case not found");
    }

    mockCases = mockCases.filter(
        (item) => item.id !== id
    );

    return {
        message: `Case ${id} deleted`,
    };
}