import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		const { email, password } = await req.json();

		

		return NextResponse.json({
			success: true,
			message: "Login successful",
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{
				success: false,
				message: "Internal Server Error",
			},
			{ status: 500 },
		);
	}
}
