import { NextResponse } from "next/server";
import { prisma } from "@prisma/client";
import { enableCompileCache } from "node:module";

export async function POST(req) {
	const { email, password }= await req.json();
	console.log(email);
	try {

		// const user = await prisma.user.findUnique({
		// 	where: {
		// 		email: email,
		// 	},
		// });
		// console.log(user);

		return NextResponse.json({
			success: true,
			message: "Login Successful",
			
		});
	} catch (error) {
		console.error("Login Error:", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message,
			},
			{ status: 500 },
		);
	}
}
