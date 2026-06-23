"use client";

import React, { useState } from 'react';

// Sample mock data expanded with class and section for filtering
const initialStudents = [
  { id: 'std_101', class: 'Grade 5', section: 'A', rollNo: '01', name: 'Aarav Sharma', status: 'Present', remarks: '' },
  { id: 'std_102', class: 'Grade 5', section: 'A', rollNo: '02', name: 'Ananya Iyer', status: 'Present', remarks: '' },
  { id: 'std_103', class: 'Grade 5', section: 'B', rollNo: '03', name: 'Kabir Mehta', status: 'Absent', remarks: 'Parent called in sick' },
  { id: 'std_104', class: 'Grade 6', section: 'A', rollNo: '04', name: 'Diya Patel', status: 'Present', remarks: '' },
  { id: 'std_105', class: 'Grade 5', section: 'A', rollNo: '05', name: 'Vivaan Joshi', status: 'Late', remarks: 'Bus delayed' },
  { id: 'std_106', class: 'Grade 6', section: 'B', rollNo: '12', name: 'Rohan Gupta', status: 'Absent', remarks: 'Medical leave' },
];

export default function AttendanceManager() {
  const [students, setStudents] = useState(initialStudents);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle fast status toggling (Editing Attendance)
  const handleStatusChange = (id, newStatus) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  };

  // Handle custom dynamic remarks
  const handleRemarkChange = (id, text) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, remarks: text } : student
      )
    );
  };

  // Save changes to backend
  const handleSaveAttendance = () => {
    const logPayload = {
      date: attendanceDate,
      class: selectedClass,
      section: selectedSection,
      records: students.map(({ id, status, remarks }) => ({ studentId: id, status, remarks }))
    };
    console.log("Saving records to Backend/Database Engine:", logPayload);
    alert(`Attendance for selected filters on ${attendanceDate} saved successfully!`);
  };

  // 1. FILTERING LOGIC
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNo.includes(searchTerm);
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  // 2. DYNAMIC CALCULATIONS BASED ON FILTERS
  const totalStrength = filteredStudents.length;
  const totalPresent = filteredStudents.filter(s => s.status === 'Present').length;
  const totalAbsent = filteredStudents.filter(s => s.status === 'Absent').length;
  const totalLate = filteredStudents.filter(s => s.status === 'Late').length;

  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Daily Attendance Registry</h2>
            <p className="text-sm text-slate-500">Filter, search, and edit student attendance logs.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <input 
              type="text" 
              placeholder="Search by Name or Roll No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            />
            {/* Date Filter */}
            <input 
              type="date" 
              value={attendanceDate} 
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* Class Filter */}
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Grades</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
            </select>
            {/* Section Filter */}
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sections</option>
              <option value="A">Sec A</option>
              <option value="B">Sec B</option>
            </select>
          </div>
        </div>

        {/* Dynamic Attendance Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Strength</span>
            <p className="text-2xl font-bold text-slate-800">{totalStrength}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Total Present</span>
            <p className="text-2xl font-bold text-emerald-800">{totalPresent}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-rose-700 uppercase">Total Absent</span>
            <p className="text-2xl font-bold text-rose-800">{totalAbsent}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-amber-700 uppercase">Total Late</span>
            <p className="text-2xl font-bold text-amber-800">{totalLate}</p>
          </div>
        </div>

        {/* Batch Roster Table (Searchable & Filterable) */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 w-20">Roll No</th>
                <th className="p-4">Student Profile</th>
                <th className="p-4 w-72 text-center">Edit Attendance Status</th>
                <th className="p-4">Administrative Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{student.rollNo}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.class} - {student.section}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center bg-slate-100 p-1 rounded-lg gap-1 max-w-[260px] mx-auto">
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${student.status === 'Present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
                        >
                          Present
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${student.status === 'Late' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
                        >
                          Late
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${student.status === 'Absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <input 
                        type="text"
                        placeholder="Add note..."
                        value={student.remarks}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-transparent focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400 text-sm">
                    No students match the current filters or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleSaveAttendance}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
          >
            Save & Update Records
          </button>
        </div>

      </div>
    </div>
  );
}