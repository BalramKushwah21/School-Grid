import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

export default function Header({ onMenuOpen }) {
  
  // मोबाइल और डेस्कटॉप दोनों के लिए एक सुरक्षित क्लिक/टच हैंडलर
  const handleMobileMenuClick = (e) => {
    e.preventDefault(); // डिफ़ॉल्ट ज़ूम या डिले को रोकता है
    onMenuOpen();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* मोबाइल मेनू बटन - अब पूरी तरह टच फ्रेंडली है */}
        <button 
          onClick={handleMobileMenuClick} 
          onTouchStart={handleMobileMenuClick} 
          className="lg:hidden text-gray-500 hover:text-indigo-600 focus:outline-none mr-2 relative z-40 cursor-pointer touch-manipulation transition-colors"
        >
          <Menu className="w-7 h-7" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block tracking-wide">
          Dashboard Overview
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Search - Upgraded to Premium Pill shape */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 lg:w-80 border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all duration-300 shadow-inner">
          <Search className="text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none ml-3 w-full text-sm text-gray-700 placeholder-gray-400" 
          />
        </div>

        {/* Notifications - Added pulse animation */}
        <button className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all focus:outline-none">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-white"></span>
          </span>
        </button>

        {/* User Profile - Enhanced hover and spacing */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100 shadow-sm" 
          />
          <div className="hidden xl:block text-left">
            <p className="text-sm font-bold text-gray-800 leading-tight">Alex Morgan</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Principal Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}