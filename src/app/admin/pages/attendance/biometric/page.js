"use client"
import React, { useState, useMemo } from 'react';

const INITIAL_STUDENTS = [
  { id: "STU-2026-001", name: "Alex Smith", rollNo: "01", class: "Grade 9-A", gender: "Male" },
  { id: "STU-2026-002", name: "Sophia Martinez", rollNo: "02", class: "Grade 9-A", gender: "Female" },
  { id: "STU-2026-003", name: "Ethan Davis", rollNo: "03", class: "Grade 9-A", gender: "Male" },
  { id: "STU-2026-004", name: "Liam Johnson", rollNo: "04", class: "Grade 9-A", gender: "Male" },
  { id: "STU-2026-005", name: "Olivia Brown", rollNo: "05", class: "Grade 9-A", gender: "Female" },
  { id: "STU-2026-006", name: "Emma Wilson", rollNo: "01", class: "Grade 10-A", gender: "Female" },
  { id: "STU-2026-007", name: "Lucas Taylor", rollNo: "02", class: "Grade 10-A", gender: "Male" },
  { id: "STU-2026-008", name: "Mia Anderson", rollNo: "03", class: "Grade 10-A", gender: "Female" },
  { id: "STU-2026-009", name: "Noah Thomas", rollNo: "04", class: "Grade 10-A", gender: "Male" },
  { id: "STU-2026-010", name: "Isabella White", rollNo: "05", class: "Grade 10-A", gender: "Female" },
  { id: "STU-2026-011", name: "James Martin", rollNo: "01", class: "Grade 11-A", gender: "Male" },
  { id: "STU-2026-012", name: "Charlotte Garcia", rollNo: "02", class: "Grade 11-A", gender: "Female" },
  { id: "STU-2026-013", name: "Benjamin Martinez", rollNo: "03", class: "Grade 11-A", gender: "Male" },
  { id: "STU-2026-014", name: "Amelia Robinson", rollNo: "04", class: "Grade 11-A", gender: "Female" },
];

const CLASSES = ["Grade 9-A", "Grade 10-A", "Grade 11-A"];

export default function App() {
  const [activeTab, setActiveTab] = useState("biometric"); // Focusing directly on biometric tab for user checkout
  const [selectedClass, setSelectedClass] = useState("Grade 9-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  
  // Daily registry states
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
  
  // Monthly calendar contexts
  const [selectedMonth, setSelectedMonth] = useState("2026-06");

  const [monthlyRecords, setMonthlyRecords] = useState(() => {
    const records = {};
    // Seed initial records across 31 possible calendar days to prevent empty initial states
    INITIAL_STUDENTS.forEach(student => {
      for (let day = 1; day <= 31; day++) {
        const rand = Math.random();
        records[`${student.id}-${day}`] = rand > 0.9 ? "absent" : rand > 0.82 ? "late" : "present";
      }
    });
    return records;
  });

  // Biometric Terminal states
  const [terminalStatus, setTerminalStatus] = useState("Online"); 
  const [biometricLogs, setBiometricLogs] = useState([
    { id: "BIO-1092", time: "08:15:22 AM", studentId: "STU-2026-001", name: "Alex Smith", device: "Front Gate Terminal 1", match: "99.4%", status: "Access Granted" },
    { id: "BIO-1093", time: "08:17:41 AM", studentId: "STU-2026-002", name: "Sophia Martinez", device: "Front Gate Terminal 1", match: "98.7%", status: "Access Granted" },
    { id: "BIO-1094", time: "08:19:05 AM", studentId: "STU-2026-003", name: "Ethan Davis", device: "Back Lobby Terminal 2", match: "99.1%", status: "Access Granted" }
  ]);

  // Scanner Simulator States
  const [scanningStudentId, setScanningStudentId] = useState("STU-2026-001");
  const [isFingerScanning, setIsFingerScanning] = useState(false);
  const [activeScanStatus, setActiveScanStatus] = useState("Idle"); // Idle, Scanning, Matched, Failed
  const [activeMatchRate, setActiveMatchRate] = useState(null);

  const [terminalsList, setTerminalsList] = useState([
    { name: "Front Gate Terminal 1", ip: "192.168.10.45", health: "Online", scansCount: 142 },
    { name: "Back Lobby Terminal 2", ip: "192.168.10.46", health: "Online", scansCount: 89 },
    { name: "Science Wing Terminal 3", ip: "192.168.10.47", health: "Online", scansCount: 56 },
    { name: "Gymnasium Terminal 4", ip: "192.168.10.48", health: "Offline", scansCount: 0 }
  ]);

  // Global Sync / Audit Notifications
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [databaseLogs, setDatabaseLogs] = useState([
    { id: "SYNC-100", class: "Grade 9-A", date: "2026-06-18", presentCount: 4, absentCount: 1, timestamp: "08:30 AM" }
  ]);

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

  const daysInMonth = useMemo(() => {
    if (!selectedMonth) return 30;
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const getWeekdayLabel = (day) => {
    if (!selectedMonth) return "";
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return weekdays[date.getDay()];
  };

  const checkIsWeekend = (day) => {
    if (!selectedMonth) return false;
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const cycleMonthlyStatus = (studentId, day, studentName) => {
    const key = `${studentId}-${day}`;
    const current = monthlyRecords[key] || "present";
    let next = "present";
    
    if (current === "present") next = "absent";
    else if (current === "absent") next = "late";
    else if (current === "late") next = "excused";
    
    setMonthlyRecords(prev => ({ ...prev, [key]: next }));
    setIsSaved(false);
    triggerNotification(`Updated ${studentName} (Day ${day}) status to ${next.toUpperCase()}`, "info");
  };

  const getStudentMonthlyRate = (studentId) => {
    let compliantCount = 0;
    let countedDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      if (!checkIsWeekend(day)) {
        countedDays++;
        const status = monthlyRecords[`${studentId}-${day}`] || "present";
        if (status === "present" || status === "late" || status === "excused") {
          compliantCount++;
        }
      }
    }
    return countedDays > 0 ? Math.round((compliantCount / countedDays) * 100) : 100;
  };

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
    triggerNotification(`All students in ${selectedClass} marked as ${status.toUpperCase()}`, "info");
  };

  const handleSyncDatabase = (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      triggerNotification(`Attendance registry committed successfully for ${selectedClass}`, "success");
      
      setDatabaseLogs(prev => [
        {
          id: 'SYNC-' + Math.floor(1000 + Math.random() * 9000),
          class: selectedClass,
          date: selectedDate,
          presentCount: stats.present + stats.late,
          absentCount: stats.absent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }, 1200);
  };

  const handlePerformFingerprintScan = () => {
    if (isFingerScanning) return;
    
    setIsFingerScanning(true);
    setActiveScanStatus("Scanning");
    setActiveMatchRate(null);

    const targetStudent = students.find(s => s.id === scanningStudentId);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.05; // 95% mock success rate
      if (isSuccess) {
        const matchPercent = (Math.random() * (99.9 - 97.0) + 97.0).toFixed(1) + "%";
        setActiveScanStatus("Matched");
        setActiveMatchRate(matchPercent);
        setIsFingerScanning(false);

        // Auto-mark present in current active state
        setAttendance(prev => ({ ...prev, [scanningStudentId]: "present" }));
        setIsSaved(false);

        // Push to biometric logs list
        setBiometricLogs(prev => [
          {
            id: "BIO-" + Math.floor(1000 + Math.random() * 9000),
            time: new Date().toLocaleTimeString(),
            studentId: scanningStudentId,
            name: targetStudent ? targetStudent.name : "Unknown",
            device: "Front Gate Terminal 1",
            match: matchPercent,
            status: "Access Granted"
          },
          ...prev
        ]);

        // Increment scans count for terminal 1
        setTerminalsList(prev => prev.map(t => {
          if (t.name === "Front Gate Terminal 1") {
            return { ...t, scansCount: t.scansCount + 1 };
          }
          return t;
        }));

        triggerNotification(`Biometric Verified: ${targetStudent ? targetStudent.name : 'Student'} logged as PRESENT.`, "success");
      } else {
        setActiveScanStatus("Failed");
        setIsFingerScanning(false);
        triggerNotification("Biometric mismatch. Please reposition fingerprint.", "error");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      
      {/* Toast Notification Bar */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span className="text-lg">
            {notification.type === 'success' ? '🚀' : 'ℹ️'}
          </span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* Main Administrative Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Attendance System</h1>
            <p className="text-sm text-slate-500 mt-1">
              Mark registries, observe historical grids, verify biometric terminal logs, and export system-wide compliance ledgers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm shadow-sm transition flex items-center gap-2"
            >
              Print Master Copy (PDF)
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
              {loading ? 'Synchronizing Cloud...' : isSaved ? '✓ Synced to Server' : 'Commit Daily Save'}
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT HEADING ONLY ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Attendance Register Registry Audit Sheet</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Active Focus Segment: {selectedClass}</span>
          <span>Registry Date Target: {selectedDate}</span>
          <span>Attendance Rate Score: {stats.rate}%</span>
        </div>
      </div>

      {/* ================= MAIN NAVIGATION TABS ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="flex flex-wrap border-b border-slate-200">
          <button
            onClick={() => setActiveTab("daily")}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "daily"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📋 Daily Attendance Registry
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "monthly"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📅 Monthly Grid View
          </button>
          <button
            onClick={() => setActiveTab("biometric")}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "biometric"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            🧬 Biometric Sync Terminal
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "reports"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📈 Statistical Reports
          </button>
        </div>
      </section>

      {/* ================= PRIMARY LAYOUT DECKS ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">

        {/* 1. DAILY REGISTRY TAB */}
        {activeTab === "daily" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            
            {/* Left Workspace Column: Filters & Main Student Table */}
            <div className="lg:col-span-8 space-y-6 print:col-span-12 print:w-full">
              
              {/* Controls Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
                <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Class Cohort</label>
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
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Date Target</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setIsSaved(false); }}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Local search engine input */}
                <div className="relative w-full md:w-72">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search class records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
                  />
                </div>
              </div>

              {/* Status Widgets Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:hidden">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered</span>
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
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Late Arrivals</span>
                  <span className="text-xl font-black text-amber-500">{stats.late}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Compliance Rate</span>
                  <span className="text-xl font-black text-indigo-600">{stats.rate}%</span>
                </div>
              </div>

              {/* Table Student Deck */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
                
                {/* Bulk Operations Bar */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center print:hidden">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Cohort Attendance List</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAll("present")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-600 transition shadow-sm"
                    >
                      Mark All Present
                    </button>
                    <button
                      onClick={() => handleMarkAll("absent")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-600 transition shadow-sm"
                    >
                      Mark All Absent
                    </button>
                  </div>
                </div>

                {/* Registry Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/50 print:bg-transparent">
                        <th className="p-4 w-16">Roll No</th>
                        <th className="p-4">Student Info</th>
                        <th className="p-4 w-60 text-center print:hidden">Change Status Option</th>
                        <th className="p-4 hidden print:table-cell text-center">Status</th>
                        <th className="p-4">System Remarks / Medical</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-12 text-center text-slate-400 italic">
                            No students registered in the selected scope matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const currentStatus = attendance[student.id] || "present";
                          return (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition">
                              
                              {/* Roll Designation */}
                              <td className="p-4 font-mono font-black text-slate-400">{student.rollNo}</td>
                              
                              {/* Profile Core Info */}
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white ${
                                    student.gender === 'Female' ? 'bg-indigo-400' : 'bg-slate-400'
                                  }`}>
                                    {student.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 leading-tight">{student.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold font-mono">{student.id}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Web Interact Buttons */}
                              <td className="p-4 print:hidden">
                                <div className="flex gap-1 bg-slate-150/60 p-1 rounded-lg max-w-sm mx-auto">
                                  <button
                                    onClick={() => handleStatusChange(student.id, "present")}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                      currentStatus === "present" 
                                      ? "bg-emerald-500 text-white shadow-sm" 
                                      : "text-slate-500 hover:bg-slate-200"
                                    }`}
                                  >
                                    Present
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(student.id, "absent")}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                      currentStatus === "absent" 
                                      ? "bg-rose-500 text-white shadow-sm" 
                                      : "text-slate-500 hover:bg-slate-200"
                                    }`}
                                  >
                                    Absent
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(student.id, "late")}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                      currentStatus === "late" 
                                      ? "bg-amber-400 text-white shadow-sm" 
                                      : "text-slate-500 hover:bg-slate-200"
                                    }`}
                                  >
                                    Late
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(student.id, "excused")}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                      currentStatus === "excused" 
                                      ? "bg-slate-500 text-white shadow-sm" 
                                      : "text-slate-500 hover:bg-slate-200"
                                    }`}
                                  >
                                    Excused
                                  </button>
                                </div>
                              </td>

                              {/* Static print status badge */}
                              <td className="p-4 hidden print:table-cell text-center font-bold font-mono uppercase">
                                <span className={`text-xs px-2 py-0.5 rounded border ${
                                  currentStatus === "present" ? "text-emerald-700 bg-emerald-50 border-emerald-100" :
                                  currentStatus === "absent" ? "text-rose-700 bg-rose-50 border-rose-100" :
                                  currentStatus === "late" ? "text-amber-700 bg-amber-50 border-amber-100" :
                                  "text-slate-700 bg-slate-50 border-slate-100"
                                }`}>
                                  {currentStatus}
                                </span>
                              </td>

                              {/* Notes Parameter */}
                              <td className="p-4">
                                <input
                                  type="text"
                                  value={studentNotes[student.id] || ""}
                                  onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                  placeholder="Add details (e.g., medical leave...)"
                                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Print Sign-off space */}
                <div className="hidden print:flex justify-between items-end text-xs font-bold text-slate-700 pt-28 pb-8 px-6">
                  <div className="text-center">
                    <div className="w-32 border-t border-slate-400 mx-auto mb-1"></div>
                    <span>Homeroom Class Teacher Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-t border-slate-400 mx-auto mb-1"></div>
                    <span>Authorized Academic Seal</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side Column: Server Logs & Connection parameters */}
            <div className="lg:col-span-4 space-y-6 print:hidden">
              
              {/* Cloud Connection Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">Server Synchronization</span>
                
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Network Sync Status</span>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2.5 py-1 rounded border border-indigo-100">STABLE</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`}></span>
                  <p className="text-xs font-semibold text-slate-500">
                    {isSaved ? "Saved. All active changes written to cloud server." : "Unsaved. Changes pending database sync."}
                  </p>
                </div>

                {!isSaved && (
                  <button
                    onClick={handleSyncDatabase}
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold rounded-lg transition shadow-sm"
                  >
                    {loading ? 'Uploading modifications...' : 'Force System Database Upload'}
                  </button>
                )}
              </div>

              {/* Saved Registries Log feed */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Registry Sync Audit Trail</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {databaseLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No sync entries verified during this session.</p>
                  ) : (
                    databaseLogs.map((log) => (
                      <div key={log.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between items-center font-mono font-bold">
                          <span className="text-indigo-600">{log.id}</span>
                          <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-semibold flex justify-between">
                          <span>{log.class} • {log.date}</span>
                          <span className="text-emerald-700 font-black">{log.presentCount} OK / {log.absentCount} Absent</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. MONTHLY CALENDAR GRID VIEW SUBSECTION */}
        {activeTab === "monthly" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
            
            {/* Context Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Cohort Monthly Attendance Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analyze cohort-wide calendars. <strong className="text-indigo-600">Click any individual cell</strong> to cycle attendance status.
                </p>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
                >
                  {CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Matrix Table container with clean horizontal scroll overflow */}
            <div className="overflow-x-auto max-w-full border border-slate-200 rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900 text-white font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="p-3 pl-5 sticky left-0 bg-slate-900 z-10 border-r border-slate-800">Student Details</th>
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const dayNumber = i + 1;
                      const weekday = getWeekdayLabel(dayNumber);
                      const isWeekend = checkIsWeekend(dayNumber);
                      return (
                        <th 
                          key={i} 
                          className={`p-2 text-center border-r border-slate-800 min-w-[36px] ${
                            isWeekend ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-white'
                          }`}
                        >
                          <span className="block text-[8px] opacity-75 font-mono">{weekday}</span>
                          <span className="block text-xs font-bold font-mono">{dayNumber}</span>
                        </th>
                      );
                    })}
                    <th className="p-3 text-center bg-slate-900 text-indigo-300 font-black min-w-[80px]">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {classStudents.map((st) => {
                    const studentMonthlyRate = getStudentMonthlyRate(st.id);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3 pl-5 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                          {st.name} 
                          <span className="block text-[9px] text-slate-400 font-mono font-bold mt-0.5">{st.id}</span>
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const dayNumber = i + 1;
                          const key = `${st.id}-${dayNumber}`;
                          const status = monthlyRecords[key] || "present";
                          const isWeekend = checkIsWeekend(dayNumber);

                          // Style color assignment matching the targeted state
                          let styleClasses = "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
                          let label = "P";
                          if (status === "absent") {
                            styleClasses = "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200";
                            label = "A";
                          } else if (status === "late") {
                            styleClasses = "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
                            label = "L";
                          } else if (status === "excused") {
                            styleClasses = "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-250";
                            label = "E";
                          }

                          return (
                            <td 
                              key={i} 
                              onClick={() => cycleMonthlyStatus(st.id, dayNumber, st.name)}
                              className={`p-2 text-center border-r border-slate-150 cursor-pointer select-none transition-all ${
                                isWeekend ? 'bg-slate-50/60' : 'bg-white'
                              }`}
                            >
                              <span className={`inline-flex w-7 h-7 rounded-lg border text-xs font-black items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm ${styleClasses}`}>
                                {label}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-3 text-center font-extrabold font-mono text-slate-950 bg-slate-50 border-l border-slate-200">
                          <span className={studentMonthlyRate < 80 ? 'text-rose-600 font-black' : studentMonthlyRate < 90 ? 'text-amber-600' : 'text-emerald-700'}>
                            {studentMonthlyRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Helper Keys */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-wrap gap-6 text-xs font-semibold text-slate-500">
              <span className="text-slate-950 font-black flex items-center">Grid Toggles:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-100 border border-emerald-200 text-emerald-800 font-black flex items-center justify-center text-[10px]">P</span>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-rose-100 border border-rose-200 text-rose-800 font-black flex items-center justify-center text-[10px]">A</span>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-100 border border-amber-200 text-amber-800 font-black flex items-center justify-center text-[10px]">L</span>
                <span>Late</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-black flex items-center justify-center text-[10px]">E</span>
                <span>Excused</span>
              </div>
              <div className="border-l border-slate-300 h-5 self-center mx-1"></div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                <span>Highly Compliant (&gt;90%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                <span>Adequate (80% - 90%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Critical Absentees (&lt;80%)</span>
              </div>
            </div>

          </div>
        )}

        {/* ================= STREAMING_CHUNK:Building the interactive biometric hardware scanner terminal... ================= */}
        {/* 3. BIOMETRIC SYNC TERMINAL SUBSECTION */}
        {activeTab === "biometric" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Terminal Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hardware Gateway IP</span>
                <span className="text-base font-mono font-extrabold text-indigo-600">192.168.10.45</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gateway Status</span>
                <span className={`inline-block text-xs font-black uppercase px-2 py-0.5 mt-1 rounded ${
                  terminalStatus === "Online" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {terminalStatus}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Readers</span>
                <span className="text-base font-bold text-slate-900">4 Active Nodes</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Verified Scans</span>
                <span className="text-base font-bold text-slate-900">
                  {terminalsList.reduce((acc, t) => acc + t.scansCount, 0)} Total
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Interactive Scanner Panel */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Active Biometric Simulator</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulate hardware fingerprint read events. Successfully authenticated scans instantly update the digital class registry.
                  </p>
                </div>

                {/* Simulated Verification Setup Controls */}
                <div className="space-y-3.5 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                      Select Student for Fingerprint Read
                    </label>
                    <select
                      value={scanningStudentId}
                      onChange={(e) => {
                        setScanningStudentId(e.target.value);
                        setActiveScanStatus("Idle");
                        setActiveMatchRate(null);
                      }}
                      disabled={isFingerScanning}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.id}) — {s.class}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2">
                    <span className="text-slate-400 uppercase tracking-wider">Device Node</span>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 text-[11px]">
                      Front Gate Terminal 1
                    </span>
                  </div>
                </div>

                {/* Animated Scanner Visualizer Frame */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4 relative overflow-hidden">
                  
                  {/* Glowing Laser line animated with CSS */}
                  {activeScanStatus === "Scanning" && (
                    <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-[bounce_2s_infinite] z-20"></div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      terminalStatus === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}></span>
                    <span className="text-[9px] font-bold font-mono text-slate-500 uppercase">
                      {terminalStatus}
                    </span>
                  </div>
                  
                  {/* Scanner Indicator Graphic */}
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto transition-colors duration-300 ${
                    activeScanStatus === "Scanning" ? "border-emerald-500 bg-slate-900/50" :
                    activeScanStatus === "Matched" ? "border-emerald-400 bg-emerald-950/20" :
                    activeScanStatus === "Failed" ? "border-rose-500 bg-rose-950/20" :
                    "border-indigo-500 bg-slate-900/80"
                  }`}>
                    {/* Inline Fingerprint SVG */}
                    <svg className={`w-12 h-12 transition-colors duration-300 ${
                      activeScanStatus === "Scanning" ? "text-emerald-400" :
                      activeScanStatus === "Matched" ? "text-emerald-300" :
                      activeScanStatus === "Failed" ? "text-rose-400" :
                      "text-indigo-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 16.52c-.277-.58-.423-1.21-.423-1.87 0-2.52 2.05-4.57 4.57-4.57s4.57 2.05 4.57 4.57c0 .66-.146 1.29-.423 1.87m-8.294 0a7.712 7.712 0 01-.137-1.87c0-3.66 2.97-6.63 6.63-6.63s6.63 2.97 6.63 6.63c0 .64-.09 1.26-.26 1.87m-13.001 0a10.82 10.82 0 01-.06-1.87c0-5.38 4.36-9.75 9.75-9.75s9.75 4.36 9.75 9.75c0 .63-.06 1.24-.18 1.84m-19.32 0C3.06 14.17 3 14.08 3 14c0-5.96 4.84-10.8 10.8-10.8s10.8 4.84 10.8 10.8c0 .08-.06.17-.18.2M12 18v3" />
                    </svg>
                  </div>

                  {/* Recognition Status Messaging block */}
                  <div className="space-y-1 mt-2">
                    <span className="block text-[10px] font-black uppercase text-indigo-400 font-mono tracking-widest">
                      Gateway Terminal Scanner
                    </span>
                    
                    {activeScanStatus === "Scanning" && (
                      <p className="text-xs font-semibold text-emerald-400 animate-pulse">
                        Analyzing biological fingerprint matrix...
                      </p>
                    )}
                    {activeScanStatus === "Matched" && (
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-emerald-400">
                          MATCH GRANTED ({activeMatchRate})
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Direct digital registry successfully synchronized.
                        </p>
                      </div>
                    )}
                    {activeScanStatus === "Failed" && (
                      <p className="text-xs font-extrabold text-rose-500">
                        MUTATION MISMATCH — DENIED
                      </p>
                    )}
                    {activeScanStatus === "Idle" && (
                      <p className="text-xs font-semibold text-slate-300 italic">
                        "Ready to initiate verification read event."
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePerformFingerprintScan}
                  disabled={isFingerScanning}
                  className={`w-full text-white font-bold py-3 px-4 rounded-xl text-xs transition duration-150 shadow-md ${
                    isFingerScanning 
                      ? "bg-slate-400 cursor-not-allowed" 
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {isFingerScanning ? 'Executing Authentication Matrix...' : 'Simulate Fingerprint Scan'}
                </button>
              </div>

              {/* Hardware Gateway Ledger & Device Monitor */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Active hardware reader gateway status list */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-950">Campus Terminal Status Register</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {terminalsList.map((term, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-slate-900">{term.name}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            term.health === "Online" ? "bg-emerald-500" : "bg-slate-300"
                          }`}></span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{term.ip}</p>
                        <div className="flex justify-between items-center text-[10px] pt-1 text-slate-500 font-bold">
                          <span>Scans Today:</span>
                          <span className="font-mono text-slate-900">{term.scansCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Log Streams Feed */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                    <h3 className="text-sm font-black text-slate-900">Live Hardware Authentication Ledger</h3>
                    <span className="text-[10px] bg-slate-150 text-slate-500 font-mono px-2 py-0.5 rounded font-extrabold uppercase animate-pulse">
                      STREAM ACTIVE
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {biometricLogs.map((log, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-950">{log.name}</span>
                            <span className="font-mono text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase font-bold">
                              {log.studentId}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold font-mono">
                            {log.device} • ID: {log.id}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="block font-mono text-xs font-bold text-slate-900">{log.time}</span>
                          <span className="text-[9px] font-bold text-emerald-600 font-mono">
                            Match: {log.match} ({log.status})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 4. STATISTICAL REPORTS & ANALYTICS SUBSECTION */}
        {activeTab === "reports" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-200">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-950">Analytics & Attendance Reports</h3>
              <p className="text-xs text-slate-500 mt-0.5">Generate formal registers, examine average monthly compliance ratios, and track chronic absences.</p>
            </div>

            {/* Analytical Highlights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-lg">📊</span>
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">Chronic Absenteeism Flag</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Sophia Martinez (Grade 9-A) has flagged 3 consecutive absences. Advisory warnings configured.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-lg">⭐</span>
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">Top Class Compliance</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Grade 11-A leads academic cohorts with a staggering 98.2% attendance record for June 2026.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <span className="text-lg">📑</span>
                <div>
                  <h4 className="font-extrabold text-slate-950 text-sm">Report Configuration</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    System registers are compiled every Friday at 4:00 PM for official administrative board audit reviews.
                  </p>
                </div>
              </div>

            </div>

            {/* Document Export Config Block */}
            <div className="p-6 border border-slate-150 rounded-xl bg-slate-50/50 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">Configure Export Parameters</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Class</label>
                  <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="All">All School Classes</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Scope Category</label>
                  <select className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="Standard">Standard Attendance Ledger</option>
                    <option value="Absence">Absence Warning Letters</option>
                    <option value="Biometric">Biometric Match Failure Audit</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => triggerNotification("Generated file compiled. Ready for administrative review.", "success")}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    Build Document Ledger
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}