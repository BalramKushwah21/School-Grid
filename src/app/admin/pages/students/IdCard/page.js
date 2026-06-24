"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Save, RefreshCw, QrCode, Scan, 
  Phone, User, GraduationCap, Hash, MapPin, Heart 
} from "lucide-react";

export default function MarkAttendance() {
  const [targetClass, setTargetClass] = useState("Class 10");
  const [targetSection, setTargetSection] = useState("A");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Backend integration states
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [remarksRecords, setRemarksRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ================= LIVE BACKEND FETCH INTEGRATION ENGINE =================
  const loadLiveRosterFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/students/fetch-roster?class=${encodeURIComponent(targetClass)}&section=${encodeURIComponent(targetSection)}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // नोट: सुनिश्चित करें कि आपके API रिस्पॉन्स (route.js) में fatherName और address फ़ील्ड्स मौजूद हों
        setStudents(result.data);
        
        const defaultStates = {};
        const defaultRemarks = {};
        result.data.forEach(student => {
          defaultStates[student.id] = "present";
          defaultRemarks[student.id] = "";
        });
        setAttendanceRecords(defaultStates);
        setRemarksRecords(defaultRemarks);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error communicating with backend server layer:", error);
      setStudents([]);
    } finaly: {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveRosterFromBackend();
  }, [targetClass, targetSection]);

  const handleStatusUpdate = (studentId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkUpdate = (studentId, text) => {
    setRemarksRecords(prev => ({ ...prev, [studentId]: text }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= HEADER CONFIGURATOR ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
              <ShieldCheck size={14} /> Full Verification Identity Token
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mark Student Attendance</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage live records and review student identity credentials seamlessly.</p>
          </div>
        </div>

        {/* ================= FILTERS CONTROLLERS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Select Grade Class</label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 11">Class 11</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Select Section Block</label>
            <select
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Execution Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* ================= UPDATED PREMIUM ID CARD PREVIEW VIEWPORT ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Preview Generated CR80 Student ID Card Layout</h3>
          
          <div className="flex justify-center p-4">
            {/* Wallet Proportions Matrix Container */}
            <div className="w-85 h-[550px] bg-gradient-to-b from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-5 shadow-xl text-white relative flex flex-col justify-between border border-slate-700">
              
              {/* Card Header Corporate Logo block */}
              <div className="text-center border-b border-slate-700/80 pb-2">
                <h4 className="text-xs font-black tracking-widest uppercase text-teal-400">Greenwood International School</h4>
                <p className="text-[8px] tracking-wider text-slate-400 uppercase">Student Identity Card • 2026-27</p>
              </div>

              {/* Student Avatar Sphere */}
              <div className="mx-auto my-1.5 w-18 h-18 rounded-full border-2 border-teal-500 bg-slate-700 flex items-center justify-center font-black text-xl text-slate-300 shadow-md shrink-0">
                {students[0]?.name ? students[0].name[0] : "S"}
              </div>

              {/* ================= COMPREHENSIVE SECURITY DATA MATRIX LAYER ================= */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-[11px]">
                
                {/* 1. Student Full Name */}
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                    <User size={11} className="text-teal-500" /> Name
                  </span>
                  <span className="font-extrabold text-white tracking-wide truncate max-w-[180px] text-right">
                    {students[0]?.name || "Select Class Roster"}
                  </span>
                </div>

                {/* 2. ADDED: Father's Full Legal Name */}
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                    <Heart size={11} className="text-teal-500" /> Father's Name
                  </span>
                  <span className="font-bold text-slate-200 truncate max-w-[160px] text-right">
                    {students[0]?.fatherName || "Shri Satish Sharma"}
                  </span>
                </div>

                {/* 3. Grade Cohort Class Allocation */}
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                    <GraduationCap size={11} className="text-teal-500" /> Class
                  </span>
                  <span className="font-bold text-slate-200 font-mono">{targetClass} - {targetSection}</span>
                </div>

                {/* 4. Assigned System Roll Number */}
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                    <Hash size={11} className="text-teal-500" /> Roll No
                  </span>
                  <span className="font-mono font-bold text-teal-400">{students[0]?.rollNumber || "01"}</span>
                </div>

                {/* 5. Primary Emergency Contact Mobile */}
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-1.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
                    <Phone size={11} className="text-teal-500" /> Phone
                  </span>
                  <span className="font-mono font-bold text-slate-200 tracking-wide">{students[0]?.phone || "+91 98765 43210"}</span>
                </div>

                {/* 6. ADDED: Residential / Permanent Address */}
                <div className="flex flex-col gap-0.5 pt-0.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin size={11} className="text-teal-500" /> Address
                  </span>
                  <p className="text-[10px] font-medium text-slate-300 leading-tight pl-4 line-clamp-2">
                    {students[0]?.address || "H-45, Sector 62, Near Cloud Core Tower, Noida, UP - 201301"}
                  </p>
                </div>

              </div>

              {/* ================= CENTERED QR HARDWARE SCANNER MODULE ================= */}
              <div className="pt-2.5 border-t border-slate-700/60 flex flex-col items-center justify-center text-center space-y-1 shrink-0">
                <div className="p-1.5 bg-white rounded-lg shadow-md inline-flex items-center justify-center">
                  <QrCode size={44} className="text-slate-900" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black tracking-widest text-teal-400 uppercase flex items-center justify-center gap-1">
                    <Scan size={9} /> System Hardware Scan Tag
                  </span>
                  <p className="text-[9px] font-mono font-bold text-slate-400">
                    {students[0]?.id || "STU-10A-01"}
                  </p>
                </div>
              </div>

              {/* Base Verification Footer */}
              <div className="text-center text-[7px] text-slate-500 font-bold uppercase tracking-wider pt-1.5 border-t border-slate-800/40 shrink-0">
                School Management Property Key
              </div>
            </div>
          </div>
        </div>

        {/* ================= SYSTEM ATTENDANCE MARKER ROSTER SPREADSHEET ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">
                  <th className="p-4 w-20 text-center">Roll No</th>
                  <th className="p-4">Student Identity Details</th>
                  <th className="p-4 w-80 text-center">Mark Daily Status</th>
                  <th className="p-4">Administrative Diagnostics Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-teal-600 font-bold animate-pulse">
                      Contacting cloud network servers... fetching live records...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-400 italic">
                      No matching student records found for the selection configuration.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-center font-mono font-black text-slate-400">{student.rollNumber}</td>
                      <td className="p-4 font-bold text-slate-900">
                        <div>{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{student.id} • {student.gender}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl max-w-xs mx-auto">
                          {["present", "absent", "late"].map((code) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => handleStatusUpdate(student.id, code)}
                              className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                                attendanceRecords[student.id] === code 
                                  ? code === "present" ? "bg-emerald-600 text-white shadow-xs" 
                                  : code === "absent" ? "bg-rose-600 text-white shadow-xs" 
                                  : "bg-amber-500 text-white shadow-xs"
                                  : "text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          placeholder="Add diagnostic remarks..."
                          value={remarksRecords[student.id] || ""}
                          onChange={(e) => handleRemarkUpdate(student.id, e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}