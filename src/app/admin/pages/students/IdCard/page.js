"use client"
import React, { useState } from 'react';

const IssueStudentIDCard = () => {
  // 1. Unified State for ID Card Data
  const [studentData, setStudentData] = useState({
    studentName: '',
    studentId: '',
    dateOfBirth: '',
    className: '',
    bloodGroup: 'A+',
    validUntil: '2027-03-31', // Default future validity
    profilePicture: null // To handle base64 image preview
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Handle Text Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Handle Profile Picture Upload & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Simulate Saving to Database (REPLACE WITH YOUR API CALL)
  const handleSaveToDatabase = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Replace this simulation with your actual API POST request (e.g., fetch/axios)
    console.log('Syncing ID card data with database...', studentData);
    
    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      alert('Student ID record saved successfully to database.');
    }, 1500);
  };

  // 5. Trigger Print/Save Workflow
  const handleDownloadPDF = () => {
    // Triggers window.print(), the CSS handle the isolation of the ID card boundary
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* =======================================================
           COLUMN 1: LIVE EDITOR FORM (Hidden on Print)
           ======================================================= */}
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 print:hidden">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Create Student ID Card</h2>
          
          <form onSubmit={handleSaveToDatabase} className="space-y-5">
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Picture</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Full Name</label>
              <input 
                type="text" name="studentName" required value={studentData.studentName} onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-sm" placeholder="e.g. Alex Johnson"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID / Adm. No.</label>
                <input 
                  type="text" name="studentId" required value={studentData.studentId} onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-sm" placeholder="e.g. EA-1099"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                <input 
                  type="date" name="dateOfBirth" required value={studentData.dateOfBirth} onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class / Grade</label>
                <input 
                  type="text" name="className" required value={studentData.className} onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-sm" placeholder="e.g. Grade 9-B"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Blood Group</label>
                <select name="bloodGroup" value={studentData.bloodGroup} onChange={handleInputChange} className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500">
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valid Until Date</label>
              <input 
                type="date" name="validUntil" required value={studentData.validUntil} onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-sm"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white p-3.5 font-bold rounded-lg transition text-sm shadow disabled:bg-slate-400">
              {loading ? 'Saving to Database...' : '1. Save Record & Sync Database'}
            </button>
          </form>
        </div>

        {/* =======================================================
           COLUMN 2: ID CARD PREVIEW & PRINT CANVAS
           ======================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start print:w-full print:p-0">
          
          {/* Action Header (Hidden on Print) */}
          <div className="w-full max-w-sm mb-6 flex items-center justify-between bg-slate-100 p-4 rounded-xl border border-slate-200 print:hidden">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
              <span className="text-xs font-bold text-slate-800">
                {isSaved ? "Verified Database Entry" : "Draft (Pending Database Sync)"}
              </span>
            </div>
            <button 
              onClick={handleDownloadPDF}
              disabled={!isSaved}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow ${
                isSaved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              2. Download / Print ID
            </button>
          </div>

          {/* =======================================================
             THE PRINTABLE ID CARD BOUNDARY (Standard CR80 Size Aspect)
             We use exact Tailwind ratios to simulate the card dimension.
             ======================================================= */}
          <div className="w-full max-w-sm aspect-[1/1.58] bg-white shadow-2xl rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col print:border-none print:shadow-none print:m-0 print:rounded-none print:w-[3.375in] print:h-[2.125in] print:aspect-auto">
            
            {/* Header / School Logo Area */}
            <div className="h-1/3 bg-sky-950 p-6 flex flex-col items-center justify-center text-center relative print:p-4">
              <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider print:text-xl">Excel Academy</h1>
              <p className="text-[10px] text-sky-200 tracking-tight font-medium uppercase mt-1">Nurturing Leaders for Tomorrow</p>
              <div className="absolute -bottom-1 left-0 right-0 h-4 bg-sky-500"></div>
            </div>

            {/* Profile Picture (Live Fallback) */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-28 h-28 aspect-square rounded-full border-4 border-white shadow-lg bg-slate-100 overflow-hidden flex items-center justify-center print:w-20 print:h-20 print:top-[20%]">
              {studentData.profilePicture ? (
                <img src={studentData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-slate-300 font-black">👤</span>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-grow pt-16 px-6 pb-6 text-center print:pt-10 print:px-4 print:pb-3">
              {/* Student Name */}
              <h2 className="text-xl font-bold text-slate-950 uppercase mb-5 print:text-lg print:mb-3">
                {studentData.studentName || 'Student Name'}
              </h2>
              
              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-left text-xs leading-relaxed print:gap-x-2 print:gap-y-1.5 print:text-[11px]">
                <div>
                  <span className="block font-medium text-slate-500">Student ID / Adm.</span>
                  <span className="block font-bold text-slate-950 font-mono tracking-tight">{studentData.studentId || 'XXXX-XXXX'}</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-500">Blood Grp.</span>
                  <span className="block font-bold text-rose-800">{studentData.bloodGroup}</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-500">Class / Grade</span>
                  <span className="block font-bold text-slate-950">{studentData.className || '______'}</span>
                </div>
                <div>
                  <span className="block font-medium text-slate-500">Date of Birth</span>
                  <span className="block font-bold text-slate-950">{studentData.dateOfBirth || '____/__/__'}</span>
                </div>
              </div>
            </div>

            {/* Footer Area with Validity */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between text-xs font-bold text-slate-700 print:h-8 print:px-4 print:text-[10px]">
              <span>Validity Until: {studentData.validUntil || '____/__/__'}</span>
              <span className="text-sky-800 font-mono text-[10px]">ID_CARD_VER_1.1</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default IssueStudentIDCard;