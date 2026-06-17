import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path to where your Prisma client is initialized
import bcrypt from "bcryptjs";

export async function POST(request) {
	try {
		const body = await request.json();
		const { email, password } = body;

		// 1. Validate inputs
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 },
			);
		}

		// 2. Find the user in the database
		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Account Does not exist" },
				{ status: 404 },
			);
		}

		// 3. Verify the password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid Password" },
				{ status: 401 },
			
			);
		}

		// 4. Determine the redirect path based on UserRole
		let redirectUrl = "/";
		switch (user.userRole) {
			case "SUPER_ADMIN":
				redirectUrl = "/super-admin/dashboard";
				break;
			case "SCHOOL_ADMIN":
				redirectUrl = "/admin/dashboard";
				break;
			case "TEACHER":
				redirectUrl = "/teacher/portal";
				break;
			case "PARENT":
				redirectUrl = "/parent/dashboard";
				break;
			case "STUDENT":
				redirectUrl = "/student/home";
				break;
			default:
				redirectUrl = "/unauthorized";
		}

		// 5. Create the response object
		const response = NextResponse.json({
			success: true,
			message: "Login successful",
			redirectUrl: redirectUrl,
			user: {
				id: user.id,
				name: user.name,
				role: user.userRole,
			},
		});

		// 6. Set an authentication cookie (Example using a basic secure cookie)
		// In production, you should issue a signed JWT here.
		response.cookies.set({
			name: "auth_token",
			value: user.id, // Replace this with an actual JWT in production
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		return response;
	} catch (error) {
		console.error("Login Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
