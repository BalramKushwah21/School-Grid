"use client";
import { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserCheck, UserX, Clock, Save, Search, Calendar, CheckCircle, 
  XCircle, Filter, FileText, BarChart3, TrendingUp, HelpCircle, ArrowUpDown, 
  AlertTriangle, ShieldCheck, Activity, Percent, PieChart as PieIcon, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

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

// Premium Research-Based Analytics Datasets
const HISTORICAL_MONTHS_DATA = [
  { name: 'Jan', AttendanceRate: 92, Revenue: 4200, Absentees: 45 },
  { name: 'Feb', AttendanceRate: 94, Revenue: 4500, Absentees: 32 },
  { name: 'Mar', AttendanceRate: 95, Revenue: 4800, Absentees: 28 },
  { name: 'Apr', AttendanceRate: 89, Revenue: 3900, Absentees: 64 },
  { name: 'May', AttendanceRate: 85, Revenue: 3500, Absentees: 85 },
  { name: 'Jun', AttendanceRate: 94, Revenue: 5100, Absentees: 30 },
  { name: 'Jul', AttendanceRate: 93, Revenue: 4900, Absentees: 35 },
  { name: 'Aug', AttendanceRate: 91, Revenue: 4600, Absentees: 48 },
  { name: 'Sep', AttendanceRate: 96, Revenue: 5300, Absentees: 20 },
  { name: 'Oct', AttendanceRate: 95, Revenue: 5200, Absentees: 25 },
  { name: 'Nov', AttendanceRate: 93, Revenue: 5000, Absentees: 38 },
  { name: 'Dec', AttendanceRate: 90, Revenue: 4700, Absentees: 52 },
];

const GENDER_DEMOGRAPHICS = [
  { name: 'Male Students', value: 55, color: '#4f46e5' },
  { name: 'Female Students', value: 45, color: '#ec4899' },
];

const DAY_OF_WEEK_ANALYSIS = [
  { day: 'Monday', rate: 91 },
  { day: 'Tuesday', rate: 95 },
  { day: 'Wednesday', rate: 96 },
  { day: 'Thursday', rate: 94 },
  { day: 'Friday', rate: 88 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("daily"); 
  const [selectedClass, setSelectedClass] = useState("Grade 9-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  
  // Daily register mappings
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
  
  // Monthly calendar configurations
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [monthlyRecords, setMonthlyRecords] = useState(() => {
    const records = {};
    INITIAL_STUDENTS.forEach(student => {
      for (let day = 1; day <= 31; day++) {
        const rand = Math.random();
        records[`${student.id}-${day}`] = rand > 0.92 ? "absent" : rand > 0.85 ? "late" : "present";
      }
    });
    return records;
  });

  // Biometric Terminal states (UNCHANGED as requested)
  const [terminalStatus, setTerminalStatus] = useState("Online"); 
  const [biometricLogs, setBiometricLogs] = useState([
    { id: "BIO-1092", time: "08:15 AM", studentId: "STU-2026-001", name: "Alex Smith", device: "Front Gate Terminal 1", match: "99.4%" },
    { id: "BIO-1093", time: "08:17 AM", studentId: "STU-2026-002", name: "Sophia Martinez", device: "Front Gate Terminal 1", match: "98.7%" },
    { id: "BIO-1094", time: "08:19 AM", studentId: "STU-2026-003", name: "Ethan Davis", device: "Back Lobby Terminal 2", match: "99.1%" }
  ]);

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

  // Comprehensive Student Counter Engine for Monthly Matrix
  const getStudentMonthlyTotals = (studentId) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let totalCounted = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      if (!checkIsWeekend(day)) {
        totalCounted++;
        const status = monthlyRecords[`${studentId}-${day}`] || "present";
        if (status === "present") present++;
        if (status === "absent") absent++;
        if (status === "late") late++;
        if (status === "excused") excused++;
      }
    }
    const standardPresence = present + late + excused;
    const rate = totalCounted > 0 ? Math.round((standardPresence / totalCounted) * 100) : 100;
    return { present, absent, late, excused, rate };
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
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);
      triggerNotification(`Attendance records safely saved for ${selectedClass}`, "success");
      
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      
      {/* Toast Notification Container */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="text-lg">{notification.type === 'success' ? '🚀' : 'ℹ️'}</span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* Main Command Shell Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Workspace</h1>
            <p className="text-sm text-slate-500 mt-1">
              Mark records, inspect global analytics heatmaps, track biometric streams, and compile compliance ledgers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 font-bold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm shadow-sm transition flex items-center gap-2"
            >
              Print Register Copy (PDF)
            </button>
            <button
              onClick={handleSyncDatabase}
              disabled={loading || isSaved}
              className={`px-5 py-2.5 font-bold rounded-lg text-sm transition flex items-center gap-2 shadow-md ${
                isSaved ? 'bg-emerald-600 text-white cursor-default' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? 'Syncing Base...' : isSaved ? '✓ Saved to Database' : 'Commit Register Logs'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-menu Tabs */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="flex flex-wrap border-b border-slate-200">
          {[
            { id: "daily", label: "📋 Daily Attendance Register" },
            { id: "monthly", label: "📅 Monthly Analysis Grid" },
            { id: "biometric", label: "🧬 Biometric Live Terminal" },
            { id: "reports", label: "📈 Statistical Metrics Sheets" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
                activeTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Structural Viewports */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">

        {/* 1. DAILY REGISTRY TERMINAL VIEW */}
        {activeTab === "daily" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            
            {/* Left Filter & Ledger Section */}
            <div className="lg:col-span-8 space-y-6 print:col-span-12 print:w-full">
              
              {/* Context Controllers Panel */}
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
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Target Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setIsSaved(false); }}
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full md:w-72">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search active class records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm font-medium"
                  />
                </div>
              </div>

              {/* Dynamic Status Dashboard Trackers */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:hidden">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registered Enrolment</span>
                  <span className="text-xl font-black text-slate-900">{stats.total}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Present</span>
                  <span className="text-xl font-black text-emerald-600">{stats.present}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Absent</span>
                  <span className="text-xl font-black text-rose-600">{stats.absent}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Late Arrivals</span>
                  <span className="text-xl font-black text-amber-500">{stats.late}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 md:col-span-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Compliance Target</span>
                  <span className="text-xl font-black text-indigo-600">{stats.rate}%</span>
                </div>
              </div>

              {/* Main Student Register Sheet */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
                
                {/* Bulk Actions Interface */}
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

                {/* Core Registry Layout Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-50/50">
                        <th className="p-4 w-16">Roll No</th>
                        <th className="p-4">Student Identity Profile</th>
                        <th className="p-4 w-60 text-center print:hidden">Modify Status Parameters</th>
                        <th className="p-4 hidden print:table-cell text-center">Status</th>
                        <th className="p-4">System Remarks / Compliance Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-12 text-center text-slate-400 italic">
                            No students registered inside the targeted filter matrix scope.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const currentStatus = attendance[student.id] || "present";
                          return (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition">
                              <td className="p-4 font-mono font-black text-slate-400">{student.rollNo}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white ${
                                    student.gender === 'Female' ? 'bg-pink-500' : 'bg-indigo-500'
                                  }`}>
                                    {student.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 leading-tight">{student.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold font-mono">{student.id} • {student.gender}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Interactive Live Status Modifiers */}
                              <td className="p-4 print:hidden">
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg max-w-sm mx-auto">
                                  {['present', 'absent', 'late', 'excused'].map(statusOpt => (
                                    <button
                                      key={statusOpt}
                                      onClick={() => handleStatusChange(student.id, statusOpt)}
                                      className={`flex-1 py-1 text-[10px] capitalize font-bold rounded transition-all ${
                                        currentStatus === statusOpt 
                                        ? statusOpt === 'present' ? "bg-emerald-600 text-white shadow-sm"
                                          : statusOpt === 'absent' ? "bg-rose-600 text-white shadow-sm"
                                          : statusOpt === 'late' ? "bg-amber-500 text-white shadow-sm"
                                          : "bg-slate-600 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-200"
                                      }`}
                                    >
                                      {statusOpt}
                                    </button>
                                  ))}
                                </div>
                              </td>

                              <td className="p-4 hidden print:table-cell text-center font-bold font-mono uppercase">
                                <span className="text-xs px-2 py-0.5 rounded border">{currentStatus}</span>
                              </td>

                              <td className="p-4">
                                <input
                                  type="text"
                                  value={studentNotes[student.id] || ""}
                                  onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                  placeholder="Add diagnostic notes..."
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
              </div>
            </div>

            {/* Right Side Auditing Stream logs Panel */}
            <div className="lg:col-span-4 space-y-6 print:hidden">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">Live Cloud Link Synchronization</span>
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Network Status Gateway</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded border border-emerald-100 font-mono">CONNECTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
                  <p className="text-xs font-semibold text-slate-500">
                    {isSaved ? "All terminal logs successfully committed." : "Unsaved modifications pending data write."}
                  </p>
                </div>
                {!isSaved && (
                  <button
                    onClick={handleSyncDatabase}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold rounded-lg transition shadow-sm"
                  >
                    Force Database Write Upload
                  </button>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Registry Sync Audit Trail</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {databaseLogs.map((log) => (
                    <div key={log.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center font-mono font-bold">
                        <span className="text-indigo-600">{log.id}</span>
                        <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-semibold flex justify-between">
                        <span>{log.class} • {log.date}</span>
                        <span className="text-emerald-700 font-black">{log.presentCount} OK / {log.absentCount} ABS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MONTHLY CALENDAR GRID WITH DYNAMIC RESEARCH GRAPH */}
        {activeTab === "monthly" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Added: Historical Month-wise Performance Trend Graph */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Historical Annual Attendance Trend</h3>
                  <p className="text-xs text-slate-500">Longitudinal analytics tracking average monthly attendance indexes across academic sessions.</p>
                </div>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={14} /> Session Target: 2026-27
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={HISTORICAL_MONTHS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <YAxis domain={[70, 100]} stroke="#94a3b8" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="AttendanceRate" name="Global Presence Ratio (%)" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cohort Matrix Sheet Grid */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Cohort Monthly Attendance Matrix</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Click cells to cycle day records. Weekends are filtered to maintain compliance data integrity.</p>
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

              {/* Grid Sheet Container */}
              <div className="overflow-x-auto max-w-full border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-900 text-white font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="p-3 pl-5 sticky left-0 bg-slate-900性能 z-10 border-r border-slate-800">Student Identity Parameters</th>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const dayNumber = i + 1;
                        return (
                          <th 
                            key={i} 
                            className={`p-2 text-center border-r border-slate-800 min-w-[36px] ${
                              checkIsWeekend(dayNumber) ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-white'
                            }`}
                          >
                            <span className="block text-[8px] opacity-75 font-mono">{getWeekdayLabel(dayNumber)}</span>
                            <span className="block text-xs font-bold font-mono">{dayNumber}</span>
                          </th>
                        );
                      })}
                      <th className="p-3 text-center bg-slate-950 text-indigo-300 font-black min-w-[60px] border-r border-slate-800">P</th>
                      <th className="p-3 text-center bg-slate-950 text-rose-300 font-black min-w-[60px] border-r border-slate-800">A</th>
                      <th className="p-3 text-center bg-slate-950 text-indigo-400 font-black min-w-[80px]">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {classStudents.map((st) => {
                      const calculatedTotals = getStudentMonthlyTotals(st.id);
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-3 pl-5 font-bold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-sm">
                            {st.name} 
                            <span className="block text-[9px] text-slate-400 font-mono font-bold mt-0.5">{st.id}</span>
                          </td>
                          {Array.from({ length: daysInMonth }, (_, i) => {
                            const dayNumber = i + 1;
                            const status = monthlyRecords[`${st.id}-${dayNumber}`] || "present";
                            const isWeekend = checkIsWeekend(dayNumber);

                            let cellStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                            let glyph = "P";
                            if (status === "absent") { cellStyle = "bg-rose-100 text-rose-800 border-rose-200"; glyph = "A"; }
                            else if (status === "late") { cellStyle = "bg-amber-100 text-amber-800 border-amber-200"; glyph = "L"; }
                            else if (status === "excused") { cellStyle = "bg-slate-100 text-slate-700 border-slate-200"; glyph = "E"; }

                            return (
                              <td 
                                key={i} 
                                onClick={() => cycleMonthlyStatus(st.id, dayNumber, st.name)}
                                className={`p-1.5 text-center border-r border-slate-100 cursor-pointer select-none ${isWeekend ? 'bg-slate-50' : 'bg-white'}`}
                              >
                                <span className={`inline-flex w-6 h-6 rounded-md border text-[10px] font-black items-center justify-center shadow-inner ${cellStyle}`}>
                                  {glyph}
                                </span>
                              </td>
                            );
                          })}
                          
                          {/* Dynamically Bound Counters (Present, Absent, % Ratio) */}
                          <td className="p-3 text-center font-bold text-emerald-700 bg-slate-50/50 border-r border-slate-200 font-mono">{calculatedTotals.present + calculatedTotals.late}d</td>
                          <td className="p-3 text-center font-bold text-rose-600 bg-slate-50/50 border-r border-slate-200 font-mono">{calculatedTotals.absent}d</td>
                          <td className="p-3 text-center font-extrabold font-mono text-slate-950 bg-slate-100">
                            <span className={calculatedTotals.rate < 80 ? 'text-rose-600' : calculatedTotals.rate < 90 ? 'text-amber-600' : 'text-emerald-700'}>
                              {calculatedTotals.rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Helper Legend Sheet */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-wrap gap-6 text-xs font-semibold text-slate-500">
                <span className="text-slate-950 font-black flex items-center">Status Indicators:</span>
                <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-emerald-100 border border-emerald-200 text-emerald-800 font-black flex items-center justify-center text-[9px]">P</span><span>Present</span></div>
                <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-rose-100 border border-rose-200 text-rose-800 font-black flex items-center justify-center text-[9px]">A</span><span>Absent</span></div>
                <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-amber-100 border border-amber-200 text-amber-800 font-black flex items-center justify-center text-[9px]">L</span><span>Late</span></div>
                <div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-black flex items-center justify-center text-[9px]">E</span><span>Excused</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 3. BIOMETRIC SYNC TERMINAL MODULE (LEFT UNCHANGED AS ORDERED) */}
        {activeTab === "biometric" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Biometric Terminal Gateway</h3>
                  <p className="text-xs text-slate-500 mt-1">Manage hardware gateways syncing student fingerprint scans with active register entries.</p>
                </div>
                <div className="space-y-3.5 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Gateway Terminal Host</span>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">192.168.10.45</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Hardware Health Status</span>
                    <select
                      value={terminalStatus}
                      onChange={(e) => { setTerminalStatus(e.target.value); triggerNotification(`Terminal set to: ${e.target.value}`, "info"); }}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700 text-xs font-bold"
                    >
                      <option value="Online">Online / Synced</option>
                      <option value="Offline">Offline</option>
                      <option value="Error">Hardware Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${terminalStatus === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                    <span className="text-[8px] font-bold font-mono text-slate-500 uppercase">{terminalStatus}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-900/80 text-lg border border-indigo-500 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">🧬</div>
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-black uppercase text-indigo-400 font-mono tracking-widest">Active Scan Listener</span>
                    <p className="text-xs font-semibold text-slate-300 Logan italic">"Waiting for hardware hardware event authentication stream..."</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    triggerNotification("Simulated biometric payload check event successfully received.", "success");
                    setBiometricLogs(prev => [
                      { id: "LR-" + Math.floor(1000 + Math.random() * 9000), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), studentId: "STU-2026-004", name: "Liam Johnson", device: "Front Gate Terminal 1", match: "99.8%" },
                      ...prev
                    ]);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-lg text-xs transition shadow-sm"
                >
                  Inject Mock Hardware Scan Event
                </button>
              </div>

              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                  <h3 className="text-sm font-black text-slate-900">Live Hardware Authentication Ledger</h3>
                  <span className="text-[10px] bg-slate-150 text-slate-500 font-mono px-2 py-0.5 rounded font-extrabold uppercase">STREAM ACTIVE</span>
                </div>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {biometricLogs.map(log => (
                    <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-950">{log.name}</span>
                          <span className="font-mono text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase font-bold">{log.studentId}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium font-mono">{log.device} • {log.id}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="block font-mono text-xs font-bold text-slate-900">{log.time}</span>
                        <span className="text-[9px] font-bold text-emerald-600 font-mono">Match: {log.match}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. EXPANDED STATISTICAL REPORTS & ANALYTICS WORKSPACE */}
        {activeTab === "reports" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Extended Analytics High-Density KPI Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">📈</div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Mean Index</span>
                  <h3 className="text-xl font-black text-slate-900">92.4%</h3>
                </div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">⏱️</div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peak Arrival Window</span>
                  <h3 className="text-xl font-black text-slate-900">07:55 AM</h3>
                </div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⚠️</div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chronic Risk Flags</span>
                  <h3 className="text-xl font-black text-rose-600">3 Students</h3>
                </div>
              </div>
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl">📬</div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Applications</span>
                  <h3 className="text-xl font-black text-slate-900">12 Pending</h3>
                </div>
              </div>
            </div>

            {/* High-Fidelity Charts Deck Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Chart A: Day-of-Week Absentees Factor */}
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Weekday Compliance Index</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DAY_OF_WEEK_ANALYSIS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                      <YAxis domain={[80, 100]} stroke="#94a3b8" style={{ fontSize: '11px' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Bar dataKey="rate" name="Attendance Rate (%)" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                        {DAY_OF_WEEK_ANALYSIS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.rate < 90 ? '#f43f5e' : '#4f46e5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart B: Demographics Balance Sheet */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Gender Distribution Ratio</h3>
                <div className="h-48 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={GENDER_DEMOGRAPHICS}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {GENDER_DEMOGRAPHICS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-slate-900">{students.length}</span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Bound</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>Male Cohort</span>
                    <span className="font-mono font-bold">55%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>Female Cohort</span>
                    <span className="font-mono font-bold">45%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Systematic Cross-Class Audit Sheet Document */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Cross-Class Compliance Record Sheet</h3>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                    <th className="p-4">Academic Block Division</th>
                    <th className="p-4">Total Registered</th>
                    <th className="p-4">Average Presence</th>
                    <th className="p-4">Excused Leaves</th>
                    <th className="p-4">Audit Evaluation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Grade 9-A</td>
                    <td className="p-4 font-mono">5 Students bound</td>
                    <td className="p-4 text-emerald-600 font-bold font-mono">94.2% Mean rate</td>
                    <td className="p-4 font-mono">2 Active records</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-bold font-mono uppercase text-[9px]">EXCELLENT</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Grade 10-A</td>
                    <td className="p-4 font-mono">5 Students bound</td>
                    <td className="p-4 text-emerald-600 font-bold font-mono">91.8% Mean rate</td>
                    <td className="p-4 font-mono">4 Active records</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-bold font-mono uppercase text-[9px]">COMPLIANT</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Grade 11-A</td>
                    <td className="p-4 font-mono">4 Students bound</td>
                    <td className="p-4 text-amber-650 font-bold font-mono">84.5% Mean rate</td>
                    <td className="p-4 font-mono">6 Active records</td>
                    <td className="p-4"><span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100 font-bold font-mono uppercase text-[9px]">NEEDS AUDIT</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}