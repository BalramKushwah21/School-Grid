'use client'

import React from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/header'
import { useState } from "react";   

export default function adminLayout({children}) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
			return (
			<div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800 ">
				<Sidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>

				<div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
					<Header onMenuOpen={() => setIsSidebarOpen(true)} />

					<main className="p-2 w-full">
						{children}
					</main>
				</div>
			</div>
  );
}
