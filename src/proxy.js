import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function proxy(req) {
		const token = req.nextauth.token;
		const path = req.nextUrl.pathname;
		
		// 1. Role-Based Access Logic
		// Agar user Admin routes access kar raha hai par Admin nahi hai
		if (path.startsWith("/admin") && token?.role !== "ADMIN") {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}

		// Agar user Teacher routes access kar raha hai par Teacher nahi hai
		if (path.startsWith("/teachers") && token?.role !== "TEACHER") {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}
		// Agar user Parent routes access kar raha hai par Parent nahi hai
		if (path.startsWith("/parents") && token?.role !== "PARENT") {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}
		// Agar use Student routes access kar raha hai par Student nahi hai
		if (path.startsWith("/students") && token?.role !== "STUDENT") {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			// Yeh check karta hai ki user logged in hai ya nahi
			authorized: ({ token }) => !!token,
		},
	},
);

// 2. Matcher: Performance ke liye bahut zaroori
// Yeh define karta hai ki middleware sirf inhi paths par chale.
// Public assets (images, icons) aur public pages (login) ko yahan ignore kiya gaya hai.
export const config = {
	matcher: [
		"/admin/:path*",
		"/teachers/:path*",
		"/parents/:path*",
		"/students/:path*",
		"/dashboard/:path*",
		// Add other protected routes here
	],
};
