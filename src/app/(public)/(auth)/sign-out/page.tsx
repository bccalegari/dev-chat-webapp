"use client";

import {signOut, useSession} from "next-auth/react";
import {useState} from "react";
import {env} from "@/next.env";

export default function SignOutPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (!session?.idToken) {
            return;
        }

        try {
            setIsLoading(true);
            await signOut({ redirect: false });
            const logoutUrl = new URL(
                `${env.PUBLIC.KEYCLOAK_URL}/realms/${env.PUBLIC.KEYCLOAK_REALM}/protocol/openid-connect/logout`
            );
            logoutUrl.searchParams.set("client_id", env.PUBLIC.KEYCLOAK_CLIENT_ID);
            logoutUrl.searchParams.set("post_logout_redirect_uri", env.PUBLIC.APP_URL);
            logoutUrl.searchParams.set("id_token_hint", session.idToken);
            window.location.href = logoutUrl.toString();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <h1>KC Sign Out</h1>
            <button onClick={handleLogout} disabled={isLoading}>
                {isLoading ? "Signing out..." : "Sign out"}
            </button>
        </main>
    );
}
