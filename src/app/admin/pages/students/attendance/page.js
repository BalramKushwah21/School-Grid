"use client";

import React, { useState } from 'react';

// Sample mock data simulating students fetched from your database based on Class/Section
const initialStudents = [
  { id: 'std_101', rollNo: '01', name: 'Aarav Sharma', status: 'Present', remarks: '' },
  { id: 'std_102', rollNo: '02', name: 'Ananya Iyer', status: 'Present', remarks: '' },
  { id: 'std_103', rollNo: '03', name: 'Kabir Mehta', status: 'Absent', remarks: 'Parent called in sick' },
  { id: 'std_104', rollNo: '04', name: 'Diya Patel', status: 'Present', remarks: '' },
  { id: 'std_105', rollNo: '05', name: 'Vivaan Joshi', status: 'Late', remarks: 'Bus delayed' },
];

export default function AttendanceManager() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedClass, setSelectedClass] = useState('Grade 5');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle fast status toggling
  const handleStatusChange = (id, newStatus) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  };

  // Handle custom dynamic remarks (e.g. why they are late)
  const handleRemarkChange = (id, text) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, remarks: text } : student
      )
    );
  };

  const handleSaveAttendance = () => {
    const logPayload = {
      date: attendanceDate,
      class: selectedClass,
      section: selectedSection,
      records: students.map(({ id, status, remarks }) => ({ studentId: id, status, remarks }))
    };
    
    console.log("Saving records to Backend/Database Engine:", logPayload);
    alert(`Attendance for ${selectedClass}-${selectedSection} saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Daily Attendance Registry</h2>
            <p className="text-sm text-slate-500">Select parameters to record or view student logs.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <input 
              type="date" 
              value={attendanceDate} 
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border focus:ring-2 focus:ring-indigo-500"
            />
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border"
            >
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
            </select>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-lg border-slate-200 text-sm p-2 border"
            >
              <option value="A">Sec A</option>
              <option value="B">Sec B</option>
            </select>
          </div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Present</span>
            <p className="text-2xl font-bold text-emerald-800">{students.filter(s => s.status === 'Present').length}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-rose-700 uppercase">Absent</span>
            <p className="text-2xl font-bold text-rose-800">{students.filter(s => s.status === 'Absent').length}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-center">
            <span className="text-xs font-semibold text-amber-700 uppercase">Late</span>
            <p className="text-2xl font-bold text-amber-800">{students.filter(s => s.status === 'Late').length}</p>
          </div>
        </div>

        {/* Batch Roster Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 w-20">Roll No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4 w-72 text-center">Status Toggle</th>
                <th className="p-4">Administrative Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-slate-400">{student.rollNo}</td>
                  <td className="p-4 font-medium text-slate-800">{student.name}</td>
                  <td className="p-4">
                    <div className="flex justify-center bg-slate-100 p-1 rounded-lg gap-1 max-w-[260px] mx-auto">
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${student.status === 'Present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Present
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Late')}
                        className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${student.status === 'Late' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Late
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-all ${student.status === 'Absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
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
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-transparent focus:bg-white focus:border-indigo-500 transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleSaveAttendance}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
          >
            Save & Post Attendance Record
          </button>
        </div>

      </div>
    </div>
  );
}