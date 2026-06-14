import { NextResponse } from "next/server";

export async function POST(req) {
	const { formData } = await req.json();

    const email = formData.get("email");
	const password = formData.get("password");
    

	console.log(email);
	console.log(password);

	// Check user in database
	// Generate JWT / Session

	return NextResponse.json({
		success: true,
		message: "Login successful",
	});
}
