"use client";

import React from "react";
import Sidebar from "../admin/components/Sidebar";
import Header from "../admin/components/header";
import { useState } from "react";

export default function userLayout({ child }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const user = "admin";
	const isLogin = true;

	if (isLogin && user === "admin") {
		return (
			<div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800 ">
				<Sidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>

				<div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
					<Header onMenuOpen={() => setIsSidebarOpen(true)} />

					<main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
						{child}
					</main>
				</div>
			</div>
		);
	} else {
		return <div>visitor page</div>;
	}
}
