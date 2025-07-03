import { JWT } from "next-auth/jwt";
import { env } from "@/next.env";

export async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const url = `${env.PUBLIC.KEYCLOAK_URL}/protocol/openid-connect/token`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken ?? "",
                client_id: env.PUBLIC.KEYCLOAK_CLIENT_ID ?? "",
                client_secret: env.PRIVATE.KEYCLOAK_CLIENT_SECRET ?? "",
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw new Error(refreshedTokens.error_description || "Failed to refresh token");
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
            idToken: refreshedTokens.id_token,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return {
            ...token,
            accessToken: undefined,
            refreshToken: undefined,
            expiresAt: undefined,
            idToken: undefined,
        };
    }
}
