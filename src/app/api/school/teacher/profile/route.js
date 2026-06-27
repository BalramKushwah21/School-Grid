import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Password hash verify/update karne ke liye

// ==========================================
// 1. FETCH PROFILE DATA (GET)
// ==========================================
export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);

		// Guard Clause: Check if user is logged in
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		// Teacher record fetch karein using logged-in userId aur schoolId
		const teacher = await prisma.teacher.findFirst({
			where: {
				userId: session.user.id,
				schoolId: session.user.schoolId,
			},
		});

		if (!teacher) {
			return NextResponse.json(
				{ error: "Teacher profile not found" },
				{ status: 404 },
			);
		}

		// Database data ko frontend ke format me map karein
		const profileData = {
			profilePhoto:
				teacher.profilePhoto ||
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
			fullName: `${teacher.firstName} ${teacher.lastName}`.trim(),
			teacherId: teacher.employeeId,
			designation: teacher.designation,
			department: teacher.department,
			email: teacher.email,
			mobileNumber: teacher.phone,
			alternateMobile: "", // Note: Schema me nahi hai, aap chahien toh add kar sakte hain
			address: teacher.address || "",
			city: "", // Address string se split kar sakte hain ya schema update kar sakte hain
			pincode: "",
			qualification: teacher.qualification,
			experience: `${teacher.experienceYears} Years`,
		};

		return NextResponse.json(profileData, { status: 200 });
	} catch (error) {
		console.error("GET Profile Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// ==========================================
// 2. UPDATE PROFILE OR PASSWORD (PUT)
// ==========================================
export async function PUT(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { actionType } = body; // actionType check karega ki profile update karni hai ya password

		// ------------------------------------------
		// ACTION A: PASSWORD UPDATE
		// ------------------------------------------
		if (actionType === "UPDATE_PASSWORD") {
			const { currentPassword, newPassword } = body;

			// 1. Get User record to check old password
			const user = await prisma.user.findUnique({
				where: { id: session.user.id },
			});

			// 2. Verify current password
			const isPasswordValid = await bcrypt.compare(
				currentPassword,
				user.password,
			);
			if (!isPasswordValid) {
				return NextResponse.json(
					{ error: "Incorrect current password!" },
					{ status: 400 },
				);
			}

			// 3. Hash new password & Save
			const hashedNewPassword = await bcrypt.hash(newPassword, 10);
			await prisma.user.update({
				where: { id: session.user.id },
				data: { password: hashedNewPassword, isFirstLogin: false },
			});

			return NextResponse.json(
				{ message: "Password updated successfully!" },
				{ status: 200 },
			);
		}

		// ------------------------------------------
		// ACTION B: PROFILE INFO UPDATE
		// ------------------------------------------
		if (actionType === "UPDATE_PROFILE") {
			// String experience ko wapas Number me convert karein ("8 Years" -> 8)
			const expNumber = parseInt(body.experience) || 0;

			await prisma.teacher.update({
				where: { userId: session.user.id }, // Logged-in user ki hi profile update hogi
				data: {
					phone: body.mobileNumber,
					address: `${body.address}, ${body.city} - ${body.pincode}`, // Combining frontend fields into DB single field
					qualification: body.qualification,
					experienceYears: expNumber,
					profilePhoto: body.profilePhoto,
				},
			});

			return NextResponse.json(
				{ message: "Profile updated successfully!" },
				{ status: 200 },
			);
		}

		return NextResponse.json(
			{ error: "Invalid action type" },
			{ status: 400 },
		);
	} catch (error) {
		console.error("PUT Profile Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
