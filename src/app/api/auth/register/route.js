import { NextResponse } from "next/server"

export async function POST(req) {
    const { school } = await req.json();
    console.log(school)



    return NextResponse.json({
        success : true,
        message : "Registration Successfull"
    })
    
}