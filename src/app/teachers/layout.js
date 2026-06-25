"use client";

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from "@/components/GlobalHeader"; // Universal Header
import { teacherMenuData } from './components/menuData'; 
import { useEffect } from 'react';


export default function TeacherLayout({ children }) {
  // Default 'true' rakha hai taaki PC par by default open rahe
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [schoolData, setSchoolData] = useState(null); // School data ke liye state
    const [isLoading, setIsLoading] = useState(true); 
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
    }, []);



  return (
		<div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
			{/* Sidebar Component */}
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				menuData={teacherMenuData}
			/>

			<div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
				{/* 🚨 EXACT ADMIN PROPS: isSidebarOpen aur toggleSidebar pass kiya hai 🚨 */}
				<Header
					isSidebarOpen={isSidebarOpen}
					toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
					schoolData={schoolData}
					isLoading={isLoading}
				/>

				<main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
					{children}
				</main>
			</div>
		</div>
  );
}