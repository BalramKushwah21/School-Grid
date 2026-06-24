import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		if (!schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		// Sirf valid schema columns fetch karein
		const teachers = await prisma.teacher.findMany({
			where: { schoolId },
			orderBy: { firstName: "asc" },
			select: {
				id: true,
				employeeId: true,
				firstName: true,
				lastName: true,
				designation: true,
				department: true,
				phone: true,
				status: true,
			},
		});

		// Frontend ke liye fullName yahan banayein
		const formattedTeachers = teachers.map((t) => ({
			...t,
			fullName: `${t.firstName} ${t.lastName || ""}`.trim(),
		}));

		return NextResponse.json(formattedTeachers, { status: 200 });
	} catch (error) {
		console.error("Error fetching teachers:", error);
		return NextResponse.json(
			{ error: "Failed to fetch teachers" },
			{ status: 500 },
		);
	}
}
