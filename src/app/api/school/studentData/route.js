import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'


export async function POST(request) {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

    //getting data from frontend
    const formData = await request.json()
    console.log(formData.firstName);
    console.log(session.user.name);
   
    
    try {

        // Fetch the user's associated schoolId using their email
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
        });

        if (!dbUser || !dbUser.schoolId) {
          return NextResponse.json({ success: false, error: "No school associated with this user." }, { status: 400 });
        }

        const schoolId = dbUser.schoolId;


        const admissionDate = formData.admissionDate ? new Date(formData.admissionDate) : new Date();
        // 1. Data Type Conversions
        // Prisma requires Date objects for DateTime fields and Numbers for Decimals/Ints
        const dateOfBirth = formData.dob ? new Date(formData.dob) : new Date();
        const admissionFee = parseFloat(formData.admissionFeePaid) || 0;
        const securityDeposit = parseFloat(formData.securityDepositPaid) || 0;
    
        // 2. The Atomic Prisma Create Transaction
        const newStudent = await prisma.student.create({
          data: {
            // --- A. CONNECT TO EXISTING TENANT ---
            school: {
              connect: { id: session.user.schoolId }
            },
    
            // --- B. CORE STUDENT DATA ---
            firstName: formData.firstName,
            lastName: formData.lastName,
            admissionDate: admissionDate,
            gender: formData.gender?.toUpperCase(), // Enum: MALE, FEMALE, OTHER
            dateOfBirth: dateOfBirth,
            bloodGroup: formData.bloodGroup,
            category: formData.category?.toUpperCase(), // Enum: GENERAL, OBC, SC, ST
            nationality: formData.nationality,
            isStaffChild: formData.isStaffChild === 'Yes',
            identificationMark: formData.identificationMark,
            // (Assuming you map idCardNumber to aadharNumber or similar in your logic)
            aadharNumber: formData.idCardNumber || null, 
    
            // --- C. NESTED CREATE: FAMILY & ADDRESS ---
            family: {
              create: {
              school: { connect: { id: schoolId } }, // Family must also belong to the school
                parentsMaritalStatus: formData.parentsMaritalStatus?.toUpperCase(),
                legalCustodyHolder: formData.legalCustodyHolder?.toUpperCase(),
                fatherName: formData.fatherName,
                fatherContactNo: formData.fatherMobile,
                fatherOccupation: formData.fatherOccupation,
                fatherIncome: formData.fatherIncome,
                fatherEmail: formData.fatherEmail,
                motherName: formData.motherName,
                motherContactNo: formData.motherMobile,
                motherOccupation: formData.motherOccupation,
                motherEmail: formData.motherEmail,
                // Nested Create inside Family for Address
                address: {
                  create: {
                    locality: formData.street,
                    city: formData.city,
                    district: formData.district,
                    state: formData.state,
                    pincode: formData.pincode,
                  }
                }
              }
            },
    
            // --- D. NESTED CREATE: 1-TO-1 PROFILES ---
            academicProfile: {
              create: {
                currentClass: formData.classApplyingFor,
                section: formData.section,
                academicSession: formData.academicSession,
                previousSchool: formData.previousSchool,
                previousSchoolMedium: formData.previousMediumOfInstruction,
                tcNumber: formData.tcNumber,
                boardRegistrationNo: formData.boardRegistrationNumber,
              }
            },
    
            medicalProfile: {
              create: {
                emergencyContactName: formData.emergencyContact,
                emergencyContactNumber: formData.emergencyMobile,
                relationWithStudent: formData.emergencyRelation,
                familyDoctorName: formData.familyDoctorName,
                familyDoctorContactNumber: formData.familyDoctorMobile,
                preferredHospital: formData.preferredHospital,
                medicalConditionsAllergies: formData.medicalConditions,
              }
            },
    
            feeRecord: {
              create: {
                feeCategory: formData.feeCategory?.replace(' ', '_')?.toUpperCase(), // e.g., 'STAFF_DISCOUNT'
                scholarship: formData.scholarship === 'Yes',
                concessionDetails: formData.concessionDetails,
                admissionFeePaid: admissionFee,
                securityDepositPaid: securityDeposit,
                tuitionFeeCycle: formData.tuitionFeeCycle?.toUpperCase(),
                paymentMode: formData.paymentMode?.replace(' ', '_')?.toUpperCase(),
              }
            },
    
            transportProfile: {
              create: {
                needTransport: formData.needTransport === 'Yes',
                pickupPoint: formData.pickupPoint,
                route: formData.route,
              }
            },
    
            // NOTE: For documents, you would upload the actual files to an S3 bucket or 
            // Cloudinary first, get the URLs back, and save those URLs here.
            documents: {
              create: {
                studentPhotoUrl: "https://your-storage.com/path-to-photo.jpg", 
                birthCertificateUrl: "https://your-storage.com/path-to-cert.pdf",
                // ... map other URLs here
              }
            }
          },
          
          // Optional: Tell Prisma what data to return after creation
          include: {
            family: true,
            academicProfile: true,
          }
        });
    
        console.log("Successfully registered student:", newStudent.id);
        return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
    
      } catch (error) {
        console.error("Failed to register student:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }


    }
