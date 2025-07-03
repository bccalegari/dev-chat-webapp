import { env } from "@/next.env";

export async function getHelloFromBackend(token: string): Promise<string> {
    const baseUrl = env.PUBLIC.KONG_URL;
    const url = `${baseUrl}/hello`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, { headers });

    if (!res.ok) {
        throw new Error(`Failed to fetch from backend: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data?.message || typeof data.message !== "string") {
        throw new Error("Invalid response format: missing 'message' field");
    }

    return data.message;
}