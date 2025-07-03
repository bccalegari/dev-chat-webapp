"use client";

import React, { createContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";

export const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            if (!session?.idToken || !session?.accessToken) {
                signOut({ callbackUrl: "/sign-in" });
            }
        } else if (status === "unauthenticated") {
            signOut({ callbackUrl: "/sign-in" });
        }
    }, [status, session]);

    return (
        <SessionContext.Provider value={session ?? null}>
            {children}
        </SessionContext.Provider>
    );
}
