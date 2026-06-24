import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
	try {
		// 1. Authenticate and extract multi-tenant ID
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		// Guard Clause: Ensure schoolId exists for data isolation
		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access or missing School ID" },
				{ status: 401 },
			);
		}

		// 2. Fetch records strictly for this specific school
		const teachers = await prisma.teacher.findMany({
			where: {
				schoolId: schoolId,
			},
			orderBy: {
				firstName: "asc", // 👈 Fixed: Use firstName instead of fullName
			},
			select: {
				id: true,
				employeeId: true,
				firstName: true, // 👈 Fetch firstName
				lastName: true, // 👈 Fetch lastName
				designation: true,
				department: true,
				phone: true,
				status: true,
				// avatarColor removed because it's not in DB (frontend generates it)
			},
		});

		// 3. Format the data to match frontend expectations
		const formattedTeachers = teachers.map((teacher) => ({
			...teacher,
			// 👈 Combine names so frontend 'fullName' state works perfectly
			fullName: `${teacher.firstName} ${teacher.lastName || ""}`.trim(),
		}));

		return NextResponse.json({ data: formattedTeachers }, { status: 200 });
	} catch (error) {
		console.error("Error fetching faculty records:", error);
		return NextResponse.json(
			{ error: "Failed to fetch faculty records. Please try again." },
			{ status: 500 },
		);
	}
}
