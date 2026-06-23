import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to map Frontend Fee Category strings to Prisma Enums
const mapFeeCategory = (categoryStr) => {
	switch (categoryStr) {
		case "Staff Discount":
			return "STAFF_DISCOUNT";
		case "Sibling Discount":
			return "SIBLING_DISCOUNT";
		case "Merit Scholarship":
			return "MERIT";
		case "EWS":
			return "EWS";
		default:
			return "GENERAL";
	}
};

export async function POST(request) {
	try {
		// 1. SECURITY: Check if user is logged in
		const session = await getServerSession(authOptions);
		
		if (!session || !session.user) {
			return NextResponse.json(
				{ error: "Unauthorized access. Please login." },
				{ status: 401 },
			);
		}

		const schoolId = session.user.schoolId;
		if (!schoolId) {
			return NextResponse.json(
				{ error: "School account not linked to user." },
				{ status: 403 },
			);
		}

		// 2. READ FORM DATA (Parsed as JSON, not FormData)
		const data = await request.json();

		// 3. BASIC VALIDATION
		if (
			!data.firstName ||
			!data.lastName ||
			!data.admissionDate ||
			!data.dob ||
			!data.classApplyingFor
		) {
			return NextResponse.json(
				{ error: "All mandatory fields (*) are required." },
				{ status: 400 },
			);
		}

		// 4. SAVE TO DATABASE (Using Prisma Nested Writes)
		
		const newStudent = await prisma.student.create({
			data: {
				// FIX: Use 'connect' instead of raw 'schoolId'
				school: { connect: { id: schoolId } },

				// Student Core
				firstName: data.firstName,
				lastName: data.lastName,
				admissionDate: new Date(data.admissionDate),
				dateOfBirth: new Date(data.dob),
				gender: data.gender ? data.gender.toUpperCase() : "OTHER",
				bloodGroup: data.bloodGroup,
				religion: data.religion,
				category: data.category
					? data.category.toUpperCase()
					: "GENERAL",
				nationality: data.nationality || "Indian",
				isStaffChild: data.isStaffChild === "Yes",
				identificationMark: data.identificationMark,
				nationalIdNumber: data.aadhar,
				abcId: data.abcId,
				panNumber: data.panNumber,

				// Create associated Family & Address Profile
				family: {
					create: {
						school: { connect: { id: schoolId } }, // FIX
						parentsMaritalStatus: data.parentsMaritalStatus
							? data.parentsMaritalStatus.toUpperCase()
							: "MARRIED",
						legalCustodyHolder: data.legalCustodyHolder
							? data.legalCustodyHolder.toUpperCase()
							: "BOTH",

						fatherName: data.fatherName,
						fatherMobile: data.fatherMobile,
						fatherOccupation: data.fatherOccupation,
						fatherIncome: data.fatherIncome,
						fatherEmail: data.fatherEmail,

						motherName: data.motherName,
						motherMobile: data.motherMobile,
						motherOccupation: data.motherOccupation,
						motherEmail: data.motherEmail,

						siblingStudyingHere: data.siblingStudyingHere === "Yes",
						siblingDetails: data.siblingDetails,

						address: {
							create: {
								houseNo: data.houseNo,
								street: data.street,
								city: data.city,
								district: data.district,
								state: data.state,
								pincode: data.pincode,
							},
						},
					},
				},

				// Create associated Academic Profile
				academicProfile: {
					create: {
						school: { connect: { id: schoolId } }, // FIX
						currentClass: data.classApplyingFor,
						section: data.section,
						academicSession: data.academicSession,
						previousSchool: data.previousSchool,
						previousClass: data.previousClass,
						previousUdiseCode: data.previousUdiseCode,
						previousSchoolMedium: data.previousMediumOfInstruction,
						tcNumber: data.tcNumber,
						boardRegistrationNo: data.boardRegistrationNumber,
					},
				},

				// Create associated Medical Profile
				medicalProfile: {
					create: {
						school: { connect: { id: schoolId } }, // FIX
						emergencyContactName: data.emergencyContact,
						emergencyContactNumber: data.emergencyMobile,
						relationWithStudent: data.emergencyRelation,
						familyDoctorName: data.familyDoctorName,
						familyDoctorContactNumber: data.familyDoctorMobile,
						preferredHospital: data.preferredHospital,
						medicalConditions: data.medicalConditions,
						allergies: data.allergies,
					},
				},

				// Create associated Financial/Fee Profile
				feeRecord: {
					create: {
						school: { connect: { id: schoolId } }, // FIX
						feeCategory: mapFeeCategory(data.feeCategory),
						scholarship: data.scholarship === "Yes",
						concessionDetails: data.concessionDetails,

						admissionFeePaid:
							parseFloat(data.admissionFeePaid) || 0,
						transportFeePaid:
							parseFloat(data.transportFeePaid) || 0,
						securityDepositPaid:
							parseFloat(data.securityDepositPaid) || 0,

						tuitionFeeCycle: data.tuitionFeeCycle
							? data.tuitionFeeCycle.toUpperCase()
							: "QUARTERLY",
						paymentMode: data.paymentMode
							? data.paymentMode.toUpperCase().replace(" ", "_")
							: "CASH",

						bankName: data.bankName,
						accountNumber: data.accountNumber,
						ifscCode: data.ifscCode,
						branchNameAndCode: data.branchNameAndCode,
					},
				},
			},
		});

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
