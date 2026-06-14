import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req) {
	const school = await req.json();

	try{
	const getUser = await prisma.user.findUnique({
		where: {
		  email: school.email,
		},
	  });
	  
	  if (getUser) {
		return NextResponse.json(
		  {
			success: false,
			message: "User already exists with this email",
		  },
		  { status: 409 }
		);
	  }

	  const user = await prisma.user.create({
			data: {
				name: school.adminName,
				email: school.email,
				userRole: "admin",
				password: school.password,
			},
		});

		const schoolData = await prisma.schooldata.create({
			data: {
				adminName: school.adminName,
				schoolName: school.schoolName,
				subdomain: school.subdomain,
				schoolType: school.schoolType,
				phone: school.phone,
				email: school.email,
				city: school.city,
				district: school.district,
				state: school.state,
				address: school.address,
				pincode: school.pincode,
				subscriptionPlan: school.subscriptionPlan,
				udiseCode : school.udiseCode
			},
		});
		
		return NextResponse.json({
		  success: true,
		  message: "Registration Successful",
		  user,
		  schoolData,
		});
	  } catch (error) {
		console.error("Registration Error:", error);
	
		return NextResponse.json(
		  {
			success: false,
			message: error.message,
		  },
		  { status: 500 }
		);
	  	  
	}

}
