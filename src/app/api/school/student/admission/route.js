import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust according to your folder structure
import { getServerSession } from "next-auth"; // Session checking ke liye
// import { authOptions } from "../../auth/[...nextauth]/route"; // Auth options file path

export async function POST(request) {
	try {
		// 1. SECURITY: Check if user is logged in
		const session = await getServerSession();
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized access. Please login." },
				{ status: 401 },
			);
		}

		// Fetch School ID from the logged-in user's session
		// (Assuming you save schoolId in session for multi-tenant SaaS)
		const schoolId = session.user.schoolId;

		if (!schoolId) {
			return NextResponse.json(
				{ error: "School account not linked to user." },
				{ status: 403 },
			);
		}

		// 2. READ FORM DATA
		const formData = await request.formData();

		// 3. EXTRACT TEXT FIELDS
		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");
		const admissionDate = formData.get("admissionDate");
		const dob = formData.get("dob");
		const classApplyingFor = formData.get("classApplyingFor");
		const admissionFeePaid = formData.get("admissionFeePaid");

		// 4. BASIC VALIDATION
		if (
			!firstName ||
			!lastName ||
			!admissionDate ||
			!dob ||
			!classApplyingFor
		) {
			return NextResponse.json(
				{ error: "All mandatory fields (*) are required." },
				{ status: 400 },
			);
		}

		// 5. FILE HANDLING (Example of how to capture file objects)
		const studentPhoto = formData.get("studentPhoto");
		// NOTE: In production, upload this 'studentPhoto' object to AWS S3, Cloudinary, or UploadThing
		// and get a secure URL to save in the Prisma database.

		// 6. SAVE TO DATABASE (Prisma)
		const newStudent = await prisma.student.create({
			data: {
				schoolId: schoolId, // Multi-tenant structure me schoolId zaroori hai
				firstName: firstName,
				lastName: lastName,
				gender: formData.get("gender"),
				admissionDate: new Date(admissionDate), // String ko Date me convert karein
				dob: new Date(dob), // String ko Date me convert karein
				bloodGroup: formData.get("bloodGroup"),
				category: formData.get("category"),

				classApplyingFor: classApplyingFor,
				section: formData.get("section"),

				fatherName: formData.get("fatherName"),
				fatherMobile: formData.get("fatherMobile"),
				motherName: formData.get("motherName"),
				motherMobile: formData.get("motherMobile"),

				city: formData.get("city"),
				state: formData.get("state"),
				pincode: formData.get("pincode"),

				admissionFeePaid: parseFloat(admissionFeePaid) || 0, // String ko number me convert karein
			},
		});

		// 7. RETURN SUCCESS RESPONSE
		return NextResponse.json(
			{
				message: "Student admitted successfully",
				data: newStudent,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Admission Backend Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error. Please try again later." },
			{ status: 500 },
		);
	}
}
