import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// ==========================================
// GET: Fetch ONLY Existing Attendance
// ==========================================
export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const dateParam =
			searchParams.get("date") || new Date().toISOString().split("T")[0];

		// Ensure accurate date matching
		const targetDate = new Date(dateParam);

		// Fetch existing records for this specific date
		const existingRecords = await prisma.teacherAttendance.findMany({
			where: {
				schoolId: schoolId,
				date: targetDate,
			},
		});

		// Format them for quick frontend mapping O(1)
		const attendanceRecords = {};
		const remarksRecords = {};

		existingRecords.forEach((record) => {
			// Changed staffId to teacherId based on new schema
			attendanceRecords[record.teacherId] = record.status;
			remarksRecords[record.teacherId] = record.remarks || "";
		});

		return NextResponse.json(
			{
				attendanceRecords,
				remarksRecords,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching attendance data:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// ==========================================
// POST: Save/Sync Attendance to Database
// ==========================================
export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);
		const schoolId = session?.user?.schoolId;

		if (!session || !schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { date, attendanceData, remarksData } = body;

		if (!date || !attendanceData) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const attendanceDate = new Date(date);

		// Prepare Bulk Upsert Transaction
		const transactionOperations = Object.keys(attendanceData).map(
			(teacherId) => {
				const status = attendanceData[teacherId];
				const remarks = remarksData[teacherId] || "";

				return prisma.teacherAttendance.upsert({
					where: {
						// Changed to match the compound unique index in your new schema
						schoolId_teacherId_date: {
							schoolId: schoolId,
							teacherId: teacherId,
							date: attendanceDate,
						},
					},
					update: {
						status: status,
						remarks: remarks,
					},
					create: {
						// Changed staffId to teacherId and removed staffType
						schoolId: schoolId,
						teacherId: teacherId,
						date: attendanceDate,
						status: status,
						remarks: remarks,
					},
				});
			},
		);

		// Execute Database Transaction
		await prisma.$transaction(transactionOperations);

		return NextResponse.json(
			{ message: "Teachers attendance synced successfully!" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error saving teachers attendance:", error);
		return NextResponse.json(
			{ error: "Internal Server Error during save" },
			{ status: 500 },
		);
	}
}
