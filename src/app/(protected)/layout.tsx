"use client";

import { ReactNode } from "react";
import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { SessionProvider } from "@/context/session-provider";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <NextAuthProvider>
            <SessionProvider>
                {children}
            </SessionProvider>
        </NextAuthProvider>
    );
}