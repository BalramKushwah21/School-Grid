"use client"
import React, { useState } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiUser } from 'react-icons/fi';

const StudentHeader = ({ studentData }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock data fallback if props are not yet passed from the database
  const student = studentData || {
    name: "Aarav Sharma",
    className: "Class 10 - A",
    avatar: "https://ui-avatars.com/api/?name=Aarav+Sharma&background=0D8ABC&color=fff"
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-40 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Side: Search Bar (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all duration-300 shadow-inner">
          <FiSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search subjects, homework, or notices..."
            className="bg-transparent border-none outline-none ml-3 w-full text-sm text-gray-700"
          />
        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center space-x-6 ml-auto sm:ml-0">
          
          {/* Academic Year Badge */}
          <div className="hidden md:block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            Academic Year 2026-2027
          </div>

          {/* Notification Bell */}
          <button className="relative text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">
            <FiBell className="text-2xl" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center font-bold">
                3
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
                src={student.avatar}
                alt="Student Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-800 leading-tight">{student.name}</p>
                <p className="text-xs text-gray-500">{student.className}</p>
              </div>
              <FiChevronDown className="text-gray-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-down">
                <a href="/students/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
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

export default StudentHeader;