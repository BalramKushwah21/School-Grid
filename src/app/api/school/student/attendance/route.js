import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Apne prisma import path ke hisaab se adjust karein
import { getServerSession } from "next-auth/next";

export async function GET(request) {
	try {
		const session = await getServerSession();
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		const { searchParams } = new URL(request.url);
		const className = searchParams.get("className");
		const section = searchParams.get("section");
		const dateStr = searchParams.get("date"); // Format: YYYY-MM-DD

		const targetDate = new Date(dateStr);

		// 1. Un students ko fetch karein jo is class/section mein hain
		const students = await prisma.student.findMany({
			where: {
				schoolId: schoolId,
				className: className, // Ensure aapke Student model me ye fields matching hain
				section: section,
			},
			select: { id: true, rollNo: true, name: true, gender: true },
			orderBy: { rollNo: "asc" },
		});

		// 2. Unki is specific date ki attendance fetch karein
		const studentIds = students.map((s) => s.id);
		const attendanceRecords = await prisma.attendance.findMany({
			where: {
				schoolId: schoolId,
				studentId: { in: studentIds },
				date: targetDate,
			},
		});

		// 3. Frontend format mein map karein
		const attendanceMap = {};
		const remarksMap = {};

		attendanceRecords.forEach((record) => {
			attendanceMap[record.studentId] = record.status;
			remarksMap[record.studentId] = record.remarks || "";
		});

		return NextResponse.json({
			students,
			attendance: attendanceMap,
			remarks: remarksMap,
		});
	} catch (error) {
		console.error("GET Attendance Error:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const session = await getServerSession();
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		const body = await request.json();
		const { date, attendanceData, remarksData } = body;
		const targetDate = new Date(date);

		// Prisma Transaction - taaki saare records ek sath safely upsert ho jayein
		const upsertPromises = Object.keys(attendanceData).map((studentId) => {
			return prisma.attendance.upsert({
				where: {
					studentId_date: {
						studentId: studentId,
						date: targetDate,
					},
				},
				update: {
					status: attendanceData[studentId],
					remarks: remarksData[studentId] || "",
				},
				create: {
					studentId: studentId,
					schoolId: schoolId,
					date: targetDate,
					status: attendanceData[studentId],
					remarks: remarksData[studentId] || "",
				},
			});
		});

		await prisma.$transaction(upsertPromises);

		return NextResponse.json({ message: "Attendance Saved Successfully" });
	} catch (error) {
		console.error("POST Attendance Error:", error);
		return NextResponse.json({ error: "Server Error" }, { status: 500 });
	}
}
