import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // BEST PRACTICE: Import Singleton Prisma

// ==========================================
// GET: Fetch a single teacher's full dossier
// ==========================================
export async function GET(request, { params }) {
	try {
		// 1. Await params for Next.js 15+ compatibility
		const { id: teacherId } = await params;

		// 2. Authenticate and extract multi-tenant ID
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		// Guard Clause
		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		// 3. Fetch single teacher strictly for this school
		const teacher = await prisma.teacher.findFirst({
			where: {
				id: teacherId,
				schoolId: schoolId, // Strict data isolation check
			},
		});

		if (!teacher) {
			return NextResponse.json(
				{ error: "Faculty record not found" },
				{ status: 404 },
			);
		}

		// Return data wrapping inside 'data' key as expected by frontend, OR directly return teacher.
		// Note: Check your frontend, earlier we used `return NextResponse.json(teacher);`
		return NextResponse.json(teacher, { status: 200 });
	} catch (error) {
		console.error("Error fetching single faculty record:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// ==========================================
// PUT: Update a single teacher's details
// ==========================================
export async function PUT(request, { params }) {
	try {
		// Next.js 15 requires awaiting params
		const { id: teacherId } = await params;
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		if (!teacherId) {
			return NextResponse.json(
				{ error: "Teacher ID is required" },
				{ status: 400 },
			);
		}

		const body = await request.json();

		// STRICT SCHEMA MAPPING
		const updatedTeacher = await prisma.teacher.update({
			where: {
				id: teacherId,
				schoolId: schoolId, // Ensure admin updates their own teacher
			},
			data: {
				// Personal Information
				firstName: body.firstName,
				lastName: body.lastName,
				email: body.email,
				phone: body.phone,
				dateOfBirth: body.dob ? new Date(body.dob) : undefined,
				gender: body.gender,
				nationalIdNumber: body.nationalIdNumber,
				address: body.address,

				// Professional Details
				employeeId: body.employeeId,
				designation: body.designation,
				department: body.department,
				dateOfJoining: body.dateOfJoining
					? new Date(body.dateOfJoining)
					: undefined,
				qualification: body.qualification,
				experienceYears: body.experience
					? parseInt(body.experience)
					: 0,
				isClassTeacher: body.isClassTeacher || false,
				status: body.status || "Active",

				// Payroll & Bank Details (Flat fields, NOT a nested JSON object)
				basicSalary: body.basicSalary
					? parseFloat(body.basicSalary)
					: 0,
				bankName: body.bankName,
				accountNumber: body.accountNumber,
				ifscCode: body.ifscCode,
				panNumber: body.panNumber,
			},
		});

		return NextResponse.json(
			{
				message: "Faculty details updated successfully!",
				data: updatedTeacher,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Update transaction failed:", error);

		// Prisma Unique Constraint Error (e.g. Employee ID or Email already exists)
		if (error.code === "P2002") {
			return NextResponse.json(
				{
					error: "Unique constraint failed. Email or Employee ID is already in use by another teacher.",
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Internal Server Error during update." },
			{ status: 500 },
		);
	}
}
