"use client";

import React, { useState } from 'react';
import { Settings, Printer, Save, Plus, CheckSquare, LayoutTemplate } from 'lucide-react';

// --- MOCK DATA (Yeh data backend se fetch hoga jab aap DB connect karenge) ---
const mockStudent = {
  name: "Mukesh Kumar Jain",
  admissionNo: "10012",
  rollNo: "38",
  class: "2nd",
  section: "A",
  dob: "23-Aug-1999",
  fatherName: "Shubhashankar Kumar Jain",
  motherName: "Premshila Jeet Jain",
  address: "Village, Post, District",
  aadhar: "112211221122",
  attendance: { working: 192, present: 180 }
};

const mockSubjects = [
  { name: "English", t1_pt: 8, t1_note: 5, t1_enrich: 5, t1_exam: 58, t1_tot: 76, t1_gr: "B1", t2_pt: 9, t2_note: 5, t2_enrich: 4, t2_exam: 72, t2_tot: 90, t2_gr: "A2" },
  { name: "Hindi", t1_pt: 9, t1_note: 4, t1_enrich: 5, t1_exam: 69, t1_tot: 87, t1_gr: "A2", t2_pt: 8, t2_note: 4, t2_enrich: 5, t2_exam: 65, t2_tot: 82, t2_gr: "A2" },
  { name: "Mathematics", t1_pt: 8, t1_note: 4, t1_enrich: 4, t1_exam: 58, t1_tot: 74, t1_gr: "B1", t2_pt: 9, t2_note: 5, t2_enrich: 5, t2_exam: 65, t2_tot: 84, t2_gr: "A2" },
  { name: "Science", t1_pt: 7, t1_note: 4, t1_enrich: 5, t1_exam: 68, t1_tot: 84, t1_gr: "A2", t2_pt: 7, t2_note: 4, t2_enrich: 4, t2_exam: 69, t2_tot: 84, t2_gr: "A2" },
  { name: "SST", t1_pt: 8, t1_note: 4, t1_enrich: 4, t1_exam: 70, t1_tot: 86, t1_gr: "A2", t2_pt: 8, t2_note: 4, t2_enrich: 5, t2_exam: 68, t2_tot: 85, t2_gr: "A2" },
];

export default function DynamicMarksheetBuilder() {
  // --- ADMIN CONFIGURATION STATE ---
  // Admin yahan se marksheet ka structure control karega
  const [config, setConfig] = useState({
    layoutStyle: 'cbse', // 'standard' (3 terms) or 'cbse' (2 terms detailed)
    showAttendance: true,
    showCoScholastic: true,
    showRemarks: true,
    showGradingScale: true,
    headerTitle: "PROGRESS REPORT : 2026-27"
  });

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTemplate = () => {
    // Backend API Call to save the JSON structure of the template
    alert("Template structure saved successfully to database!");
    console.log("Saving Configuration:", config);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* =========================================
          LEFT PANEL: ADMIN BUILDER CONTROLS
          (Print karte waqt yeh panel hide ho jayega)
      ========================================= */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col h-screen sticky top-0 overflow-y-auto print:hidden shadow-lg z-10">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <Settings className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Template Builder</h2>
        </div>

        <div className="space-y-6 flex-grow">
          {/* Layout Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Marksheet Format
            </label>
            <select 
              value={config.layoutStyle}
              onChange={(e) => handleConfigChange('layoutStyle', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="standard">Standard (3 Terms)</option>
              <option value="cbse">CBSE Style (Term 1 & 2 Detailed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Report Title
            </label>
            <input 
              type="text" 
              value={config.headerTitle}
              onChange={(e) => handleConfigChange('headerTitle', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Toggle Sections */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Visible Sections (Drag & Drop Logic applied here)
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={config.showCoScholastic} onChange={(e) => handleConfigChange('showCoScholastic', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Co-Scholastic Area</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={config.showAttendance} onChange={(e) => handleConfigChange('showAttendance', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Attendance Details</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={config.showRemarks} onChange={(e) => handleConfigChange('showRemarks', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Teacher Remarks</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={config.showGradingScale} onChange={(e) => handleConfigChange('showGradingScale', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Grading Scale Guide</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <button onClick={handleSaveTemplate} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all">
            <Save size={16} /> Save Template Format
          </button>
          <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all">
            <Printer size={16} /> Print Marksheet
          </button>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: LIVE A4 PREVIEW
      ========================================= */}
      <div className="flex-1 bg-slate-200 overflow-y-auto p-4 md:p-10 flex justify-center print:bg-white print:p-0 print:m-0 print:overflow-visible">
        
        {/* A4 Page Container */}
        <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] border-2 border-black p-6 md:p-8 flex flex-col relative print:shadow-none print:border-none print:w-full">
          
          {/* --- WATERMARK --- */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none z-0">
            <h1 className="text-9xl font-black transform -rotate-45">SCHOOL LOGO</h1>
          </div>

          {/* --- HEADER --- */}
          <div className="text-center border-b-[3px] border-black pb-4 mb-2 z-10 relative">
            <h1 className="text-3xl font-black uppercase text-blue-900 tracking-wider">Cambridge Public School</h1>
            <p className="text-sm font-bold mt-1 text-slate-700">Affiliated to C.B.S.E., New Delhi</p>
            <p className="text-xs font-semibold text-slate-600">A Co-Educational Residential-cum-day English Medium School</p>
            <p className="text-xs font-semibold text-slate-600">18 K.M. STONE, BHIWANI ROHILA</p>
            
            <div className="flex justify-between items-center w-full mt-2 font-bold text-sm">
              <span>Affiliation No. 1234</span>
              <span>School Code: 5678</span>
            </div>
          </div>

          {/* --- REPORT TITLE --- */}
          <div className="text-center mb-4 z-10">
            <h2 className="text-lg font-bold text-green-700 uppercase">{config.headerTitle}</h2>
          </div>

          {/* --- STUDENT DETAILS TABLE --- */}
          <table className="w-full border-collapse border border-black mb-4 text-xs font-bold z-10">
            <tbody>
              <tr>
                <td className="border border-black p-1.5 w-1/4">Student's Name :</td>
                <td className="border border-black p-1.5 font-normal uppercase">{mockStudent.name}</td>
                <td className="border border-black p-1.5 w-1/6">Admission No :</td>
                <td className="border border-black p-1.5 font-normal">{mockStudent.admissionNo}</td>
                <td className="border border-black p-1.5 w-[10%]">Roll No :</td>
                <td className="border border-black p-1.5 font-normal">{mockStudent.rollNo}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5">Father's Name :</td>
                <td className="border border-black p-1.5 font-normal uppercase">{mockStudent.fatherName}</td>
                <td className="border border-black p-1.5">Class :</td>
                <td className="border border-black p-1.5 font-normal">{mockStudent.class}</td>
                <td className="border border-black p-1.5">Section :</td>
                <td className="border border-black p-1.5 font-normal">{mockStudent.section}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5">Mother's Name :</td>
                <td className="border border-black p-1.5 font-normal uppercase">{mockStudent.motherName}</td>
                <td className="border border-black p-1.5">Date of Birth :</td>
                <td colSpan="3" className="border border-black p-1.5 font-normal">{mockStudent.dob}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5">Address :</td>
                <td className="border border-black p-1.5 font-normal">{mockStudent.address}</td>
                <td className="border border-black p-1.5">Aadhar No :</td>
                <td colSpan="3" className="border border-black p-1.5 font-normal">{mockStudent.aadhar}</td>
              </tr>
            </tbody>
          </table>

          {/* --- DYNAMIC SCHOLASTIC AREA TABLE --- */}
          <div className="z-10">
            <h3 className="text-sm font-bold text-red-700 uppercase mb-1">Part 1(A) Academic Performance : Scholastic Areas</h3>
            <table className="w-full border-collapse border border-black text-[10px] text-center mb-4">
              
              {/* Conditional Table Header based on Admin Layout Selection */}
              {config.layoutStyle === 'cbse' ? (
                // CBSE 2-Term Layout (Image 2)
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-1 text-left w-1/4" rowSpan="2">Scholastic Area :<br/>Sub Name</th>
                    <th className="border border-black p-1" colSpan="6">Term-1 (100 marks)</th>
                    <th className="border border-black p-1" colSpan="6">Term-2 (100 marks)</th>
                    <th className="border border-black p-1" colSpan="2">Overall</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border border-black p-1">Per Test (10)</th>
                    <th className="border border-black p-1">Note Book (5)</th>
                    <th className="border border-black p-1">Sub Enrich (5)</th>
                    <th className="border border-black p-1">Half Yrly (80)</th>
                    <th className="border border-black p-1 font-bold">Total (100)</th>
                    <th className="border border-black p-1 font-bold">Grade</th>
                    <th className="border border-black p-1">Per Test (10)</th>
                    <th className="border border-black p-1">Note Book (5)</th>
                    <th className="border border-black p-1">Sub Enrich (5)</th>
                    <th className="border border-black p-1">Yearly Exam (80)</th>
                    <th className="border border-black p-1 font-bold">Total (100)</th>
                    <th className="border border-black p-1 font-bold">Grade</th>
                    <th className="border border-black p-1 font-bold">Total</th>
                    <th className="border border-black p-1 font-bold">Grade</th>
                  </tr>
                </thead>
              ) : (
                // Standard 3-Term Layout (Image 1)
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-2 text-left" rowSpan="2">Subject</th>
                    <th className="border border-black p-1" colSpan="3">First Terminal Exam</th>
                    <th className="border border-black p-1" colSpan="3">Half Yearly Exam</th>
                    <th className="border border-black p-1" colSpan="3">Annual Exam</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border border-black p-1">Max</th><th className="border border-black p-1">Obt.</th><th className="border border-black p-1">Grade</th>
                    <th className="border border-black p-1">Max</th><th className="border border-black p-1">Obt.</th><th className="border border-black p-1">Grade</th>
                    <th className="border border-black p-1">Max</th><th className="border border-black p-1">Obt.</th><th className="border border-black p-1">Grade</th>
                  </tr>
                </thead>
              )}

              {/* Table Body */}
              <tbody>
                {mockSubjects.map((sub, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-1.5 text-left font-bold">{sub.name}</td>
                    
                    {config.layoutStyle === 'cbse' ? (
                      <>
                        <td className="border border-black p-1.5">{sub.t1_pt}</td>
                        <td className="border border-black p-1.5">{sub.t1_note}</td>
                        <td className="border border-black p-1.5">{sub.t1_enrich}</td>
                        <td className="border border-black p-1.5">{sub.t1_exam}</td>
                        <td className="border border-black p-1.5 font-bold">{sub.t1_tot}</td>
                        <td className="border border-black p-1.5 font-bold">{sub.t1_gr}</td>
                        
                        <td className="border border-black p-1.5">{sub.t2_pt}</td>
                        <td className="border border-black p-1.5">{sub.t2_note}</td>
                        <td className="border border-black p-1.5">{sub.t2_enrich}</td>
                        <td className="border border-black p-1.5">{sub.t2_exam}</td>
                        <td className="border border-black p-1.5 font-bold">{sub.t2_tot}</td>
                        <td className="border border-black p-1.5 font-bold">{sub.t2_gr}</td>
                        
                        <td className="border border-black p-1.5 font-bold">{(sub.t1_tot + sub.t2_tot) / 2}</td>
                        <td className="border border-black p-1.5 font-bold">A2</td>
                      </>
                    ) : (
                      <>
                        <td className="border border-black p-1.5">100</td><td className="border border-black p-1.5">{sub.t1_tot}</td><td className="border border-black p-1.5">{sub.t1_gr}</td>
                        <td className="border border-black p-1.5">100</td><td className="border border-black p-1.5">{sub.t2_exam}</td><td className="border border-black p-1.5">B1</td>
                        <td className="border border-black p-1.5">100</td><td className="border border-black p-1.5">{sub.t2_tot}</td><td className="border border-black p-1.5">{sub.t2_gr}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- TOGGLEABLE SECTIONS --- */}
          {config.showAttendance && (
            <div className="mb-4 z-10">
              <table className="w-full border-collapse border border-black text-xs text-center">
                <tbody>
                  <tr className="font-bold">
                    <td className="border border-black p-1.5 w-1/2">Total Working Days</td>
                    <td className="border border-black p-1.5 w-1/2">Total Days Attended</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1.5">{mockStudent.attendance.working}</td>
                    <td className="border border-black p-1.5">{mockStudent.attendance.present}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {config.showCoScholastic && (
            <div className="mb-4 z-10">
              <h3 className="text-sm font-bold text-red-700 uppercase mb-1">Part 1(B) Co-Scholastic Area</h3>
              <table className="w-full border-collapse border border-black text-[10px] text-center">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-black p-1.5 text-left">Theme</th>
                    <th className="border border-black p-1.5 text-left w-1/2">Area of Assessment</th>
                    <th className="border border-black p-1.5">Term 1</th>
                    <th className="border border-black p-1.5">Term 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-black p-1 text-left">WORK EDUCATION</td><td className="border border-black p-1 text-left">Demonstrates a positive attitude</td><td className="border border-black p-1">A</td><td className="border border-black p-1">A</td></tr>
                  <tr><td className="border border-black p-1 text-left">ART EDUCATION</td><td className="border border-black p-1 text-left">Tries to find effective solutions</td><td className="border border-black p-1">A</td><td className="border border-black p-1">A</td></tr>
                  <tr><td className="border border-black p-1 text-left">DISCIPLINE</td><td className="border border-black p-1 text-left">Discipline on and off the field</td><td className="border border-black p-1">A</td><td className="border border-black p-1">A</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {config.showGradingScale && (
            <div className="mb-4 z-10">
               <p className="text-[9px] font-bold border border-black p-1.5">
                Grading Scale: A1=91%-100%, A2=81%-90%, B1=71%-80%, B2=61%-70%, C1=51%-60%, C2=41%-50%, D=33%-40%, E=Below 33%
              </p>
            </div>
          )}

          {config.showRemarks && (
            <div className="mb-8 z-10 text-sm font-bold">
              <p className="mb-2"><span className="text-red-700">Remarks :</span> GOOD</p>
              <p className="text-green-700">Congratulations !! Promoted to Class : <span className="underline ml-2">{mockStudent.class}</span></p>
            </div>
          )}

          {/* --- SIGNATURES --- */}
          <div className="mt-auto flex justify-between items-end text-xs font-bold z-10 pb-4">
            <div className="text-center">
              <div className="w-40 border-t border-black pt-1">Class Teacher Sign</div>
            </div>
            <div className="text-center">
              <div className="w-40 border-t border-black pt-1">Parents/Guardian Sign</div>
            </div>
            <div className="text-center relative">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" className="absolute bottom-6 left-8 h-8 opacity-70" alt="Signature" />
              <div className="w-40 border-t border-black pt-1">Principal Sign & Stamp</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}