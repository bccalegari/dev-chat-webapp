import {MiddlewareConfig, NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const PATHS = {
    LOGIN: "/sign-in",
    LOGOUT: "/sign-out",
    HOME: "/",
};

const redirectTo = (destination: string, request: NextRequest) => {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url);
};

const isAuthenticated = async (request: NextRequest): Promise<boolean> => {
    const token = await getToken({ req: request });
    return !!token;
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith(PATHS.LOGIN)) {
        return (await isAuthenticated(request)) ? redirectTo(PATHS.HOME, request) : NextResponse.next();
    }

    if (pathname.startsWith(PATHS.LOGOUT)) {
        return (await isAuthenticated(request)) ? NextResponse.next() : redirectTo(PATHS.LOGIN, request);
    }

    if (!(await isAuthenticated(request))) {
        return redirectTo(PATHS.LOGIN, request);
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
