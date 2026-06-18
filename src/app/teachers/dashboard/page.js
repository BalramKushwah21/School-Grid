"use client"
import React, { useState } from 'react';
import { 
  FiClock, 
  FiUsers, 
  FiBookOpen, 
  FiCheckSquare, 
  FiBell, 
  FiChevronRight,
  FiAward
} from 'react-icons/fi';

const TeacherDashboard = () => {
  // Mock Data: In production, this will be fetched from your API based on the logged-in teacher's ID
  const [teacherInfo] = useState({
    name: "Vikram Singh",
    department: "Department of Science",
    employeeId: "TCH-2041",
    attendanceToday: "Marked"
  });

  const [todayClasses] = useState([
    { id: 1, class: "Class 10 - A", subject: "Physics", time: "08:30 AM - 09:15 AM", room: "Lab 3", status: "completed", attendance: "38/40" },
    { id: 2, class: "Class 12 - B", subject: "Advanced Physics", time: "09:15 AM - 10:00 AM", room: "Room 201", status: "ongoing", attendance: "Pending" },
    { id: 3, class: "Class 9 - C", subject: "General Science", time: "11:00 AM - 11:45 AM", room: "Room 105", status: "upcoming", attendance: "-" },
    { id: 4, class: "Class 10 - B", subject: "Physics", time: "01:00 PM - 01:45 PM", room: "Lab 3", status: "upcoming", attendance: "-" },
  ]);

  const [pendingActionItems] = useState([
    { id: 1, type: "Evaluation", title: "Class 12 - Physics Mid-Terms", due: "Today, 5:00 PM", priority: "High" },
    { id: 2, type: "Attendance", title: "Mark Class 12-B Attendance", due: "10:15 AM", priority: "High" },
    { id: 3, type: "Lesson Plan", title: "Submit Next Week's Syllabus", due: "Friday", priority: "Medium" },
  ]);

  const [announcements] = useState([
    { id: 1, title: "Staff Meeting at 3:00 PM", date: "Today", type: "Urgent" },
    { id: 2, title: "Quarterly Grades Deadline", date: "Oct 15", type: "Academic" },
  ]);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Good Morning, {teacherInfo.name}! 🌅</h1>
          <p className="text-teal-100 flex items-center space-x-4 text-sm md:text-base">
            <span>{teacherInfo.department}</span>
            <span>•</span>
            <span>ID: {teacherInfo.employeeId}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
          <p className="text-sm text-teal-100 mb-1">My Attendance</p>
          <p className="font-semibold text-lg tracking-wide flex items-center">
            <FiCheckSquare className="mr-2 text-green-300" /> {teacherInfo.attendanceToday}
          </p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Classes Today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Classes Today</p>
            <h3 className="text-3xl font-bold text-gray-800">{todayClasses.length}</h3>
            <p className="text-xs text-teal-600 mt-2 font-medium bg-teal-50 inline-block px-2 py-1 rounded-md">2 Remaining</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-teal-500 flex items-center justify-center bg-teal-50 text-teal-600">
             <FiUsers className="text-2xl" />
          </div>
        </div>

        {/* Pending Evaluations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending Evaluations</p>
            <h3 className="text-3xl font-bold text-gray-800">42</h3>
            <p className="text-xs text-orange-600 mt-2 font-medium bg-orange-50 inline-block px-2 py-1 rounded-md">Requires Action</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center bg-orange-50 text-orange-500">
             <FiBookOpen className="text-2xl" />
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Available Leaves</p>
            <h3 className="text-3xl font-bold text-gray-800">08</h3>
            <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded-md">Casual & Sick</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-400 flex items-center justify-center bg-blue-50 text-blue-500">
             <FiAward className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timetable (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiClock className="mr-2 text-teal-600" /> Today's Teaching Schedule
              </h2>
              <button className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center">
                View Full Week <FiChevronRight className="ml-1" />
              </button>
            </div>
            <div className="p-0">
              {todayClasses.map((cls) => (
                <div key={cls.id} className={`p-4 border-b border-gray-50 flex items-center justify-between transition-colors hover:bg-gray-50 ${cls.status === 'ongoing' ? 'bg-teal-50/30 border-l-4 border-l-teal-500' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-right w-32 hidden sm:block">
                      <p className="text-sm font-semibold text-gray-800">{cls.time.split('-')[0].trim()}</p>
                      <p className="text-xs text-gray-500">{cls.time.split('-')[1].trim()}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{cls.class}</h4>
                      <p className="text-sm text-gray-500 font-medium">{cls.subject} • <span className="text-teal-600">{cls.room}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {cls.status === 'completed' && <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Completed</span>}
                    {cls.status === 'ongoing' && <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-bold animate-pulse">Ongoing</span>}
                    {cls.status === 'upcoming' && <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">Upcoming</span>}
                    
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      Attendance: {cls.attendance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action Items & Notices */}
        <div className="space-y-6">
          
          {/* Action Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiCheckSquare className="mr-2 text-orange-500" /> Action Items
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {pendingActionItems.map(item => (
                <div key={item.id} className="p-3 border border-gray-100 rounded-xl hover:border-teal-300 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      {item.type}
                    </span>
                    <span className="text-xs font-medium text-gray-500">{item.due}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-teal-600 transition-colors">{item.title}</h4>
                </div>
              ))}
              <button className="w-full mt-2 py-2 text-sm text-center text-gray-500 hover:text-teal-600 font-medium transition-colors">
                View All Tasks
              </button>
            </div>
          </div>

          {/* Staff Notice Board */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiBell className="mr-2 text-purple-500" /> Staff Notices
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {announcements.map(notice => (
                <div key={notice.id} className="flex space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${notice.type === 'Urgent' ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`}></div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{notice.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{notice.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;