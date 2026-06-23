"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar"; // Path check kar lein
import Header from "@/components/GlobalHeader";

export default function AdminLayout({ children }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>

			<div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
				{/* UPDATE YAHAN HAI: State aur Toggle function dono pass kiye hain */}
				<Header
					isSidebarOpen={isSidebarOpen}
					toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				/>

				<main className="p-2 w-full">{children}</main>
			</div>
		</div>
	);
}
