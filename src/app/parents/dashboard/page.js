'use client'
import React, { useState } from 'react';
import { 
  FiClock, 
  FiCalendar, 
  FiDollarSign, 
  FiBell, 
  FiBookOpen, 
  FiAward,
  FiChevronDown
} from 'react-icons/fi';

const ParentDashboard = () => {
  // Mock Data: In production, fetch this from GET /api/parents/dashboard based on parent_id
  const [parentInfo] = useState({
    name: "Rajesh Kumar",
    relation: "Father",
    familyBalance: "₹ 15,500"
  });

  const [children] = useState([
    {
      id: "STU-8021",
      name: "Aarav Kumar",
      class: "Class 10 - A",
      avatar: "https://ui-avatars.com/api/?name=Aarav+Kumar&background=4F46E5&color=fff",
      attendance: 88,
      nextExam: "Mid-Terms (Oct 15)",
      pendingFees: "₹ 5,500",
      homework: 2
    },
    {
      id: "STU-9045",
      name: "Diya Kumar",
      class: "Class 6 - B",
      avatar: "https://ui-avatars.com/api/?name=Diya+Kumar&background=4338CA&color=fff",
      attendance: 95,
      nextExam: "Science Unit Test (Oct 10)",
      pendingFees: "₹ 10,000",
      homework: 0
    }
  ]);

  // State to manage which child's data is currently being viewed
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const activeChild = children[activeChildIndex];

  const [announcements] = useState([
    { id: 1, title: "Parent-Teacher Meeting Scheduled", date: "Oct 20", type: "Event" },
    { id: 2, title: "Winter Uniform Guidelines", date: "Oct 12", type: "Notice" },
  ]);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner & Smart Sibling Switcher */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {parentInfo.name} 👋</h1>
          <p className="text-indigo-100 text-sm md:text-base">
            Total Family Dues: <span className="font-bold text-white tracking-wide">{parentInfo.familyBalance}</span>
          </p>
        </div>
        
        {/* Sibling Switcher Dropdown */}
        <div className="mt-6 md:mt-0 w-full md:w-auto">
          <p className="text-xs text-indigo-200 mb-1 font-medium uppercase tracking-wider">Viewing Profile For</p>
          <div className="relative">
            <select 
              className="appearance-none w-full md:w-64 bg-white/10 border border-indigo-300/30 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm cursor-pointer font-medium"
              value={activeChildIndex}
              onChange={(e) => setActiveChildIndex(Number(e.target.value))}
            >
              {children.map((child, index) => (
                <option key={child.id} value={index} className="text-gray-800">
                  {child.name} ({child.class})
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Active Child Profile Overview */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <img src={activeChild.avatar} alt={activeChild.name} className="w-16 h-16 rounded-full border-2 border-indigo-100" />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{activeChild.name}</h2>
          <p className="text-sm text-gray-500 font-medium">{activeChild.class} • Roll No: {activeChild.id}</p>
        </div>
      </div>

      {/* Top Stats Grid for Active Child */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Attendance</p>
            <h3 className="text-3xl font-bold text-gray-800">{activeChild.attendance}%</h3>
            <p className={`text-xs mt-2 font-medium inline-block px-2 py-1 rounded-md ${activeChild.attendance > 90 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
              {activeChild.attendance > 90 ? 'Excellent' : 'Needs Attention'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600">
             <FiCalendar className="text-2xl" />
          </div>
        </div>

        {/* Pending Fees Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending Fees</p>
            <h3 className="text-3xl font-bold text-gray-800">{activeChild.pendingFees}</h3>
            <button className="text-xs text-indigo-600 mt-2 font-bold hover:underline">Pay Now &rarr;</button>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-50 text-red-500">
             <FiDollarSign className="text-2xl" />
          </div>
        </div>

        {/* Academic Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending Homework</p>
            <h3 className="text-3xl font-bold text-gray-800">{activeChild.homework} Tasks</h3>
            <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded-md">Due Tomorrow</p>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-50 text-blue-500">
             <FiBookOpen className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Next Examination Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FiAward className="mr-2 text-indigo-600" /> Upcoming Examinations
            </h2>
          </div>
          <div className="p-6 flex flex-col justify-center items-center text-center h-48 bg-gradient-to-b from-transparent to-gray-50">
            <p className="text-sm text-gray-500 mb-2">Next scheduled exam for {activeChild.name}</p>
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">{activeChild.nextExam}</h3>
            <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              View Full Schedule
            </button>
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FiBell className="mr-2 text-purple-500" /> School Notices
            </h2>
          </div>
          <div className="p-4 space-y-4 h-48 overflow-y-auto custom-scrollbar">
            {announcements.map(notice => (
              <div key={notice.id} className="flex space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <FiBell />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{notice.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{notice.date} • {notice.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
            <button className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              View All Communications
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentDashboard;