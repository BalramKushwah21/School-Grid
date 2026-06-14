import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req) {
	const { email, password } = await req.json();


    const user =  await Prisma.user.findUnique({
        where:{
            email : email,
        },
    });
 console.log(user);


	// console.log(email);
	// console.log(password);

	// Check user in database
	// Generate JWT / Session

	return NextResponse.json({
		success: true,
		message: "Login successful",
	});
}
