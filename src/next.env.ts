export const env = {
    PUBLIC: {
        APP_URL: process.env.NEXT_PUBLIC_APP_URL as string,
        KEYCLOAK_URL: process.env.NEXT_PUBLIC_KEYCLOAK_URL as string,
        KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM as string,
        KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
        KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER as string,
        KONG_URL: process.env.KONG_URL as string
    } as const,
    PRIVATE: {
        KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET as string

    } as const,
} as const;

Object.entries({ env }).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});