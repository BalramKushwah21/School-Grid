"use client"
import React, { useState, useMemo } from 'react';

// Pre-populated classes data with rich academic indicators
const INITIAL_CLASSES = [
  {
    id: "CLS-2026-9A",
    name: "Grade 9-A",
    classTeacherId: "TCH-2024-103",
    classTeacherName: "Elena Rostova",
    roomNumber: "Room 101",
    totalStudents: 32,
    averageAttendance: 94, // Percent
    classGpa: 82, // Percent equivalent
    stream: "General Sciences",
    schedule: "08:30 AM - 02:30 PM",
    classRepresentative: "Alex Smith",
    status: "Active"
  },
  {
    id: "CLS-2026-10A",
    name: "Grade 10-A",
    classTeacherId: "TCH-2024-104",
    classTeacherName: "Raymond Reddington",
    roomNumber: "Room 204",
    totalStudents: 28,
    averageAttendance: 87, // Trigger warning (< 90%)
    classGpa: 71, // Trigger warning (< 75%)
    stream: "Pure Humanities",
    schedule: "08:30 AM - 02:30 PM",
    classRepresentative: "Emma Wilson",
    status: "Active"
  },
  {
    id: "CLS-2026-11A",
    name: "Grade 11-A",
    classTeacherId: "TCH-2024-102",
    classTeacherName: "Marcus Aurelius Vance",
    roomNumber: "Lecture Hall B",
    totalStudents: 35,
    averageAttendance: 96,
    classGpa: 89,
    stream: "Calculus & Advanced Physics",
    schedule: "09:00 AM - 03:00 PM",
    classRepresentative: "James Martin",
    status: "Active"
  },
  {
    id: "CLS-2026-12A",
    name: "Grade 12-A",
    classTeacherId: "TCH-2024-101",
    classTeacherName: "Dr. Sarah Jenkins",
    roomNumber: "Lab Annex 3",
    totalStudents: 30,
    averageAttendance: 98,
    classGpa: 93,
    stream: "Biochemistry & Pre-Med",
    schedule: "08:00 AM - 02:00 PM",
    classRepresentative: "Charlotte Garcia",
    status: "Active"
  }
];

// Available teachers list for fast administrative reassignment
const AVAILABLE_TEACHERS = [
  { id: "TCH-2024-101", name: "Dr. Sarah Jenkins", department: "Science" },
  { id: "TCH-2024-102", name: "Marcus Aurelius Vance", department: "Mathematics" },
  { id: "TCH-2024-103", name: "Elena Rostova", department: "Languages" },
  { id: "TCH-2024-104", name: "Raymond Reddington", department: "Social Studies" },
  { id: "TCH-2024-105", name: "Dr. Jane Foster", department: "Engineering" }
];

const STREAMS = ["General Sciences", "Pure Humanities", "Calculus & Advanced Physics", "Biochemistry & Pre-Med", "Commerce & Economics"];

export default function App() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState(INITIAL_CLASSES[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStream, setFilterStream] = useState("All");
  
  // Modals & Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [dbLogs, setDbLogs] = useState([
    { id: "SYS-001", action: "BOOT_SUCCESS", details: "Academic schedule parameters loaded.", timestamp: "10:14 AM" }
  ]);

  // Form payload for new classes
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    classTeacherId: AVAILABLE_TEACHERS[0].id,
    roomNumber: '',
    totalStudents: 25,
    stream: 'General Sciences',
    schedule: '08:30 AM - 02:30 PM',
    classRepresentative: ''
  });

  // Highlight notification utility
  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  // Find Currently Selected Class Object
  const activeClass = useMemo(() => {
    return classes.find(cls => cls.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Handle reassigning teachers from detail panel
  const handleTeacherReassign = (teacherId) => {
    const selectedTeacher = AVAILABLE_TEACHERS.find(t => t.id === teacherId);
    if (!selectedTeacher) return;

    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return { 
          ...cls, 
          classTeacherId: selectedTeacher.id, 
          classTeacherName: selectedTeacher.name 
        };
      }
      return cls;
    }));

    triggerNotification(`Assigned ${selectedTeacher.name} as Class Teacher for ${activeClass.name}`, "info");

    setDbLogs(prev => [
      {
        id: "MUT-" + Math.floor(1000 + Math.random() * 9000),
        action: "TEACHER_REASSIGNED",
        details: `${activeClass.name} assigned to ${selectedTeacher.name}`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  // Handle reassigning room parameters
  const handleRoomMutation = (newRoom) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return { ...cls, roomNumber: newRoom };
      }
      return cls;
    }));

    setDbLogs(prev => [
      {
        id: "MUT-" + Math.floor(1000 + Math.random() * 9000),
        action: "ROOM_REALLOCATED",
        details: `${activeClass.name} moved to ${newRoom}`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  // Handle creation of new class
  const handleCreateClassSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const teacherObj = AVAILABLE_TEACHERS.find(t => t.id === newClassForm.classTeacherId);
    const generatedId = `CLS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const classPayload = {
      id: generatedId,
      name: newClassForm.name,
      classTeacherId: newClassForm.classTeacherId,
      classTeacherName: teacherObj ? teacherObj.name : "Unassigned",
      roomNumber: newClassForm.roomNumber || "TBD",
      totalStudents: Number(newClassForm.totalStudents),
      averageAttendance: 100, // New class default
      classGpa: 100, // New class default
      stream: newClassForm.stream,
      schedule: newClassForm.schedule,
      classRepresentative: newClassForm.classRepresentative || "TBD",
      status: "Active"
    };

    setTimeout(() => {
      setClasses(prev => [...prev, classPayload]);
      setSelectedClassId(generatedId);
      setLoading(false);
      setShowAddModal(false);
      triggerNotification(`${newClassForm.name} successfully registered in system!`, "success");

      setDbLogs(prev => [
        {
          id: "ADD-" + Math.floor(1000 + Math.random() * 9000),
          action: "CLASS_CREATED",
          details: `${classPayload.name} configured in ${classPayload.roomNumber}`,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);

      // Clear Form state
      setNewClassForm({
        name: '',
        classTeacherId: AVAILABLE_TEACHERS[0].id,
        roomNumber: '',
        totalStudents: 25,
        stream: 'General Sciences',
        schedule: '08:30 AM - 02:30 PM',
        classRepresentative: ''
      });
    }, 1000);
  };

  // Derive metrics for high-level principal overview
  const schoolMetrics = useMemo(() => {
    const totalStudents = classes.reduce((sum, c) => sum + c.totalStudents, 0);
    const schoolAvgGpa = Math.round(classes.reduce((sum, c) => sum + c.classGpa, 0) / classes.length);
    const schoolAvgAttendance = Math.round(classes.reduce((sum, c) => sum + c.averageAttendance, 0) / classes.length);
    const warningAlerts = classes.filter(c => c.averageAttendance < 90 || c.classGpa < 75).length;

    return { totalStudents, schoolAvgGpa, schoolAvgAttendance, warningAlerts };
  }, [classes]);

  // Master Filter / Search Processing
  const processedClasses = useMemo(() => {
    return classes.filter(cls => {
      const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            cls.classTeacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            cls.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStream = filterStream === "All" || cls.stream === filterStream;

      return matchesSearch && matchesStream;
    });
  }, [classes, searchTerm, filterStream]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 bg-indigo-50 border-indigo-200 text-indigo-800 animate-in fade-in duration-300">
          <span className="text-lg">⚙️</span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* ================= ADMIN PAGE HEADER ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Classes Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              High-level overview for Admin & Principal to evaluate grade performance, audit classroom schedules, and manage teacher designations.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm shadow-sm transition flex items-center gap-2"
            >
              Export Schedule (PDF)
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 font-bold text-white rounded-lg text-sm shadow-md transition flex items-center gap-2"
            >
              Configure New Class
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT BANNER (PDF LAYOUT ONLY) ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Official Academic Classroom Directory & Performance Audit</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Overall School Attendance Index: {schoolMetrics.schoolAvgAttendance}%</span>
          <span>School Academic Honor Index: {schoolMetrics.schoolAvgGpa}%</span>
          <span>Report Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= METRICS STATS BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrollment</span>
              <span className="text-2xl font-black text-slate-900">{schoolMetrics.totalStudents} <span className="text-xs font-semibold text-slate-400">Students</span></span>
            </div>
            <span className="text-2xl">👥</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">School GPA Average</span>
              <span className="text-2xl font-black text-emerald-600">{schoolMetrics.schoolAvgGpa}%</span>
            </div>
            <span className="text-2xl">📈</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Average Attendance</span>
              <span className="text-2xl font-black text-indigo-600">{schoolMetrics.schoolAvgAttendance}%</span>
            </div>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Flags</span>
              <span className={`text-2xl font-black ${schoolMetrics.warningAlerts > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                {schoolMetrics.warningAlerts} Classes
              </span>
            </div>
            <span className="text-2xl">⚠️</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN DASHBOARD BOARD ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Interactive Class Directory Cards */}
        <section className="lg:col-span-8 space-y-6 print:w-full print:p-0">
          
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
            
            {/* Search inputs */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search class, room or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-slate-50"
              />
            </div>

            {/* Stream Selector Filter */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold w-full md:w-auto overflow-x-auto whitespace-nowrap">
              {["All", "General Sciences", "Pure Humanities", "Biochemistry & Pre-Med"].map(str => (
                <button
                  key={str}
                  onClick={() => setFilterStream(str)}
                  className={`px-3 py-1.5 rounded-md transition ${filterStream === str ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {str === "All" ? "All Streams" : str.split(' ')[0]}
                </button>
              ))}
            </div>

          </div>

          {/* Academic Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
            {processedClasses.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              const hasAlert = cls.averageAttendance < 90 || cls.classGpa < 75;

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`bg-white p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between ${
                    isSelected 
                    ? 'ring-2 ring-indigo-600 border-indigo-150 shadow-md transform scale-[1.01]' 
                    : 'border-slate-200 hover:border-slate-350 shadow-sm'
                  } print:border-none print:shadow-none print:p-0 print:border-b print:pb-6`}
                >
                  
                  {/* Warning Dot Badge */}
                  {hasAlert && (
                    <span className="absolute top-4 right-4 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}

                  <div>
                    {/* Stream Header */}
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block mb-1">
                      {cls.stream}
                    </span>
                    
                    {/* Class Title */}
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-2 flex items-center gap-2">
                      {cls.name}
                      <span className="text-xs font-medium text-slate-400 font-mono">({cls.roomNumber})</span>
                    </h3>

                    {/* Mentors Details */}
                    <p className="text-xs text-slate-500 mb-4 font-semibold">
                      Class Mentor: <span className="text-slate-800">{cls.classTeacherName}</span>
                    </p>

                    {/* Analytics progress trackers */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      
                      {/* Attendance Index */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                          <span>Class Attendance</span>
                          <span className={cls.averageAttendance < 90 ? 'text-rose-500 font-black' : 'text-slate-800'}>
                            {cls.averageAttendance}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${cls.averageAttendance < 90 ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                            style={{ width: `${cls.averageAttendance}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Grade Point Averages */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                          <span>Scholastic Pass Index</span>
                          <span className={cls.classGpa < 75 ? 'text-rose-500 font-black' : 'text-emerald-600 font-black'}>
                            {cls.classGpa}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${cls.classGpa < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${cls.classGpa}%` }}
                          ></div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Print and view metadata footer */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-5 pt-3 border-t border-dashed border-slate-100">
                    <span>Enrolled: {cls.totalStudents} Pupils</span>
                    <span>Representative: {cls.classRepresentative}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </section>

        {/* ================= RIGHT COLUMN: Selected Class Audit / Detail Panel ================= */}
        <section className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Main Inspection Audit Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-4 mb-4">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Class Inspection Audit</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{activeClass.name} Dossier</h2>
                <p className="text-xs text-slate-400 font-bold mt-1 font-mono">CODE ID: {activeClass.id}</p>
              </div>

              {/* Data Rows for Administrative edits */}
              <div className="space-y-4">
                
                {/* Reallocate Room Code */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Reallocate Room Code</label>
                  <input 
                    type="text" 
                    value={activeClass.roomNumber} 
                    onChange={(e) => handleRoomMutation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white font-mono font-bold text-slate-850 outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Change Mentor / Class Teacher */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Change Class Mentor</label>
                  <select
                    value={activeClass.classTeacherId}
                    onChange={(e) => handleTeacherReassign(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 font-semibold text-slate-750 outline-none"
                  >
                    {AVAILABLE_TEACHERS.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>

                {/* Sub Metadata parameters block */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs font-semibold">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Assigned Shift</span>
                    <span className="font-bold text-slate-850 font-mono text-[11px]">{activeClass.schedule.split(' ')[0]} - {activeClass.schedule.split(' ').pop()}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider mb-0.5">Pupil Leader</span>
                    <span className="font-bold text-slate-800">{activeClass.classRepresentative}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Principal Flag Audit Advisory Block */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col gap-2 relative overflow-hidden">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Principal Advisory Action</span>
              {activeClass.averageAttendance < 90 || activeClass.classGpa < 75 ? (
                <p className="text-xs leading-relaxed text-slate-350 italic">
                  ⚠️ "This classroom is underperforming standard metrics. We recommend scheduling an advisory parent-teacher assembly immediately."
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-slate-300 italic">
                  ✅ "Class indicators align perfectly with school compliance benchmarks. No intervention required."
                </p>
              )}
            </div>
          </div>

          {/* SIMULATED DB MUTATION LOGS FEED */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Principal Audit Mutations Logs</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dbLogs.map((log) => (
                <div key={log.id} className="text-xs bg-slate-50 p-2.5 border border-slate-150 rounded flex justify-between items-center font-mono">
                  <div>
                    <span className="font-bold text-indigo-600 block text-[10px]">{log.id} — {log.action}</span>
                    <span className="text-slate-500 text-[10px] font-sans">{log.details}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* ================= NEW CLASS CREATION MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">Configure Class / Grade Parameter</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Config Form */}
            <form onSubmit={handleCreateClassSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Classroom Name (e.g., Grade 10-B) *</label>
                <input 
                  type="text" required value={newClassForm.name} 
                  onChange={(e) => setNewClassForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Grade 10-C"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Assigned Teacher Mentor</label>
                  <select 
                    value={newClassForm.classTeacherId} 
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, classTeacherId: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    {AVAILABLE_TEACHERS.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Assigned Room Code</label>
                  <input 
                    type="text" value={newClassForm.roomNumber} 
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. Room 202"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Stream Track</label>
                  <select 
                    value={newClassForm.stream} 
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, stream: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    {STREAMS.map(str => (
                      <option key={str} value={str}>{str}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Daily Timing Shift</label>
                  <input 
                    type="text" value={newClassForm.schedule} 
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, schedule: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono" 
                    placeholder="08:30 AM - 02:30 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Initial Student Allocation</label>
                  <input 
                    type="number" value={newClassForm.totalStudents} 
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, totalStudents: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Class Representative</label>
                  <input 
                    type="text" value={newClassForm.classRepresentative} 
                    onChange={(e) => setNewClassForm(prev => ({ ...prev, classRepresentative: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 outline-none" 
                    placeholder="Student Name"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow disabled:bg-slate-400 mt-2"
              >
                {loading ? 'Transmitting Configuration...' : 'Commit Classroom to Database'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}