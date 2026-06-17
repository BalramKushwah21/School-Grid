"use client"
import React, { useState } from 'react';
import { useEffect } from 'react';

const IssueTransferCertificate = () => {

  const [tcNumber, setTcNumber] = useState("");

  useEffect(() => {
		setTcNumber(
			`TC-${new Date().getFullYear()}-${Math.floor(
				1000 + Math.random() * 9000,
			)}`,
		);
  }, []);

  const [studentInfo, setStudentInfo] = useState({
    tcNumber: tcNumber,
    studentName: '',
    admissionNumber: '',
    dateOfBirth: '',
    parentName: '',
    leavingDate: '',
    academicStatus: 'Passed & Promoted',
    reasonForLeaving: '',
    conduct: 'Good'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveToDatabase = (e) => {
    e.preventDefault();
    
    // Simulate sending data to your backend database API endpoint
    console.log('Saving student TC data to database...', studentInfo);
    
    setIsSaved(true);
  };

  const handleDownloadPDF = () => {
    // Triggers the native browser print workflow. 
    // The utility classes matching 'print:...' handle the layout isolation automatically.
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form (Hidden during actual printing layout) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:hidden">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Student Information Entry</h2>
          
          <form onSubmit={handleSaveToDatabase} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Student Full Name</label>
              <input 
                type="text" name="studentName" required value={studentInfo.studentName} onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Alex Smith"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Admission / ID No.</label>
                <input 
                  type="text" name="admissionNumber" required value={studentInfo.admissionNumber} onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. 2026-89A"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date of Birth</label>
                <input 
                  type="date" name="dateOfBirth" required value={studentInfo.dateOfBirth} onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Parent / Guardian Name</label>
              <input 
                type="text" name="parentName" required value={studentInfo.parentName} onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Robert Smith"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date of Leaving</label>
              <input 
                type="date" name="leavingDate" required value={studentInfo.leavingDate} onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reason for Leaving</label>
              <input 
                type="text" name="reasonForLeaving" required value={studentInfo.reasonForLeaving} onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="e.g. Relocation of family"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Academic Status</label>
                <select name="academicStatus" value={studentInfo.academicStatus} onChange={handleInputChange} className="w-full p-2 bg-white border border-gray-300 rounded text-sm">
                  <option value="Passed & Promoted">Passed & Promoted</option>
                  <option value="Studying in Class">Studying in Class</option>
                  <option value="Withdrawn Prematurely">Withdrawn Prematurely</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Conduct</label>
                <select name="conduct" value={studentInfo.conduct} onChange={handleInputChange} className="w-full p-2 bg-white border border-gray-300 rounded text-sm">
                  <option value="Good">Good</option>
                  <option value="Exemplary">Exemplary</option>
                  <option value="Satisfactory">Satisfactory</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 font-medium rounded transition text-sm shadow-sm">
              Save Certificate Records
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Official Real-Time Preview Certificate Document */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start print:w-full print:p-0">
          
          {/* Action Download Header Banner */}
          <div className="w-full max-w-2xl mb-4 flex items-center justify-between bg-slate-800 text-white p-3 rounded-lg shadow-sm print:hidden">
            <span className="text-sm font-medium">
              {isSaved ? "✅ Records verified & synced" : "⚠️ Draft Mode: Click save to verify"}
            </span>
            <button 
              onClick={handleDownloadPDF}
              disabled={!isSaved}
              className={`px-4 py-1.5 rounded text-xs font-bold shadow transition ${
                isSaved ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Download / Print PDF
            </button>
          </div>

          {/* Printable Document Boarder Layout */}
          <div className="w-full max-w-2xl bg-white p-10 border-8 border-double border-slate-700 shadow-lg rounded-sm relative aspect-[1/1.41] print:border-none print:shadow-none print:p-0 print:m-0">
            
            {/* Header School Information */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <h1 className="text-2xl font-black uppercase tracking-wider text-slate-800">Excel International Academy</h1>
              <p className="text-xs text-gray-500 tracking-tight">Main Campus, Administrative Zone, City District</p>
              <h3 className="inline-block mt-4 px-6 py-1 bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-sm">
                Transfer Certificate
              </h3>
            </div>

            {/* Certificate Meta Details */}
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-8">
              <span>TC Log Reference: <span className="underline font-mono">{studentInfo.tcNumber}</span></span>
              <span>Date Issued: <span className="underline">{new Date().toLocaleDateString()}</span></span>
            </div>

            {/* Document Statement Structure */}
            <div className="space-y-5 text-sm text-slate-800 leading-relaxed">
              <p>This is to formally certify that <span className="font-bold border-b border-gray-400 px-2 min-w-[180px] inline-block text-center">{studentInfo.studentName || "____________________"}</span></p>
              
              <p>Son/Daughter of Honorable Parent/Guardian <span className="font-bold border-b border-gray-400 px-2 min-w-[200px] inline-block text-center">{studentInfo.parentName || "____________________"}</span></p>
              
              <p>was registered at this academy under Admission File Code Reference Number <span className="font-mono font-bold border-b border-gray-400 px-2 text-center">{studentInfo.admissionNumber || "________"}</span>.</p>
              
              <p>According to official school registration archives, the student's recorded Date of Birth corresponds to <span className="font-bold border-b border-gray-400 px-2 text-center">{studentInfo.dateOfBirth || "________"}</span>.</p>
              
              <p>The student has officially separated from the academic institution on the effective date of <span className="font-bold border-b border-gray-400 px-2 text-center">{studentInfo.leavingDate || "________"}</span> due to the following specific reason: <span className="italic font-medium border-b border-gray-400 px-1">{studentInfo.reasonForLeaving || "________________________"}</span>.</p>
              
              <p>At the date of separation, the recorded formal academic standing is cataloged as <span className="font-bold text-blue-900">{studentInfo.academicStatus}</span> with a general behavioral conduct rating of <span className="font-bold text-emerald-800">{studentInfo.conduct}</span>.</p>
            </div>

            {/* Signature Area */}
            <div className="absolute bottom-12 left-10 right-10 flex justify-between items-end text-xs font-bold text-slate-700">
              <div className="text-center">
                <div className="w-32 border-t border-slate-600 mb-1"></div>
                <span>Registrar Desk</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-slate-600 mb-1"></div>
                <span>Principal Endorsement</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default IssueTransferCertificate;