"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();

    const [helloMessage, setHelloMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!session) return;
        if (fetchedRef.current) return;

        fetchedRef.current = true;
        setLoading(true);

        fetch("/api/hello")
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setHelloMessage(data.message);
                } else {
                    setHelloMessage("Error fetching message");
                }
            })
            .catch(() => setHelloMessage("Error fetching message"))
            .finally(() => setLoading(false));
    }, [session]);

    const handleSignOut = () => {
        router.push("/sign-out");
    };

    return (
        <main>
            <h1>DevChat</h1>
            <p>
                Hello, <strong>{session?.user?.name}</strong>!
            </p>
            <p>AT: {session?.accessToken}</p>
            <p>RT: {session?.refreshToken}</p>
            <p>Hello service response: {loading ? "Loading..." : helloMessage}</p>
            <div>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </main>
    );
}
