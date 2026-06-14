import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
	const school = await req.json();
	try {

		const user = await prisma.user.create({
			data: {
				name: school.adminName,
				email: school.email,
				userRole: "admin",
				password: school.password,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Registration Successful",
			user,
		});
	} catch (error) {
		console.error("Registration Error:", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message,
			},
			{ status: 500 },
		);
	}
}
