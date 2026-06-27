import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// Apni NextAuth config file ka path yahan daalein (e.g., '@/lib/auth' ya '@/app/api/auth/[...nextauth]/route')
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; // Apne prisma client ka path verify karein

export async function GET(request) {
	try {
		// ==========================================
		// 1. AUTHENTICATION & TENANT VERIFICATION
		// ==========================================
		const session = await getServerSession(authOptions);

		// Agar user logged in nahi hai ya uske session me schoolId nahi hai (Tenant missing)
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{
					error: "Unauthorized access. Invalid session or missing tenant ID.",
				},
				{ status: 401 },
			);
		}

		const { schoolId, name, role } = session.user;
		const today = new Date();

		// ==========================================
		// 2. PARALLEL DATABASE QUERIES (Performance Best Practice)
		// Promise.all use karne se saari queries ek saath chalengi, jisse API bohot fast hogi.
		// HAR QUERY MEIN `where: { schoolId }` LAGANA ZAROORI HAI (Tenant Isolation)
		// ==========================================
		// ==========================================
		// 2. PARALLEL DATABASE QUERIES
		// ==========================================
		const [schoolData, totalStudents, totalTeachers, studentsByGender] =
			await Promise.all([
				// 1. School ki basic info fetch karna
				prisma.school.findUnique({
					where: { id: schoolId },
					select: { schoolName: true },
				}),

				// 2. Total students count (Yahan se status: "ACTIVE" hata diya gaya hai)
				prisma.student.count({
					where: { schoolId: schoolId },
				}),

				// 3. Total teachers count (Teacher schema me status string format me "Active" hai)
				prisma.teacher.count({
					where: { schoolId: schoolId, status: "Active" },
				}),

				// 4. Gender distribution
				prisma.student.groupBy({
					by: ["gender"],
					where: { schoolId: schoolId },
					_count: { gender: true },
				}),
			]);
		// Active academic year nikalna
		const activeAcademicYear =
			schoolData?.academicYears?.[0]?.year || "2023-24";

		// Gender data ko charts ke format mein map karna
		const formattedGenderData = studentsByGender.map((item) => ({
			name:
				item.gender === "MALE"
					? "Male"
					: item.gender === "FEMALE"
						? "Female"
						: "Other",
			value: item._count.gender,
			color: item.gender === "MALE" ? "#3b82f6" : "#ec4899", // Blue for male, Pink for female
		}));

		// ==========================================
		// 3. CONSTRUCTING THE RESPONSE FOR FRONTEND
		// ==========================================
		// Note: Jo data humne DB se directly calculate nahi kiya (jaise charts/finance),
		// usko main abhi placeholder values de raha hu. Aap usko exact apni tables
		// (e.g., FeeRecord, Attendance) ke hisaab se replace kar sakte hain.

		const dashboardData = {
			welcome: {
				principalName: name || "Admin",
				academicYear: activeAcademicYear,
				date: today.toLocaleDateString("en-US", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				pendingApprovals: 5, // Example: await prisma.approval.count({ where: { schoolId, status: 'PENDING' }})
				urgentNotices: 2,
				newAdmissions: 12,
			},

			kpis: [
				{
					title: "Total Students",
					value: totalStudents.toLocaleString(),
					iconName: "Users",
					color: "text-blue-600",
					bg: "bg-blue-50",
				},
				{
					title: "Total Teachers",
					value: totalTeachers.toLocaleString(),
					iconName: "UserCheck",
					color: "text-indigo-600",
					bg: "bg-indigo-50",
				},
				{
					title: "Total Parents",
					value: Math.floor(totalStudents * 0.8).toLocaleString(), // Logic: Assuming 80% unique parents
					iconName: "Users2",
					color: "text-purple-600",
					bg: "bg-purple-50",
				},
				{
					title: "Today's Attendance",
					value: "94.2%", // Prisma query se real percentage nikalein
					iconName: "CalendarCheck",
					color: "text-emerald-600",
					bg: "bg-emerald-50",
				},
			],

			charts: {
				studentsByClass: [
					{ name: "Class 8", students: 240 },
					{ name: "Class 9", students: 310 },
					{ name: "Class 10", students: 380 },
					{ name: "Class 11", students: 290 },
					{ name: "Class 12", students: 260 },
				],
				attendanceTrend: [
					{ day: "Mon", perc: 94 },
					{ day: "Tue", perc: 96 },
					{ day: "Wed", perc: 95 },
					{ day: "Thu", perc: 92 },
					{ day: "Fri", perc: 97 },
				],
				revenue: [
					{ month: "Jan", collected: 12 },
					{ month: "Feb", collected: 15 },
					{ month: "Mar", collected: 18 },
					{ month: "Apr", collected: 22 },
				],
				gender:
					formattedGenderData.length > 0
						? formattedGenderData
						: [
								{ name: "Male", value: 55, color: "#3b82f6" },
								{ name: "Female", value: 45, color: "#ec4899" },
							],
			},

			attendanceDonuts: {
				students: [
					{ name: "Present", value: 2355, color: "#10b981" },
					{ name: "Absent", value: 95, color: "#f1f5f9" },
				],
				teachers: [
					{
						name: "Present",
						value: totalTeachers - 2,
						color: "#6366f1",
					},
					{ name: "Absent", value: 2, color: "#f1f5f9" },
				],
				staff: [
					{ name: "Present", value: 31, color: "#f59e0b" },
					{ name: "Absent", value: 1, color: "#f1f5f9" },
				],
			},

			finance: {
				collected: "₹15L",
				pending: "₹4L",
				expenses: "₹8L",
				profit: "₹7L",
			},

			aiInsights: [
				{
					msg: "15 Students have critically low attendance (< 75%)",
					type: "danger",
				},
				{
					msg: "12 Fee accounts are overdue for 60+ days",
					type: "warning",
				},
			],

			activityFeed: [
				{
					time: "10:30 AM",
					title: "New Admission",
					desc: "Rahul Kumar, Class 6",
				},
				{
					time: "11:15 AM",
					title: "Attendance Marked",
					desc: "140/142 Teachers Present",
				},
			],

			upcomingEvents: [
				["Science Exhibition", "21 June"],
				["Unit Test", "5 July"],
			],
		};

		// Return successful response
		return NextResponse.json(dashboardData, { status: 200 });
	} catch (error) {
		console.error("DASHBOARD API ERROR:", error);

		// Fallback error response jisse frontend handle kar sake
		return NextResponse.json(
			{ error: "Internal Server Error. Please try again later." },
			{ status: 500 },
		);
	}
}
