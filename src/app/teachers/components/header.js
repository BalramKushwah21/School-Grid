'use client'
import React, { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiUser, FiMenu } from 'react-icons/fi';

const TeacherHeader = ({ onMenuOpen, teacherData }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data fallback if props are not yet passed from the database
  const teacher = teacherData || {
    name: "Vikram Singh",
    department: "Science Department",
    avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=0D9488&color=fff"
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-30 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Side: Mobile Menu Trigger & Search */}
        <div className="flex items-center">
          {/* Hamburger icon for mobile screens to trigger sidebar */}
          <button 
            onClick={onMenuOpen}
            className="md:hidden mr-4 text-gray-500 hover:text-teal-600 focus:outline-none text-2xl transition-colors"
          >
            <FiMenu />
          </button>

          {/* Global Search Bar (Hidden on very small screens) */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 md:w-80 border border-transparent focus-within:border-teal-500 focus-within:bg-white transition-all duration-300 shadow-inner">
            <FiSearch className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Search students, classes, or notices..."
              className="bg-transparent border-none outline-none ml-3 w-full text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center space-x-4 md:space-x-6 ml-auto">
          
          {/* Academic Term Badge */}
          <div className="hidden md:block bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 shadow-sm">
            Term 1: 2026-2027
          </div>

          {/* Notification Bell */}
          <button className="relative text-gray-500 hover:text-teal-600 transition-colors focus:outline-none">
            <FiBell className="text-2xl" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center font-bold">
                5
              </span>
            </span>
          </button>

          {/* User Profile Dropdown Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 focus:outline-none hover:bg-gray-50 p-1 rounded-lg transition-colors"
            >
              <img
                src={teacher.avatar}
                alt="Teacher Avatar"
                className="w-10 h-10 rounded-full border-2 border-teal-500 object-cover shadow-sm"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight">{teacher.name}</p>
                <p className="text-xs text-gray-500">{teacher.department}</p>
              </div>
              <FiChevronDown className="text-gray-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-down">
                <a href="/teachers/account/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">
                  <FiUser className="mr-3" /> My Profile
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                  Logout
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;