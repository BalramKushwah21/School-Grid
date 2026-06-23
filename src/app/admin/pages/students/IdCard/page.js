"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Sample Mock Data (Database se fetch hone wala data)
const mockStudents = [
  { id: 'STU-2026-001', rollNo: '101', studentName: 'Aarav Sharma', fatherName: 'Rajesh Sharma', session: '2026-27', className: 'Grade 10', section: 'A', dob: '14-Oct-2010', phone: '+91 9876543210', schoolName: 'Patliputra Central School', udiseCode: '1029384756', photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop' },
  { id: 'STU-2026-002', rollNo: '102', studentName: 'Ananya Iyer', fatherName: 'Venkat Iyer', session: '2026-27', className: 'Grade 10', section: 'A', dob: '05-May-2010', phone: '+91 9876543211', schoolName: 'Patliputra Central School', udiseCode: '1029384756', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 'STU-2026-003', rollNo: '103', studentName: 'Kabir Mehta', fatherName: 'Sanjay Mehta', session: '2026-27', className: 'Grade 9', section: 'B', dob: '22-Aug-2011', phone: '+91 9876543212', schoolName: 'Patliputra Central School', udiseCode: '1029384756', photoUrl: null },
  { id: 'STU-2026-004', rollNo: '104', studentName: 'Diya Patel', fatherName: 'Ramesh Patel', session: '2026-27', className: 'Grade 10', section: 'A', dob: '11-Jan-2010', phone: '+91 9876543213', schoolName: 'Patliputra Central School', udiseCode: '1029384756', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
];

export default function BulkIDCardGenerator() {
  const [filters, setFilters] = useState({ class: '', section: '', rollNo: '' });
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load: Fetch all students
  useEffect(() => {
    // API Call simulation (Replace with your actual backend fetch)
    const fetchAllStudents = async () => {
      try {
        // const res = await fetch(`/api/admin/students/id-card`);
        // const result = await res.json();
        // setAllStudents(result.data);
        
        setTimeout(() => {
          setAllStudents(mockStudents);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAllStudents();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 2. Real-Time Filtering Logic
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const matchClass = !filters.class || (student.className && student.className.toLowerCase().includes(filters.class.toLowerCase()));
      const matchSection = !filters.section || (student.section && student.section.toLowerCase().includes(filters.section.toLowerCase()));
      const matchRollNo = !filters.rollNo || (student.rollNo && student.rollNo.toString().includes(filters.rollNo));
      return matchClass && matchSection && matchRollNo;
    });
  }, [allStudents, filters]);

  const handlePrint = () => {
    window.print();
  };

  // 3. BLANK TEMPLATE (Jab data na ho)
  const blankStudent = {
    id: 'XXXX-XXXX-XXXX',
    rollNo: '____',
    studentName: '________________',
    fatherName: '________________',
    session: '20__ - 20__',
    className: '_______',
    section: '___',
    dob: '__ / __ / ____',
    phone: '________________',
    schoolName: 'Patliputra Central School',
    udiseCode: '65399',
    photoUrl: null
  };

  const displayData = filteredStudents.length > 0 ? filteredStudents : [blankStudent];

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-8">
      
      {/* =========================================
          ADMIN CONTROLS (Hidden during Print)
      ========================================= */}
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Bulk ID Card Generator</h2>
            <p className="text-sm text-slate-500">Live filter students to generate smart QR ID cards, or print a blank template.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            🖨️ Print {filteredStudents.length > 0 ? `${filteredStudents.length} ID Cards` : 'Blank Format'}
          </button>
        </div>

        {/* Real-time Filter Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Filter by Class</label>
            <input 
              type="text" 
              name="class" 
              value={filters.class} 
              onChange={handleInputChange} 
              placeholder="e.g. Grade 10" 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Filter by Section</label>
            <input 
              type="text" 
              name="section" 
              value={filters.section} 
              onChange={handleInputChange} 
              placeholder="e.g. A" 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Search Roll No</label>
            <input 
              type="text" 
              name="rollNo" 
              value={filters.rollNo} 
              onChange={handleInputChange} 
              placeholder="e.g. 101" 
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" 
            />
          </div>
        </div>
        
        {loading && <p className="text-indigo-600 mt-4 font-bold text-sm animate-pulse">Loading all student records...</p>}
        {!loading && filteredStudents.length === 0 && (
          <p className="text-amber-600 mt-4 font-bold text-sm">No students match your filter. Showing blank template below.</p>
        )}
      </div>

      {/* =========================================
          PRINTABLE ID CARD GRID
      ========================================= */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4 print:w-full print:max-w-none">
        {displayData.map((student, idx) => (
          <div 
            key={`${student.id}-${idx}`} 
            className="w-[54mm] h-[86mm] mx-auto bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden flex flex-col relative print:shadow-none print:border-slate-400 print:break-inside-avoid box-border"
            style={{ width: '210px', height: '330px' }} // Standard CR80 ID Card dimensions scaled for web
          >
            
            {/* Header (School Branding) */}
            <div className="bg-indigo-900 text-white text-center p-2 pb-6 relative">
              <h1 className="text-[11px] font-black uppercase leading-tight tracking-wide">{student.schoolName}</h1>
              <p className="text-[7px] text-indigo-200 mt-0.5 font-medium tracking-widest">UDISE: {student.udiseCode}</p>
              
              {/* Curved bottom edge via CSS clip-path or absolute div */}
              <div className="absolute -bottom-4 left-0 right-0 h-8 bg-indigo-900 rounded-b-[50%]"></div>
            </div>

            {/* Profile Photo */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white shadow-md bg-slate-100 overflow-hidden flex items-center justify-center z-10">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt={student.studentName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-slate-300">👤</span>
              )}
            </div>

            {/* Body (Student Details) */}
            <div className="flex-grow pt-10 px-3 flex flex-col items-center">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase text-center w-full truncate leading-tight">
                {student.studentName}
              </h2>
              <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 mb-2 border border-indigo-100">
                {student.className} - {student.section}
              </span>

              <div className="w-full text-[9px] text-slate-700 space-y-1 mt-1 font-semibold leading-tight">
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500">F. Name:</span> 
                  <span className="text-right truncate max-w-[100px]">{student.fatherName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500">Roll No:</span> 
                  <span className="text-right">{student.rollNo}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500">D.O.B:</span> 
                  <span className="text-right">{student.dob}</span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-slate-500">Phone:</span> 
                  <span className="text-right">{student.phone}</span>
                </div>
              </div>
            </div>

            {/* Footer with QR Code and Signatures */}
            <div className="bg-slate-50 p-2 flex items-end justify-between border-t border-slate-200 mt-auto">
              {/* QR Code Container */}
              <div className="bg-white p-0.5 rounded border border-slate-200 shadow-sm">
                <QRCodeSVG value={student.id} size={36} level="H" />
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <p className="text-[7px] font-bold text-slate-500">Session: {student.session}</p>
                <div className="text-center mt-2">
                  <div className="w-16 border-t border-slate-800 mb-0.5"></div>
                  <p className="text-[6px] font-bold text-slate-700 uppercase">Principal Sign</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}