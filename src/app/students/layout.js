"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar"; // Custom Student Sidebar
import Header from "@/components/GlobalHeader"; // Unified Global Header
import { studentMenuData } from "./components/menuData";

export default function StudentLayout({ children }) {
	// Desktop mode mein by default open rahega Admin ki tarah
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
			{/* SIDEBAR: Z-40 par set hoga Sidebar component ke andar */}
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				menuData={studentMenuData} // Using generic menu mapping
			/>

			<div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
				{/* HEADER CONTAINER: z-50 taaki ye sidebar ke UPAR rahe */}
				<div className="relative z-50 shadow-sm">
					<Header
						isSidebarOpen={isSidebarOpen}
						toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
					/>
				</div>

				{/* MAIN CONTENT AREA */}
				<main className="p-4 sm:p-6 space-y-6 max-w-[1600px] w-full mx-auto relative z-0">
					{children}
				</main>
			</div>
		</div>
	);
}
