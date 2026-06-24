import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

		return NextResponse.json({ data: teacher }, { status: 200 });
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

		const updatedTeacher = await prisma.teacher.update({
			where: {
				id: teacherId,
				schoolId: schoolId,
			},
			data: {
				// Ensure these match your Prisma schema field names
				fullName: body.fullName,
				gender: body.gender,
				dob: body.dob ? new Date(body.dob) : null,
				bloodGroup: body.bloodGroup,
				email: body.email,
				phone: body.phone,
				emergencyContact: body.emergencyContact,
				address: body.address,
				department: body.department,
				designation: body.designation,
				joiningDate: body.joiningDate
					? new Date(body.joiningDate)
					: null,
				classesTaught: body.classesTaught,
				qualifications: body.qualifications,
				status: body.status,

				// Assuming Payroll is a JSON field in Prisma
				payroll: {
					basicSalary: body.basicSalary,
					bankName: body.bankName,
					accountNumber: body.accountNumber,
					ifscCode: body.ifscCode,
				},
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
		if (error.code === "P2002") {
			return NextResponse.json(
				{
					error: "Unique constraint failed. Email or Employee ID in use.",
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
