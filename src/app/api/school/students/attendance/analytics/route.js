import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
	try {
		// 1. Authenticate and extract multi-tenant ID
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		// Guard Clause ensures data isolation
		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		// 2. Get the requested date from URL query parameters
		const { searchParams } = new URL(request.url);
		const targetDate =
			searchParams.get("date") || new Date().toISOString().split("T")[0];

		// 3. Fetch students with their attendance records strictly for this school
		const students = await prisma.student.findMany({
			where: {
				schoolId: schoolId,
			},
			include: {
				attendances: true, // Fetch all historical attendance to count total and present
			},
		});

		// 4. Transform data to match Frontend requirements
		const analyticsData = students.map((student) => {
			// Calculate Total Days and Present Days
			const totalDays = student.attendances.length;
			const presentDays = student.attendances.filter(
				(record) => record.status.toLowerCase() === "present",
			).length;

			// Find Today's (or Selected Date's) Status
			const todaysRecord = student.attendances.find((record) => {
				// Formatting Prisma DateTime to YYYY-MM-DD safely
				const recordDate = new Date(record.date)
					.toISOString()
					.split("T")[0];
				return recordDate === targetDate;
			});

			const currentStatus = todaysRecord
				? todaysRecord.status.charAt(0).toUpperCase() +
					todaysRecord.status.slice(1)
				: "Not Marked";

			return {
				id: student.id,
				class: student.class || "N/A",
				section: student.section || "N/A",
				rollNo: student.rollNo || "N/A",
				name: `${student.firstName} ${student.lastName}`.trim(),
				status: currentStatus,
				totalDays: totalDays,
				presentDays: presentDays,
			};
		});

		return NextResponse.json({ data: analyticsData }, { status: 200 });
	} catch (error) {
		console.error("Error fetching attendance analytics:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
