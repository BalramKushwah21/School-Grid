

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path if your prisma client is elsewhere
import bcrypt from "bcryptjs";

export async function POST(req) {


  
	try {
		const formData = await req.json();

		// 1. Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: formData.email,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: "A user already exists with this email address.",
				},
				{ status: 409 },
			);
		}

		// 2. Hash the password securely
		const hashedPassword = await bcrypt.hash(formData.password, 10);

		// 3. Execute an Atomic Transaction
		// This ensures both User and School are created together. If School creation fails
		// (e.g., duplicate subdomain), the User creation is automatically rolled back.
		const result = await prisma.$transaction(async (tx) => {
			// A. Create the Admin User first
			const newUser = await tx.user.create({
				data: {
					schoolId: formData.udiseCode, // Satisfies the @unique schoolId field on User
					name: formData.adminName,
					email: formData.email,
					userRole: "ADMIN", // Matches your updated Enum exactly
					password: hashedPassword,
				},
			});

			// B. Create the School Profile and link it to the new User
			const newSchool = await tx.school.create({
				data: {
					schoolName: formData.schoolName,
					subdomain: formData.subdomain,
					schoolType: formData.schoolType,
					adminName: formData.adminName,
					udiseCode: formData.udiseCode,
					phone: formData.phone,
					email: formData.email,
					city: formData.city,
					district: formData.district,
					state: formData.state,
					address: formData.address,
					pincode: formData.pincode,
					subscriptionPlan: formData.subscriptionPlan || "BASIC",

					// Connect the school to the user we just created
					userId: newUser.id,
				},
			});

			return { user: newUser, schoolData: newSchool };
		});

		// 4. Return Success Response
		// Strip the password out of the response object for security
		const { password, ...safeUser } = result.user;

		return NextResponse.json(
			{
				success: true,
				message: "Registration Successful!",
				user: safeUser,
				schoolData: result.schoolData,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Registration Error:", error);

		// Handle Prisma's Unique Constraint Error (e.g., if subdomain, udiseCode, or schoolId is already taken)
		if (error.code === "P2002") {
			const target = error.meta?.target?.[0] || "field";
			return NextResponse.json(
				{
					success: false,
					message: `The ${target} provided is already registered. Please use a different one.`,
				},
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message:
					"An unexpected server error occurred during registration.",
			},
			{ status: 500 },
		);
	}
}
