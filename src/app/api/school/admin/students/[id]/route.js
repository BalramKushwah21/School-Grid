import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// =================================================================
// 1. GET METHOD: Fetch EVERY single admission detail for the modal
// =================================================================
export async function GET(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access." },
				{ status: 401 },
			);
		}

		const resolvedParams = await params;
		const studentId = resolvedParams.id;

		const student = await prisma.student.findUnique({
			where: {
				id: studentId,
				schoolId: session.user.schoolId,
			},
			include: {
				academicProfile: true,
				medicalProfile: true,
				family: {
					include: { address: true },
				},
				feeRecord: true,
				transportProfile: true,
			},
		});

		if (!student)
			return NextResponse.json(
				{ error: "Student not found." },
				{ status: 404 },
			);

		return NextResponse.json({ data: student }, { status: 200 });
	} catch (error) {
		console.error("Fetch Specific Student Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

// =================================================================
// 2. PUT METHOD: Save and update all fields simultaneously
// =================================================================
export async function PUT(request, { params }) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || !session.user.schoolId) {
			return NextResponse.json(
				{ error: "Unauthorized access." },
				{ status: 401 },
			);
		}

		const resolvedParams = await params;
		const studentId = resolvedParams.id;
		const data = await request.json();

		// Prisma transaction update for all related forms
		const updatedStudent = await prisma.student.update({
			where: { id: studentId, schoolId: session.user.schoolId },
			data: {
				rollNumber: data.rollNumber,
				firstName: data.firstName,
				lastName: data.lastName,
				gender: data.gender,
				dateOfBirth: data.dob ? new Date(data.dob) : undefined,
				bloodGroup: data.bloodGroup,
				category: data.category,
				religion: data.religion,
				nationality: data.nationality,
				isStaffChild: data.isStaffChild === "Yes",
				identificationMark: data.identificationMark,
				nationalIdNumber: data.aadhar,
				abcId: data.abcId,
				panNumber: data.panNumber,
				admissionDate: data.admissionDate
					? new Date(data.admissionDate)
					: undefined,

				academicProfile: {
					update: {
						currentClass: data.classApplyingFor,
						section: data.section,
						previousSchool: data.previousSchool,
						previousClass: data.previousClass,
						tcNumber: data.tcNumber,
						previousUdiseCode: data.previousUdiseCode,
						academicSession: data.academicSession,
						previousSchoolMedium: data.previousMediumOfInstruction,
						boardRegistrationNo: data.boardRegistrationNumber,
					},
				},
				family: {
					update: {
						parentsMaritalStatus: data.parentsMaritalStatus,
						legalCustodyHolder: data.legalCustodyHolder,
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
							update: {
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
				medicalProfile: {
					update: {
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
				feeRecord: {
					update: {
						feeCategory: data.feeCategory,
						scholarship: data.scholarship === "Yes",
						concessionDetails: data.concessionDetails,
						admissionFeePaid:
							parseFloat(data.admissionFeePaid) || 0,
						transportFeePaid:
							parseFloat(data.transportFeePaid) || 0,
						securityDepositPaid:
							parseFloat(data.securityDepositPaid) || 0,
						tuitionFeeCycle: data.tuitionFeeCycle,
						paymentMode: data.paymentMode,
						bankName: data.bankName,
						accountNumber: data.accountNumber,
						ifscCode: data.ifscCode,
						branchNameAndCode: data.branchNameAndCode,
					},
				},
				transportProfile: {
					upsert: {
						create: {
							schoolId: session.user.schoolId, // Required to create a new profile
							needTransport: data.needTransport === "Yes",
							pickupPoint: data.pickupPoint,
							route: data.route,
						},
						update: {
							needTransport: data.needTransport === "Yes",
							pickupPoint: data.pickupPoint,
							route: data.route,
						},
					},
				},
			},
		});

		return NextResponse.json(
			{ message: "All files synced and updated.", data: updatedStudent },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Comprehensive Student Update Error:", error);
		return NextResponse.json(
			{ error: "Failed to update full admission records." },
			{ status: 500 },
		);
	}
}
