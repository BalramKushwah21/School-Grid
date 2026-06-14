import { NextResponse } from "next/server"
import { Prisma } from "@lib/prisma"
export async function POST(req) {
    const  school  = await req.json();
    const user = await Prisma.user.create({
        data :{
            firstName:school.adminName,
            username : school.email,
            userRole: "admin",
            password : school.password
        }
    })
    // const schoolData =  await Prisma.schooldata({
    //     adminName : school.adminName,
    //     schoolName : school.schoolName,
    //     subdomain : school.subdomain,
    //     schoolType : school.schoolType,
    //     phone : school.phone,
    //     email : school.email,
    //     city : school.city,
    //     district : school.district,
    //     state : school.state,
    //     address : school.address,
    //     pincode : school.pincode,
    //     subscriptionPlan : school.subscriptionPlan

    // })
    
    // console.log(school)

    return NextResponse.json({
        success : true,
        message : "Registration Successfull"
    })
    
}