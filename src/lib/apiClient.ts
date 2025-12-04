type Verb = "GET" | "POST" | "PUT" | "DELETE";
async function request<T>(
    path: string,
    method: Verb = "GET",
    body?: unknown): Promise<T> {
    const response = await fetch(`/api${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method !== "GET" ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    try {
        return text ? (JSON.parse(text) as T) : ({} as T);
    } catch {
        throw new Error("Invalid JSON response");
    }
}

export const get = async <T>(path: string): Promise<T> =>
    request<T>(path, "GET"); export const post = async <T, B = unknown>(
        path: string,
        body: B
    ): Promise<T> => request<T>(path, "POST", body);
export const put = async <T, B = unknown>(
    path: string,
    body: B
): Promise<T> => request<T>(path, "PUT", body);

export const del = async <T>(path: string): Promise<T> =>
    request<T>(path, "DELETE")