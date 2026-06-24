"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Users, UserCheck, UserX, Clock, Save, ShieldCheck, 
  Lock, Unlock, Calendar, Search, FileText, CheckCircle2, AlertTriangle
} from "lucide-react";

// Mock Database representing students matching your schema
const INITIAL_STUDENTS = [
  { id: 'STU-2026-001', rollNo: '01', name: 'Aarav Sharma', gender: 'Male' },
  { id: 'STU-2026-002', rollNo: '02', name: 'Ananya Iyer', gender: 'Female' },
  { id: 'STU-2026-003', rollNo: '03', name: 'Kabir Mehta', gender: 'Male' },
  { id: 'STU-2026-004', rollNo: '04', name: 'Diya Patel', gender: 'Female' },
  { id: 'STU-2026-005', rollNo: '05', name: 'Vivaan Joshi', gender: 'Male' },
];

export default function FacultyAttendanceManager() {
  const [selectedClass, setSelectedClass] = useState("Grade 10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Unrestricted Date State - Teacher can select ANY day to view
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});
  const [isSaved, setIsSaved] = useState(true);

  // ================= ROLLING 2-DAY EDITABLE BOUNDS CALCULATOR =================
  const editableWindow = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

    return { today: todayStr, yesterday: yesterdayStr };
  }, []);

  // Is the currently selected date editable or read-only?
  const isEditable = useMemo(() => {
    return attendanceDate === editableWindow.today || attendanceDate === editableWindow.yesterday;
  }, [attendanceDate, editableWindow]);

  // Simulate pulling historical date logs when date/class alters
  useEffect(() => {
    const initialStates = {};
    const initialRemarks = {};
    
    INITIAL_STUDENTS.forEach(student => {
      // Mocking different attendance for old data vs fresh data
      if (!isEditable) {
        initialStates[student.id] = Math.random() > 0.85 ? "absent" : "present";
        initialRemarks[student.id] = initialStates[student.id] === "absent" ? "Archived Record" : "";
      } else {
        initialStates[student.id] = "present";
        initialRemarks[student.id] = "";
      }
    });
    
    setAttendance(initialStates);
    setRemarks(initialRemarks);
    setIsSaved(true);
  }, [attendanceDate, isEditable, selectedClass, selectedSection]);

  const handleStatusChange = (id, newStatus) => {
    if (!isEditable) return; // Hard-stop block safety lock
    setAttendance(prev => ({ ...prev, [id]: newStatus }));
    setIsSaved(false);
  };

  const handleRemarkChange = (id, text) => {
    if (!isEditable) return; // Hard-stop block safety lock
    setRemarks(prev => ({ ...prev, [id]: text }));
    setIsSaved(false);
  };

  const handleMarkAllAs = (status) => {
    if (!isEditable) return;
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
    setIsSaved(false);
  };

  // Live statistical counters
  const stats = useMemo(() => {
    const total = students.length;
    let present = 0, absent = 0, late = 0;
    students.forEach(s => {
      if (attendance[s.id] === "present") present++;
      if (attendance[s.id] === "absent") absent++;
      if (attendance[s.id] === "late") late++;
    });
    return { total, present, absent, late };
  }, [students, attendance]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Dynamic Mode Notification Bar */}
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-3xs transition-all duration-300 ${
          isEditable 
            ? "bg-teal-50 border-teal-200 text-teal-900" 
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isEditable ? 'bg-teal-600 text-white' : 'bg-amber-500 text-white'}`}>
              {isEditable ? <Unlock size={16} /> : <Lock size={16} />}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                {isEditable ? "Roster Access: Write Enabled" : "Roster Access: Read Only Archive Mode"}
              </p>
              <p className="text-[11px] opacity-80 font-medium">
                {isEditable 
                  ? "You can freely mark or update attendance logs for this rolling 48-hour timeline window."
                  : "Viewing archived historic logs. Modification access is restricted for faculty tiers."}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-white/60">
            {isEditable ? "🟢 ACTIVE" : "🔒 LOCKED"}
          </span>
        </div>

        {/* ================= COMPONENT HEADER & ACTIONS ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
              <ShieldCheck size={14} /> Faculty Attendance Registry Engine
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daily Roll Call Register</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage daily records or explore older data sets using the open system calendar.</p>
          </div>

          <button
            disabled={!isEditable || isSaved}
            onClick={() => setIsSaved(true)}
            className={`w-full sm:w-auto font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              isSaved 
                ? "bg-slate-100 text-slate-400 cursor-default shadow-none border" 
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-100"
            }`}
          >
            <Save size={16} /> {isSaved ? "Saved to Database" : "Commit Changes"}
          </button>
        </div>

        {/* ================= SEARCH & INTERACTIVE CONTEXT FILTERS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Grade Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            >
              <option value="Grade 10">Class 10</option>
              <option value="Grade 9">Class 9</option>
              <option value="Grade 11">Class 11</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              Select Attendance Date <span className="text-teal-600 font-bold">(Open Search)</span>
            </label>
            {/* NO MIN/MAX RESTRICTIONS: Teacher can see any historical record */}
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Search Student</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name or UID Key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ================= REALTIME LIVE REGISTER KPI COUNTERS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Cohort Size</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{stats.total}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Present Count</span>
            <span className="text-xl font-black text-emerald-600 font-mono">{stats.present}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Absent Count</span>
            <span className="text-xl font-black text-rose-600 font-mono">{stats.absent}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-3xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Late Arrivals</span>
            <span className="text-xl font-black text-amber-500 font-mono">{stats.late}</span>
          </div>
        </div>

        {/* ================= MAIN MASTER REGISTRY SPREADSHEET CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden">
          
          {/* Table Header Utilities Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              {selectedClass} — Section {selectedSection} Roster List
            </span>

            {/* Bulk Actions interface disables elegantly if timeline isn't editable */}
            {isEditable && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAllAs("present")}
                  className="bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold text-slate-600 transition shadow-3xs"
                >
                  ✓ Set All Present
                </button>
                <button
                  onClick={() => handleMarkAllAs("absent")}
                  className="bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold text-slate-600 transition shadow-3xs"
                >
                  ✕ Set All Absent
                </button>
              </div>
            )}
          </div>

          {/* Roster Layout Sheet */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 w-20 text-center">Roll No</th>
                  <th className="p-4">Student Identity Parameters</th>
                  <th className="p-4 w-80 text-center">Status Allocation Parameters</th>
                  <th className="p-4">Administrative Diagnostics Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700 bg-white">
                {filteredStudents.map((student) => {
                  const currentStatus = attendance[student.id] || "present";
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-center font-mono font-black text-slate-400">{student.rollNo}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{student.id} • {student.gender}</div>
                      </td>
                      
                      {/* Status Selector Cell */}
                      <td className="p-4">
                        <div className={`flex gap-1 bg-slate-100 p-1 rounded-xl max-w-xs mx-auto ${!isEditable && 'opacity-60'}`}>
                          {["present", "absent", "late"].map((code) => {
                            const isSelected = currentStatus === code;
                            return (
                              <button
                                key={code}
                                type="button"
                                disabled={!isEditable} // Dynamic UI Protection Rule
                                onClick={() => handleStatusChange(student.id, code)}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                                  isSelected 
                                    ? code === "present" ? "bg-emerald-600 text-white shadow-2xs" 
                                      : code === "absent" ? "bg-rose-600 text-white shadow-2xs" 
                                      : "bg-amber-500 text-white shadow-2xs"
                                    : isEditable ? "text-slate-500 hover:bg-slate-200" : "text-slate-400"
                                }`}
                              >
                                {code}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Administrative Remarks Input */}
                      <td className="p-4">
                        <input
                          type="text"
                          disabled={!isEditable} // Dynamic UI Protection Rule
                          placeholder={isEditable ? "Add internal remarks..." : "Record Archived — Input Locked"}
                          value={remarks[student.id] || ""}
                          onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                          className={`w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 outline-none font-medium ${
                            isEditable ? 'focus:bg-white focus:ring-1 focus:ring-teal-500 text-slate-800' : 'text-slate-400 cursor-not-allowed'
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Operations Secure Core Footer */}
        <div className="bg-slate-900 p-4 rounded-xl text-xs font-bold font-mono tracking-wider text-slate-400 text-center">
          SYSTEM CORE ACTIVE • CHANNELS SAFE FOR DEPLOYMENT • SECURITY PROFILE APPLIED
        </div>

      </div>
    </div>
  );
}