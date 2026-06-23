"use client";

import React, { useState, useMemo } from 'react';
import { Eye, Edit, MessageSquare, Bell } from 'lucide-react';

// Sample mock data expanded with historical attendance aggregates
const initialStudents = [
  { id: 'std_101', class: 'Grade 5', section: 'A', rollNo: '01', name: 'Aarav Sharma', status: 'Present', totalDays: 120, presentDays: 110 },
  { id: 'std_102', class: 'Grade 5', section: 'A', rollNo: '02', name: 'Ananya Iyer', status: 'Present', totalDays: 120, presentDays: 115 },
  { id: 'std_103', class: 'Grade 5', section: 'B', rollNo: '03', name: 'Kabir Mehta', status: 'Absent', totalDays: 120, presentDays: 85 },
  { id: 'std_104', class: 'Grade 6', section: 'A', rollNo: '04', name: 'Diya Patel', status: 'Present', totalDays: 120, presentDays: 105 },
  { id: 'std_105', class: 'Grade 5', section: 'A', rollNo: '05', name: 'Vivaan Joshi', status: 'Late', totalDays: 120, presentDays: 68 },
  { id: 'std_106', class: 'Grade 6', section: 'B', rollNo: '12', name: 'Rohan Gupta', status: 'Absent', totalDays: 120, presentDays: 55 },
  { id: 'std_107', class: 'Grade 5', section: 'A', rollNo: '06', name: 'Meera Singh', status: 'Present', totalDays: 120, presentDays: 118 },
  { id: 'std_108', class: 'Grade 5', section: 'B', rollNo: '08', name: 'Ishaan Verma', status: 'Present', totalDays: 120, presentDays: 92 },
];

export default function AttendanceAnalytics() {
  const [students] = useState(initialStudents);
  
  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New Sorting State (Default by Lowest Attendance Percentage)
  const [sortConfig, setSortConfig] = useState('percent-asc');

  // Administrative Action Handlers
  const handleAction = (action, studentName) => {
    alert(`${action} action triggered for ${studentName}`);
  };

  // 1. FILTERING, CALCULATING PERCENTAGE & SORTING LOGIC
  const processedStudents = useMemo(() => {
    // A. Filter
    let result = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.rollNo.includes(searchTerm);
      const matchesClass = selectedClass === 'All' || student.class === selectedClass;
      const matchesSection = selectedSection === 'All' || student.section === selectedSection;
      return matchesSearch && matchesClass && matchesSection;
    });

    // B. Calculate Aggregates
    result = result.map(student => {
      const absentDays = student.totalDays - student.presentDays;
      const percentage = Math.round((student.presentDays / student.totalDays) * 100);
      return { ...student, absentDays, percentage };
    });

    // C. Sort
    result.sort((a, b) => {
      if (sortConfig === 'percent-asc') return a.percentage - b.percentage;
      if (sortConfig === 'percent-desc') return b.percentage - a.percentage;
      if (sortConfig === 'rollNo-asc') return parseInt(a.rollNo) - parseInt(b.rollNo);
      if (sortConfig === 'rollNo-desc') return parseInt(b.rollNo) - parseInt(a.rollNo);
      if (sortConfig === 'name-asc') return a.name.localeCompare(b.name);
      if (sortConfig === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [students, searchTerm, selectedClass, selectedSection, sortConfig]);

  // 2. DYNAMIC CALCULATIONS FOR TOP CARDS (Based on Today's Status)
  const totalStrength = processedStudents.length;
  const totalPresent = processedStudents.filter(s => s.status === 'Present').length;
  const totalAbsent = processedStudents.filter(s => s.status === 'Absent').length;
  const totalLate = processedStudents.filter(s => s.status === 'Late').length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Comprehensive Attendance Report</h2>
            <p className="text-sm text-slate-500 font-medium">Analyze aggregated attendance data and take administrative actions.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <input 
              type="text" 
              placeholder="Search Name or Roll No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto shadow-sm"
            />
            <input 
              type="date" 
              value={attendanceDate} 
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700"
            />
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700"
            >
              <option value="All">All Grades</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
            </select>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-xl border-slate-200 text-sm p-2.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium text-slate-700"
            >
              <option value="All">All Sections</option>
              <option value="A">Sec A</option>
              <option value="B">Sec B</option>
            </select>
            
            {/* NEW: Sort By Dropdown (Focus on Percentage) */}
            <select 
              value={sortConfig} 
              onChange={(e) => setSortConfig(e.target.value)}
              className="rounded-xl border-indigo-200 text-sm p-2.5 border bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-bold text-indigo-700"
            >
              <option value="percent-asc">Sort: Attendance % (Low to High)</option>
              <option value="percent-desc">Sort: Attendance % (High to Low)</option>
              <option value="rollNo-asc">Sort: Roll No (Asc ↑)</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Attendance Summary Cards (Today's Status) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Strength</span>
            <p className="text-3xl font-extrabold text-slate-800 mt-1">{totalStrength}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Today's Present</span>
            <p className="text-3xl font-extrabold text-emerald-800 mt-1">{totalPresent}</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl text-center shadow-sm">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Today's Absent</span>
            <p className="text-3xl font-extrabold text-rose-800 mt-1">{totalAbsent}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center shadow-sm">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Today's Late</span>
            <p className="text-3xl font-extrabold text-amber-800 mt-1">{totalLate}</p>
          </div>
        </div>

        {/* Aggregate Roster Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6 w-24">Roll No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4 text-center">Total School Days</th>
                <th className="p-4 text-center text-emerald-700">Present Days</th>
                <th className="p-4 text-center text-rose-700">Absent Days</th>
                <th className="p-4 text-center">Attendance %</th>
                <th className="p-4 text-right pr-6">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {processedStudents.length > 0 ? (
                processedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Roll No */}
                    <td className="p-4 pl-6 font-mono font-bold text-slate-500">{student.rollNo}</td>
                    
                    {/* Student Avatar & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                           {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs font-medium text-slate-400">{student.class} - Sec {student.section}</p>
                        </div>
                      </div>
                    </td>

                    {/* School Days */}
                    <td className="p-4 text-center font-semibold text-slate-600">
                      {student.totalDays}
                    </td>

                    {/* Present Days */}
                    <td className="p-4 text-center font-bold text-emerald-600">
                      {student.presentDays}
                    </td>

                    {/* Absent Days */}
                    <td className="p-4 text-center font-bold text-rose-600">
                      {student.absentDays}
                    </td>

                    {/* Percentage */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${
                        student.percentage >= 75 ? 'bg-emerald-100 text-emerald-800' :
                        student.percentage >= 60 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {student.percentage}%
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleAction('View Profile', student.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg font-semibold text-xs transition-colors"
                          title="View Profile"
                        >
                          <Eye size={14} /> Profile
                        </button>
                        <button 
                          onClick={() => handleAction('Edit Attendance', student.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg font-semibold text-xs transition-colors"
                          title="Edit Attendance"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleAction('Send Warning', student.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-800 rounded-lg font-semibold text-xs transition-colors"
                          title="Send Warning"
                        >
                          <MessageSquare size={14} /> Warning
                        </button>
                        <button 
                          onClick={() => handleAction('Notify Parent', student.name)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg font-semibold text-xs transition-colors"
                          title="Notify Parent"
                        >
                          <Bell size={14} /> Notify
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-500 text-sm font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <span className="text-4xl mb-2">📭</span>
                       No students match the current filters or search query.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}