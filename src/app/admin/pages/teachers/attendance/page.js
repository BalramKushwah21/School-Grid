"use client"

import React, { useState, useMemo } from 'react';

const INITIAL_STUDENTS = [
  { id: "STU-2026-001", name: "Alex Smith", rollNo: "01", class: "Grade 9-A" },
  { id: "STU-2026-002", name: "Sophia Martinez", rollNo: "02", class: "Grade 9-A" },
  { id: "STU-2026-003", name: "Ethan Davis", rollNo: "03", class: "Grade 9-A" },
  { id: "STU-2026-004", name: "Liam Johnson", rollNo: "04", class: "Grade 9-A" },
  { id: "STU-2026-005", name: "Olivia Brown", rollNo: "05", class: "Grade 9-A" },
  { id: "STU-2026-006", name: "Emma Wilson", rollNo: "01", class: "Grade 10-A" },
  { id: "STU-2026-007", name: "Lucas Taylor", rollNo: "02", class: "Grade 10-A" },
  { id: "STU-2026-008", name: "Mia Anderson", rollNo: "03", class: "Grade 10-A" },
  { id: "STU-2026-009", name: "Noah Thomas", rollNo: "04", class: "Grade 10-A" },
  { id: "STU-2026-010", name: "Isabella White", rollNo: "05", class: "Grade 10-A" },
  { id: "STU-2026-011", name: "James Martin", rollNo: "01", class: "Grade 11-A" },
  { id: "STU-2026-012", name: "Charlotte Garcia", rollNo: "02", class: "Grade 11-A" },
  { id: "STU-2026-013", name: "Benjamin Martinez", rollNo: "03", class: "Grade 11-A" },
  { id: "STU-2026-014", name: "Amelia Robinson", rollNo: "04", class: "Grade 11-A" },
];

const CLASSES = ["Grade 9-A", "Grade 10-A", "Grade 11-A"];

export default function App() {
  const [selectedClass, setSelectedClass] = useState("Grade 9-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  
  // Default all students to 'present' initially
  const [attendance, setAttendance] = useState(() => {
    const initial = {};
    INITIAL_STUDENTS.forEach(student => {
      initial[student.id] = "present";
    });
    return initial;
  });

  const [studentNotes, setStudentNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [databaseLogs, setDatabaseLogs] = useState([]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const classStudents = useMemo(() => {
    return students.filter(student => student.class === selectedClass);
  }, [students, selectedClass]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return classStudents;
    return classStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classStudents, searchTerm]);

  const stats = useMemo(() => {
    const total = classStudents.length;
    if (total === 0) return { present: 0, absent: 0, late: 0, excused: 0, rate: 0 };
    
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    classStudents.forEach(student => {
      const status = attendance[student.id] || "present";
      if (status === "present") present++;
      if (status === "absent") absent++;
      if (status === "late") late++;
      if (status === "excused") excused++;
    });

    const rate = Math.round(((present + late) / total) * 100);

    return { total, present, absent, late, excused, rate };
  }, [classStudents, attendance]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setIsSaved(false);
  };

  const handleNoteChange = (studentId, note) => {
    setStudentNotes(prev => ({ ...prev, [studentId]: note }));
    setIsSaved(false);
  };

  const handleMarkAll = (status) => {
    const updated = { ...attendance };
    classStudents.forEach(student => {
      updated[student.id] = status;
    });
    setAttendance(updated);
    setIsSaved(false);
    triggerNotification(`All students marked as ${status.toUpperCase()}`, "info");
  };

  const handleSyncDatabase = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Database Synchronization Delay
    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      triggerNotification(`Attendance successfully synced for ${selectedClass} on ${selectedDate}`, "success");
      
      setDatabaseLogs(prev => [
        {
          id: 'SYNC-' + Math.floor(1000 + Math.random() * 9000),
          class: selectedClass,
          date: selectedDate,
          presentCount: stats.present + stats.late,
          absentCount: stats.absent,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 1200);
  };

  const handlePrintRegistry = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      
      {/* Dynamic Toast Notifications */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="text-lg">
            {notification.type === 'success' ? '🚀' : 'ℹ️'}
          </span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* ================= HEADER SECTION ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Student Attendance</h1>
            <p className="text-sm text-slate-500 mt-1">
              Mark student attendance status, track real-time attendance ratios, and export clean registry files.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrintRegistry}
              disabled={!isSaved}
              className={`px-5 py-2.5 font-bold rounded-lg text-sm transition flex items-center gap-2 shadow-sm ${
                isSaved 
                ? 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700' 
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.82l-.24-.1a1.35 1.35 0 112.26-1.61L9 12.5l.28-.39a1.35 1.35 0 112.26 1.61l-.24.1c-.24.1-.38.36-.38.61v.07m-6 0a6 6 0 1012 0 6 6 0 00-12 0z" /></svg>
              Export Report (PDF)
            </button>
            
            <button
              onClick={handleSyncDatabase}
              disabled={loading || isSaved}
              className={`px-5 py-2.5 font-bold rounded-lg text-sm transition flex items-center gap-2 shadow-md ${
                isSaved 
                ? 'bg-emerald-600 text-white cursor-default' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? 'Saving to Cloud...' : isSaved ? '✓ Synced to DB' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT WORKFLOW HEADER ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Daily Student Attendance Registry</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Class: {selectedClass}</span>
          <span>Registry Date: {selectedDate}</span>
          <span>Attendance Rate: {stats.rate}%</span>
        </div>
      </div>

      {/* ================= MAIN DASHBOARD BOARD ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Directory List */}
        <section className="lg:col-span-8 space-y-6 print:w-full print:p-0">
          
          {/* Controls Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
            <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Class/Grade</label>
                <select
                  value={selectedClass}
                  onChange={(e) => { setSelectedClass(e.target.value); setIsSaved(false); }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Registry Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setIsSaved(false); }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Quick Filter Student Name */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search class student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
              />
            </div>
          </div>

          {}
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:hidden">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Students</span>
              <span className="text-xl font-black text-slate-900">{stats.total}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Present</span>
              <span className="text-xl font-black text-emerald-600">{stats.present}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Absent</span>
              <span className="text-xl font-black text-rose-600">{stats.absent}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Late</span>
              <span className="text-xl font-black text-amber-500">{stats.late}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance Rate</span>
              <span className="text-xl font-black text-indigo-600">{stats.rate}%</span>
            </div>
          </div>

          {}
          {/* Attendance Student Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
            
            {/* Quick Group Actions */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center print:hidden">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Student Logs</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAll("present")}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-600 transition"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll("absent")}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-600 transition"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/50 print:bg-transparent">
                    <th className="p-4 w-16">Roll No</th>
                    <th className="p-4">Student Details</th>
                    <th className="p-4 w-60 text-center print:hidden">Status Toggle</th>
                    <th className="p-4 hidden print:table-cell text-center">Status</th>
                    <th className="p-4">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-slate-400 italic">
                        No students found matching current directory criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const currentStatus = attendance[student.id] || "present";
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono font-bold text-slate-400">{student.rollNo}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold font-mono">{student.id}</p>
                          </td>
                          
                          {/* STATUS SELECTION FOR WEB INTERACTIVE SCREEN */}
                          <td className="p-4 print:hidden">
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg max-w-sm mx-auto">
                              <button
                                onClick={() => handleStatusChange(student.id, "present")}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                  currentStatus === "present" 
                                  ? "bg-emerald-500 text-white shadow" 
                                  : "text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, "absent")}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                  currentStatus === "absent" 
                                  ? "bg-rose-500 text-white shadow" 
                                  : "text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, "late")}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                  currentStatus === "late" 
                                  ? "bg-amber-400 text-white shadow" 
                                  : "text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                Late
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.id, "excused")}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                  currentStatus === "excused" 
                                  ? "bg-slate-500 text-white shadow" 
                                  : "text-slate-500 hover:bg-slate-200"
                                }`}
                              >
                                Excused
                              </button>
                            </div>
                          </td>

                          {/* DYNAMIC STATIC STATUS TEXT RENDERED EXCLUSIVELY ON PDF PRINTS */}
                          <td className="p-4 hidden print:table-cell text-center font-bold">
                            <span className={`text-xs uppercase px-2 py-0.5 rounded ${
                              currentStatus === "present" ? "text-emerald-700 bg-emerald-50" :
                              currentStatus === "absent" ? "text-rose-700 bg-rose-50" :
                              currentStatus === "late" ? "text-amber-700 bg-amber-50" : "text-slate-700 bg-slate-50"
                            }`}>
                              {currentStatus}
                            </span>
                          </td>

                          {/* Remark Field */}
                          <td className="p-4">
                            <input
                              type="text"
                              value={studentNotes[student.id] || ""}
                              onChange={(e) => handleNoteChange(student.id, e.target.value)}
                              placeholder="Add Remark (e.g., Medical, Sport)"
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50/50 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Dynamic Sign-Off Block Visible solely on Print out */}
            <div className="hidden print:flex justify-between items-end text-xs font-bold text-slate-700 pt-24 pb-8 px-6">
              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mx-auto mb-1"></div>
                <span>Class Teacher Signature</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-slate-400 mx-auto mb-1"></div>
                <span>System Registrar Approved</span>
              </div>
            </div>

          </div>

        </section>

        {/* ==========================================
           RIGHT COLUMN: Simulated cloud logger
           ========================================== */}
        <section className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Connection Status Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cloud Registry Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Active Session</span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">CONNECTED</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <p className="text-xs font-semibold text-slate-600">
                  {isSaved ? "Saved. All active class changes uploaded." : "Unsaved changes pending database synchronization."}
                </p>
              </div>

              {!isSaved && (
                <button
                  onClick={handleSyncDatabase}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white p-2.5 text-xs font-bold rounded-lg transition mt-2 shadow"
                >
                  {loading ? 'Uploading records...' : 'Sync Class Attendance'}
                </button>
              )}
            </div>
          </div>

          {/* Database Synchronization Logs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Daily Server Sync Logs</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {databaseLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No daily logs recorded in active session yet.</p>
              ) : (
                databaseLogs.map((log) => (
                  <div key={log.id} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-indigo-600">{log.id}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-500 flex justify-between text-[10px]">
                      <span>{log.class} • {log.date}</span>
                      <span className="font-bold text-emerald-600">{log.presentCount} Present / {log.absentCount} Absent</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}