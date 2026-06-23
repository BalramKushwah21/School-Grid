"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar"; // Naya component name
import Header from "@/components/GlobalHeader"; // Unified GlobalHeader Path
import { parentMenuData } from "./components/menuData";

export default function ParentLayout({ children }) {
	// Desktop mode mein by default open rahega Admin ki tarah
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		 <div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
          
          {/* Sidebar Component */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            menuData={parentMenuData} 
            
          />
          
          <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
            
            {/* 🚨 EXACT ADMIN PROPS: isSidebarOpen aur toggleSidebar pass kiya hai 🚨 */}
            <Header 
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
    
            <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      );
}
