import { NextRequest, NextResponse } from "next/server";
import { getHelloFromBackend } from "@/service/hello-service-client";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    const token = await getToken({ req });

    if (!token?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const message = await getHelloFromBackend(token.accessToken);
        return NextResponse.json({ message });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch backend" }, { status: 500 });
    }
}
