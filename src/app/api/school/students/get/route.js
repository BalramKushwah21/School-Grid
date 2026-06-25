import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;

		// Fetch students with all related profiles
		const students = await prisma.student.findMany({
			where: { schoolId: schoolId },
			include: {
				academicProfile: true,
				family: true,
				feeRecord: true,
				transportProfile: true,
			},
			orderBy: { createdAt: "desc" },
		});

		const formattedStudents = students.map((std) => {
			const dobDate = std.dateOfBirth ? new Date(std.dateOfBirth) : null;
			const formattedDob = dobDate
				? dobDate.toLocaleDateString("en-IN")
				: "N/A";
			const phoneStr = std.family?.fatherMobile || "N/A";

			// Fee Due Logic: Total due (mock structure, updatable based on your calculations)
			const dueAmount = std.feeRecord ? 12000 : 0;

			// Transport Route
			const routeStatus = std.transportProfile?.needTransport
				? std.transportProfile?.route || "Route Pending"
				: "Self / Private";

			// Attendance Status
			const attendanceStr = "85%";

			return {
				id: std.id,
				rollNumber:
					std.rollNumber || `TMP-${std.id.slice(-4).toUpperCase()}`,
				name: `${std.firstName} ${std.lastName}`,
				class: std.academicProfile?.currentClass || "N/A",
				section: std.academicProfile?.section || "N/A",
				phone: phoneStr,
				attendance: attendanceStr,
				dob: formattedDob,
				dueAmount: dueAmount,
				route: routeStatus,
				status: "Active", // Default logic or use std.isActive if added to schema
			};
		});

		return NextResponse.json({ data: formattedStudents }, { status: 200 });
	} catch (error) {
		console.error("Fetch Students Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
