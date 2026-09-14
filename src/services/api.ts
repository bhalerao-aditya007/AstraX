const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "https://astraxbackend-production.up.railway.app";

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: "Something went wrong",
        }));

        throw new Error(error.error ?? "API request failed");
    }

    return response.json();
}