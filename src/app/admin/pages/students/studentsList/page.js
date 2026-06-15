"use client";

import React, { useState } from 'react';

// Sample mock data representing students fetched from your database
const initialStudents = [
  { id: 'std_101', admissionNo: 'ADM2026001', name: 'Aarav Sharma', class: 'Grade 5', section: 'A', rollNo: '01', status: 'Active', feeStatus: 'Paid', contact: '+91 98765 43210' },
  { id: 'std_102', admissionNo: 'ADM2026002', name: 'Ananya Iyer', class: 'Grade 5', section: 'A', rollNo: '02', status: 'Active', feeStatus: 'Pending', contact: '+91 98765 43211' },
  { id: 'std_103', admissionNo: 'ADM2026003', name: 'Kabir Mehta', class: 'Grade 6', section: 'B', rollNo: '14', status: 'Inactive', feeStatus: 'Paid', contact: '+91 98765 43212' },
  { id: 'std_104', admissionNo: 'ADM2026004', name: 'Diya Patel', class: 'Grade 4', section: 'C', rollNo: '09', status: 'Active', feeStatus: 'Paid', contact: '+91 98765 43213' },
  { id: 'std_105', admissionNo: 'ADM2026005', name: 'Vivaan Joshi', class: 'Grade 5', section: 'B', rollNo: '05', status: 'Active', feeStatus: 'Overdue', contact: '+91 98765 43214' },
];

export default function StudentList() {
  const [students] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter Logic based on Search Input and Dropdowns
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || student.class === classFilter;
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
            <p className="text-sm text-slate-500">Manage, filter, and track student registration records.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            + Add New Student
          </button>
        </div>

        {/* Filter and Search Utility Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Search Records</label>
            <input 
              type="text" 
              placeholder="Search by name or admission no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Filter by Class</label>
            <select 
              value={classFilter} 
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="All">All Grades</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status Type</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-sm p-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Student Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Admission No</th>
                <th className="p-4">Student Profile</th>
                <th className="p-4">Class / Roll</th>
                <th className="p-4">Parent Contact</th>
                <th className="p-4 text-center">Fees</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Admission Number */}
                    <td className="p-4 font-mono text-xs font-semibold text-slate-600">{student.admissionNo}</td>
                    
                    {/* Student Avatar + Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm uppercase">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-400">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Class and Roll */}
                    <td className="p-4">
                      <p className="font-medium">{student.class} - {student.section}</p>
                      <p className="text-xs text-slate-400">Roll No: {student.rollNo}</p>
                    </td>

                    {/* Contact details */}
                    <td className="p-4 text-slate-600 font-mono text-xs">{student.contact}</td>

                    {/* Fee Badge Indicators */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                        student.feeStatus === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {student.feeStatus}
                      </span>
                    </td>

                    {/* Status Toggle Badges */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                        student.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Operational Action Buttons */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-900 border border-indigo-100 rounded-md px-2.5 py-1 hover:bg-indigo-50 transition-colors">
                          View
                        </button>
                        <button className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md px-2.5 py-1 hover:bg-slate-50 transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 text-sm">
                    No matching student profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footnote / Record Count Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-medium">
          <p>Showing {filteredStudents.length} of {students.length} total entries</p>
          <p>Database Synced</p>
        </div>

      </div>
    </div>
  );
}