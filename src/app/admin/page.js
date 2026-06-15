"use client";

import React, { useState } from 'react';
import { Users, UserCheck, CalendarCheck, DollarSign, PlusCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/header';
import MetricCard from './components/MetricCard';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const metricsData = [
    { title: "Total Students", value: "1,245", trend: "+3.2% from last term", trendType: "up", icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { title: "Total Teachers", value: "84", trend: "Stable allocation", trendType: "neutral", icon: UserCheck, color: "bg-emerald-50 text-emerald-600" },
    { title: "Attendance Rate", value: "94.8%", trend: "-0.4% today", trendType: "down", icon: CalendarCheck, color: "bg-amber-50 text-amber-600" },
    { title: "Fees Collected", value: "$42.3k", trend: "82% of target met", trendType: "up", icon: DollarSign, color: "bg-rose-50 text-rose-600" },
  ];

  const recentAdmissions = [
    { name: "Jane Doe", initial: "JD", id: "#STU-2026-089", grade: "Grade 10-A", status: "Active", statusColor: "bg-emerald-50 text-emerald-700" },
    { name: "John Smith", initial: "JS", id: "#STU-2026-090", grade: "Grade 12-B", status: "Active", statusColor: "bg-emerald-50 text-emerald-700" },
    { name: "Michael Wright", initial: "MW", id: "#STU-2026-091", grade: "Grade 9-C", status: "Pending Docs", statusColor: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto">
        
        <Header onMenuOpen={() => setIsSidebarOpen(true)} />

        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Welcome Back, Principal Alex!</h2>
              <p className="text-indigo-100 mt-1 text-sm md:text-base">Here is what's happening at Oakridge High School today.</p>
            </div>
            <button className="bg-white text-indigo-700 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:bg-indigo-50 transition-colors self-start md:self-auto flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Generate Report
            </button>
          </div>

          {/* Metrics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {metricsData.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </section>

          {/* Dynamic Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Recent Student Admissions</h3>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="p-4">Student</th>
                      <th className="p-4">ID</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {recentAdmissions.map((student, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {student.initial}
                          </div>
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </td>
                        <td className="p-4 text-gray-500">{student.id}</td>
                        <td className="p-4 text-gray-600">{student.grade}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${student.statusColor}`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notice Board */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-800 mb-4">Notice Board</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">PTA Meeting Tomorrow</p>
                      <p className="text-xs text-gray-400">Scheduled at 4:00 PM in the Main Auditorium.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Mid-Term Exams Prep</p>
                      <p className="text-xs text-gray-400">Syllabus updates need approval by end of week.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Server Maintenance</p>
                      <p className="text-xs text-gray-400">The Student Portal will be offline this Sunday 2AM-5AM.</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium bg-gray-50 hover:bg-gray-100 transition-colors">
                Add New Notice
              </button>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}