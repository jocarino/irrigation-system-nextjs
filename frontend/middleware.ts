import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("connect.sid");

  // Function to check if the session is valid
  async function isValidSession(sessionId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_API_URL}/api/check-auth`,
        {
          credentials: "include",
          headers: {
            Cookie: `connect.sid=${sessionId}`,
          },
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Error checking session:", error);
      return false;
    }
  }

  if (session) {
    const isAuthenticated = await isValidSession(session.value);

    if (isAuthenticated && request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (!request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
