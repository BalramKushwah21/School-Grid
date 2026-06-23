// src/app/api/school/info/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// authOptions ka path apne project ke hisaab se set karein
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Prisma client ka path

export async function GET(request) {
	try {
		// 1. Check karein ki user logged in hai ya nahi
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		// 2. Database se School ka data fetch karein
		// (Aapke context ke mutabiq, user ke paas schoolId hota hai)
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				school: true, // Yeh school table ka poora data le aayega
			},
		});

		if (!user || !user.school) {
			return NextResponse.json(
				{ error: "School data not found" },
				{ status: 404 },
			);
		}

		// 3. School data return karein
		return NextResponse.json(user.school, { status: 200 });
	} catch (error) {
		console.error("School Info Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
