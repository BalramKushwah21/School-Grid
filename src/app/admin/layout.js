"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "@/components/GlobalHeader";

export default function AdminLayout({ children }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [schoolData, setSchoolData] = useState(null); // School data ke liye state
	const [isLoading, setIsLoading] = useState(true); // Loading state

	// API se data fetch karne ka logic
	useEffect(() => {
		const fetchSchoolInfo = async () => {
			try {
				const response = await fetch("/api/school/info");
				if (response.ok) {
					const data = await response.json();
					setSchoolData(data); // Data state me set karein
				}
			} catch (error) {
				console.error("Failed to fetch school data", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSchoolInfo();
	}, []); // Empty array [] ka matlab hai ye sirf page load hone par ek baar chalega

	return (
		<div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>

			<div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
				<Header
					isSidebarOpen={isSidebarOpen}
					toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
					// Yahan hum schoolData Header ko bhej rahe hain
					schoolData={schoolData}
					isLoading={isLoading}
				/>

				<main className="p-2 w-full">{children}</main>
			</div>
		</div>
	);
}
