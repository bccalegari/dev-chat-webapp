"use client";

import {signIn} from "next-auth/react";

export default function SignInPage() {
    function handleLogin(providerId: string) {
        signIn(providerId, { callbackUrl: "/" });
    }

    return (
        <div>
            <h1>Sign In</h1>
                <div key="keycloak">
                    <button onClick={() => handleLogin("keycloak")}>
                        Sign in with {"keycloak"}
                    </button>
                </div>
        </div>
    );
}
