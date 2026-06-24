"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
			<div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
				{/* Warning Icon */}
				<div className="flex justify-center mb-6">
					<div className="bg-red-100 p-4 rounded-full">
						<ShieldAlert className="w-12 h-12 text-red-600" />
					</div>
				</div>

				{/* Heading and Message */}
				<h1 className="text-3xl font-extrabold text-gray-900 mb-2">
					Access Denied
				</h1>
				<p className="text-gray-600 mb-8">
					Aapke paas is page ko view karne ki permission nahi hai.
					Agar aapko lagta hai ki yeh ek galti hai, toh apne School
					Admin se sampark karein.
				</p>

				{/* Action Button */}
				<Link
					href="/auth/login"
					className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
				>
					Go To Login
				</Link>
			</div>
		</div>
	);
}
