"use client";

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/header';
// Make sure this path correctly points to where you saved the array
import { studentMenuData } from './components/menuData'; 

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
      
      {/* Sidebar now receives the open/close state from the layout 
        AND the required menuData to build the links 
      */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        menuData={studentMenuData} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
        <Header onMenuOpen={() => setIsSidebarOpen(true)} />

        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}