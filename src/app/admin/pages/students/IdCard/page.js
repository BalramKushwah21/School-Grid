"use client"
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function BulkIDCardGenerator() {
  const [searchParams, setSearchParams] = useState({ class: '', rollNo: '' });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleFetchStudents = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Build query string
      const query = new URLSearchParams();
      if (searchParams.class) query.append('class', searchParams.class);
      if (searchParams.rollNo) query.append('rollNo', searchParams.rollNo);

      const response = await fetch(`/app/api/school/admin/students/id-card?${query.toString()}`);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.message || "Something went wrong");
        setStudents([]);
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      
      {/* =======================================================
          CONTROL PANEL (Hidden on Print)
      ======================================================= */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">ID Card Generator</h2>
            <p className="text-sm text-slate-500">Fetch students by Class or Roll Number to print QR-enabled ID cards.</p>
          </div>
          <button 
            onClick={handlePrint}
            disabled={students.length === 0}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow transition"
          >
            🖨️ Print ID Cards
          </button>
        </div>

        <form onSubmit={handleFetchStudents} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Filter by Class</label>
            <input 
              type="text" name="class" value={searchParams.class} onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g. Grade 5"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Search by Roll No</label>
            <input 
              type="text" name="rollNo" value={searchParams.rollNo} onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="e.g. 101"
            />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition">
            {loading ? 'Fetching...' : 'Generate Cards'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-600 font-semibold">{error}</p>}
      </div>

      {/* =======================================================
          ID CARDS RENDER GRID (Visible on Print)
      ======================================================= */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:grid-cols-2 print:gap-4 print:max-w-full">
        
        {students.map((student) => (
          <div key={student.id} className="w-full aspect-[1/1.58] bg-white shadow-xl rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col print:shadow-none print:border-2 print:border-slate-300 print:break-inside-avoid">
            
            {/* Header / School Branding */}
            <div className="h-1/4 bg-indigo-950 p-4 flex flex-col items-center justify-center text-center relative print:h-[25%]">
              <h1 className="text-xl font-extrabold text-white uppercase tracking-wider">{student.schoolName}</h1>
              <div className="absolute -bottom-1 left-0 right-0 h-3 bg-indigo-500"></div>
            </div>

            {/* Profile Picture */}
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-100 overflow-hidden flex items-center justify-center z-10 print:w-20 print:h-20">
              {student.photoUrl ? (
                <img src={student.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-slate-300">👤</span>
              )}
            </div>

            {/* Student Info */}
            <div className="flex-grow pt-16 px-5 text-center flex flex-col items-center print:pt-14">
              <h2 className="text-lg font-bold text-slate-900 uppercase mb-1">
                {student.name}
              </h2>
              <p className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-4">
                {student.className}
              </p>
              
              {/* QR Code Section */}
              <div className="mb-4 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                <QRCodeSVG value={student.id} size={70} level="H" />
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 w-full gap-x-2 gap-y-2 text-left text-[11px] leading-tight">
                <div>
                  <span className="block text-slate-500">Roll No.</span>
                  <span className="block font-bold text-slate-900">{student.rollNo || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Blood Grp.</span>
                  <span className="block font-bold text-rose-700">{student.bloodGroup}</span>
                </div>
                <div>
                  <span className="block text-slate-500">DOB</span>
                  <span className="block font-bold text-slate-900">{student.dob}</span>
                </div>
                <div>
                  <span className="block text-slate-500">Emergency</span>
                  <span className="block font-bold text-slate-900">{student.schoolPhone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="h-8 bg-slate-100 border-t border-slate-200 px-4 flex items-center justify-between text-[10px] font-bold text-slate-600">
              <span>Valid: {student.validUntil}</span>
              <span className="font-mono text-indigo-800 tracking-tighter">ID:{student.id.substring(0,8).toUpperCase()}</span>
            </div>
          </div>
        ))}

        {students.length === 0 && !loading && !error && (
          <div className="col-span-full text-center py-20 text-slate-400 print:hidden">
            Enter search criteria to generate ID cards.
          </div>
        )}

      </div>
    </div>
  );
}