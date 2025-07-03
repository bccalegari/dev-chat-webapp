import NextAuth, { Account, DefaultSession, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import {AdapterUser} from "next-auth/adapters";
import {env} from "@/next.env";
import { refreshAccessToken } from "@/service/refresh-token";

declare module "next-auth" {
    interface Session extends DefaultSession {
        idToken?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idToken?: string;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
    }
}

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: env.PUBLIC.KEYCLOAK_CLIENT_ID || "",
            clientSecret: env.PRIVATE.KEYCLOAK_CLIENT_SECRET || "",
            issuer: env.PUBLIC.KEYCLOAK_ISSUER,

        }),
    ],
    callbacks: {
        async jwt(params: {
            token: JWT;
            user?: User | AdapterUser;
            account: Account | null;
            profile?: Profile;
            trigger?: "signIn" | "signUp" | "update";
            isNewUser?: boolean;
            session?: Session;
        }): Promise<JWT> {
            const { token, account } = params;
            if (account) {
                token.idToken = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }

            const now = Math.floor(Date.now() / 1000);
            if (token.expiresAt && token.expiresAt < now) {
                return await refreshAccessToken(token);
            }

            return token;
        },

        async session(params: { session: Session; token: JWT }): Promise<Session> {
            const { session, token } = params;
            session.idToken = token.idToken as string | undefined;
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string | undefined;
            return session;
        }
    },
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-out",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };