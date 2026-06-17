"use client"
import React, { useState, useMemo } from 'react';

const CLASSES = [
  { id: "CLS-9A", name: "Grade 9-A" },
  { id: "CLS-10A", name: "Grade 10-A" },
  { id: "CLS-11A", name: "Grade 11-A" },
  { id: "CLS-12A", name: "Grade 12-A" }
];

const TEACHERS = [
  { id: "TCH-101", name: "Dr. Sarah Jenkins", dept: "Science" },
  { id: "TCH-102", name: "Marcus Aurelius Vance", dept: "Mathematics" },
  { id: "TCH-103", name: "Elena Rostova", dept: "Languages" },
  { id: "TCH-104", name: "Raymond Reddington", dept: "Social Studies" },
  { id: "TCH-105", name: "Dr. Jane Foster", dept: "Engineering" }
];

const SUBJECTS = ["Mathematics", "Calculus", "Physics", "Chemistry", "AP English Literature", "World History", "Computer Science"];

const INITIAL_ASSIGNMENTS = [
  {
    id: "ASM-8821",
    title: "Quantum Physics Semester Review",
    classId: "CLS-11A",
    subject: "Physics",
    teacherId: "TCH-101",
    weightage: 20, // Percent of overall term grade
    dueDate: "2026-06-25",
    totalStudents: 35,
    submittedCount: 32,
    gradedCount: 28,
    status: "Published", // Draft, Published, Graded
    type: "Standardized Exam"
  },
  {
    id: "ASM-4091",
    title: "Advanced Derivatives & Integrals Practice",
    classId: "CLS-12A",
    subject: "Calculus",
    teacherId: "TCH-102",
    weightage: 15,
    dueDate: "2026-06-20",
    totalStudents: 30,
    submittedCount: 30,
    gradedCount: 30,
    status: "Graded",
    type: "Homework Portfolio"
  },
  {
    id: "ASM-5032",
    title: "Shakespearean Soliloquy Rhetorical Analysis",
    classId: "CLS-10A",
    subject: "AP English Literature",
    teacherId: "TCH-103",
    weightage: 10,
    dueDate: "2026-06-28",
    totalStudents: 28,
    submittedCount: 15,
    gradedCount: 0,
    status: "Published",
    type: "Critical Essay"
  },
  {
    id: "ASM-7740",
    title: "Cold War Geopolitical Mapping Project",
    classId: "CLS-9A",
    subject: "World History",
    teacherId: "TCH-104",
    weightage: 25,
    dueDate: "2026-06-15",
    totalStudents: 32,
    submittedCount: 32,
    gradedCount: 12, // Needs principal grading reminder (due passed, only 12 graded)
    status: "Published",
    type: "Term Project"
  }
];

export default function App() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selectedClassId, setSelectedClassId] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Detail Audit Drawer (Null-Safe states)
  const [isAuditorOpen, setIsAuditorOpen] = useState(false);
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);

  // New Assignment Form State (Standardized assessment builder)
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    classId: CLASSES[0].id,
    subject: SUBJECTS[0],
    teacherId: TEACHERS[0].id,
    weightage: 10,
    dueDate: '',
    type: 'Term Project'
  });

  // UI Feedback States
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [dbLogs, setDbLogs] = useState([
    { id: "SYS-091", action: "BOOT_SUCCESS", details: "Assessment compliance monitor online.", timestamp: "08:15 AM" }
  ]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  // Safely find currently selected assignment for detail drawer
  const activeAssignment = useMemo(() => {
    if (!activeAssignmentId) return null;
    return assignments.find(asm => asm.id === activeAssignmentId) || null;
  }, [assignments, activeAssignmentId]);

  // Derived Analytics stats for Principal visual board
  const metrics = useMemo(() => {
    const total = assignments.length;
    let totalSubmissionsExpected = 0;
    let totalSubmissionsDone = 0;
    let totalGraded = 0;
    let highWeightageCount = 0;

    assignments.forEach(asm => {
      totalSubmissionsExpected += asm.totalStudents;
      totalSubmissionsDone += asm.submittedCount;
      totalGraded += asm.gradedCount;
      if (asm.weightage >= 20) highWeightageCount++;
    });

    const submissionRate = totalSubmissionsExpected > 0 
      ? Math.round((totalSubmissionsDone / totalSubmissionsExpected) * 100) 
      : 100;

    const gradingRate = totalSubmissionsDone > 0
      ? Math.round((totalGraded / totalSubmissionsDone) * 100)
      : 100;

    // Estimate Grading Compliance (how many submitted tasks are graded, flagging lags)
    const laggingTasks = assignments.filter(asm => {
      const isPastDue = new Date(asm.dueDate) < new Date();
      const isFullyGraded = asm.gradedCount === asm.submittedCount;
      return isPastDue && !isFullyGraded;
    }).length;

    return { total, submissionRate, gradingRate, highWeightageCount, laggingTasks };
  }, [assignments]);

  // Filters assignments list dynamically
  const filteredAssignments = useMemo(() => {
    return assignments.filter(asm => {
      const matchesClass = selectedClassId === "All" || asm.classId === selectedClassId;
      const matchesType = filterType === "All" || asm.type === filterType;
      return matchesClass && matchesType;
    });
  }, [assignments, selectedClassId, filterType]);

  // Handle database sync for standardized assessment creation
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    
    if (!newAssignment.title || !newAssignment.dueDate) {
      triggerNotification("Please fill in all mandatory descriptor parameters.", "error");
      return;
    }

    const assignedClass = CLASSES.find(c => c.id === newAssignment.classId);
    const targetClassSize = assignedClass ? 30 : 25; // Default fallback size parameter
    const uniqueId = "ASM-" + Math.floor(1000 + Math.random() * 9000);

    const generatedRecord = {
      id: uniqueId,
      title: newAssignment.title,
      classId: newAssignment.classId,
      subject: newAssignment.subject,
      teacherId: newAssignment.teacherId,
      weightage: Number(newAssignment.weightage),
      dueDate: newAssignment.dueDate,
      totalStudents: targetClassSize,
      submittedCount: 0,
      gradedCount: 0,
      status: "Published",
      type: newAssignment.type
    };

    setAssignments(prev => [generatedRecord, ...prev]);
    setIsCreatorOpen(false);
    triggerNotification("Assessment Standardized Blueprint added to registry!", "success");

    setDbLogs(prev => [
      {
        id: "ADD-" + Math.floor(1000 + Math.random() * 9000),
        action: "STD_ASSESSMENT_PUBLISHED",
        details: `Published "${newAssignment.title}" on due date ${newAssignment.dueDate}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    // Reset Form state
    setNewAssignment({
      title: '',
      classId: CLASSES[0].id,
      subject: SUBJECTS[0],
      teacherId: TEACHERS[0].id,
      weightage: 10,
      dueDate: '',
      type: 'Term Project'
    });
  };

  // Mutate specific assignment parameters from detailed drawer
  const handleMutateWeightage = (targetId, nextWeight) => {
    setAssignments(prev => prev.map(asm => {
      if (asm.id === targetId) {
        return { ...asm, weightage: Number(nextWeight) };
      }
      return asm;
    }));

    triggerNotification("Coursework weighting matrix successfully updated.", "success");
    setDbLogs(prev => [
      {
        id: "MUT-" + Math.floor(1000 + Math.random() * 9000),
        action: "WEIGHT_MODIFIED",
        details: `Reference ${targetId} set to weight ${nextWeight}%`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  // Trigger simulated warning compliance alert to teacher
  const triggerGradingReminder = (teacherId, taskTitle) => {
    const teacherName = TEACHERS.find(t => t.id === teacherId)?.name || "Teacher";
    triggerNotification(`Push alert transmitted to ${teacherName} regarding "${taskTitle}".`, "success");
    
    setDbLogs(prev => [
      {
        id: "ALERT-" + Math.floor(1000 + Math.random() * 9000),
        action: "GRADING_LISP_WARNING",
        details: `Emailed grading turn-around reminder to ${teacherName}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  // Delete/Cancel an assessment task
  const handleDeleteTask = (targetId) => {
    setAssignments(prev => prev.filter(asm => asm.id !== targetId));
    setIsAuditorOpen(false);
    triggerNotification("Assessment task removed from registry.", "info");

    setDbLogs(prev => [
      {
        id: "DEL-" + Math.floor(1000 + Math.random() * 9000),
        action: "ASSESSMENT_DELETED",
        details: `Purged index reference: ${targetId}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Toast System Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <span className="text-lg">{notification.type === 'error' ? '⚠️' : '⚙️'}</span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* ================= ADMIN PAGE HEADER ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignment & Assessment Control</h1>
            <p className="text-sm text-slate-500 mt-1">
              Admin & Principal view to schedule standardized tests, audit teacher grading turn-around, and track student workload constraints.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm shadow-sm transition flex items-center gap-2"
            >
              Export Global Registry (PDF)
            </button>
            <button
              onClick={() => setIsCreatorOpen(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 font-bold text-white rounded-lg text-sm shadow-md transition flex items-center gap-2"
            >
              + Standardize Assessment
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT BANNER (PDF LAYOUT ONLY) ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Master Assessment & Assignment Registry Directory</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Active Filter Category: {selectedClassId === "All" ? "All School Cohorts" : CLASSES.find(c => c.id === selectedClassId)?.name}</span>
          <span>Grading Turn-around Compliance: {metrics.gradingRate}%</span>
          <span>Report Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= STREAMING_CHUNK:Rendering metrics statistics widgets... ================= */}
      {/* ================= ANALYTICS METRICS BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Standardized Units</span>
              <span className="text-2xl font-black text-slate-900">{metrics.total} <span className="text-xs font-semibold text-slate-400">Tasks</span></span>
            </div>
            <span className="text-2xl">📝</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Submission Rate</span>
              <span className="text-2xl font-black text-indigo-600">{metrics.submissionRate}%</span>
            </div>
            <span className="text-2xl">📥</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Grading Compliance</span>
              <span className="text-2xl font-black text-emerald-600">{metrics.gradingRate}%</span>
            </div>
            <span className="text-2xl">📈</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Grading Compliance Flags</span>
              <span className={`text-2xl font-black ${metrics.laggingTasks > 0 ? "text-rose-600 animate-pulse" : "text-slate-500"}`}>
                {metrics.laggingTasks} <span className="text-xs font-semibold text-slate-400">Late Tasks</span>
              </span>
            </div>
            <span className="text-2xl">⚠️</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN ASSIGNMENT GRID WORKSPACE ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls Bar & Assignments Directory Table */}
        <section className="lg:col-span-9 space-y-6 print:w-full print:p-0">
          
          {/* Active Class & Type Filtering controllers */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Cohorts:</span>
              <div className="flex gap-1 overflow-x-auto">
                <button
                  onClick={() => setSelectedClassId("All")}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                    selectedClassId === "All" 
                      ? 'bg-slate-900 text-white shadow' 
                      : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  All Cohorts
                </button>
                {CLASSES.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all whitespace-nowrap ${
                      selectedClassId === cls.id 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-auto p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Formats</option>
                <option value="Standardized Exam">Standardized Exam</option>
                <option value="Homework Portfolio">Homework Portfolio</option>
                <option value="Critical Essay">Critical Essay</option>
                <option value="Term Project">Term Project</option>
              </select>
            </div>

          </div>

          {/* Master Assignment Registry Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-800 print:rounded-none">
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider border-b border-slate-950 print:bg-slate-800">
                    <th className="p-4 pl-6">Unit Assessment & Class</th>
                    <th className="p-4">Assigned Mentor</th>
                    <th className="p-4 text-center">Weight (%)</th>
                    <th className="p-4 text-center">Due Timeline</th>
                    <th className="p-4 text-center">Submission Ratio</th>
                    <th className="p-4 text-center">Grading Completion</th>
                    <th className="p-4 text-right pr-6 print:hidden">Action</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-400 italic">
                        No standardized coursework elements found under current descriptor boundaries.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((asm) => {
                      const teacherName = TEACHERS.find(t => t.id === asm.teacherId)?.name || "Teacher";
                      const className = CLASSES.find(c => c.id === asm.classId)?.name || asm.classId;
                      
                      const isPastDue = new Date(asm.dueDate) < new Date();
                      const gradingCompleteRatio = asm.submittedCount > 0 
                        ? Math.round((asm.gradedCount / asm.submittedCount) * 100) 
                        : 0;

                      return (
                        <tr key={asm.id} className="hover:bg-slate-50/50 transition">
                          
                          {/* Unit Title & Class */}
                          <td className="p-4 pl-6">
                            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-0.5">{asm.type}</span>
                            <h4 className="font-extrabold text-slate-900 leading-tight">{asm.title}</h4>
                            <span className="text-[10px] text-slate-400 font-bold font-mono mt-1 block uppercase">
                              {className} • Reference ID: {asm.id}
                            </span>
                          </td>

                          {/* Teacher Mentor */}
                          <td className="p-4">
                            <span className="font-semibold text-slate-800 block">{teacherName}</span>
                            <span className="text-[10px] text-slate-400 font-medium font-mono">{asm.subject}</span>
                          </td>

                          {/* Term Weightage */}
                          <td className="p-4 text-center font-mono font-bold text-slate-900 text-sm">
                            {asm.weightage}%
                          </td>

                          {/* Due Date Status */}
                          <td className="p-4 text-center">
                            <span className="font-mono text-xs text-slate-700 font-bold block">{asm.dueDate}</span>
                            {isPastDue ? (
                              <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 font-bold uppercase rounded inline-block mt-1">
                                Past Due
                              </span>
                            ) : (
                              <span className="text-[9px] bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 font-bold uppercase rounded inline-block mt-1">
                                Active
                              </span>
                            )}
                          </td>

                          {/* Submission Tracker */}
                          <td className="p-4 text-center">
                            <div className="inline-block">
                              <span className="font-mono font-bold text-slate-900">
                                {asm.submittedCount} / {asm.totalStudents}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-semibold">Submitted</span>
                            </div>
                          </td>

                          {/* Grading Progress Visual bar */}
                          <td className="p-4 text-center min-w-[130px]">
                            <div className="flex flex-col items-center">
                              <div className="flex justify-between w-full max-w-[100px] text-[10px] font-bold text-slate-500 mb-1">
                                <span>{gradingCompleteRatio}%</span>
                                <span>Graded</span>
                              </div>
                              <div className="w-full max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    gradingCompleteRatio === 100 
                                      ? "bg-emerald-500" 
                                      : (isPastDue && gradingCompleteRatio < 50) 
                                        ? "bg-rose-500 animate-pulse" 
                                        : "bg-indigo-600"
                                  }`} 
                                  style={{ width: `${gradingCompleteRatio}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* Admin Action Button triggers detailed audit */}
                          <td className="p-4 text-right pr-6 print:hidden">
                            <button
                              onClick={() => {
                                setActiveAssignmentId(asm.id);
                                setIsAuditorOpen(true);
                              }}
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-350 text-xs font-black text-slate-700 rounded-lg transition"
                            >
                              Manage / Audit
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </section>

        {/* ================= STREAMING_CHUNK:Rendering grading compliance ledger sidebar... ================= */}
        {/* RIGHT COLUMN: Grading compliance ledger sidebar & DB sync feed */}
        <section className="lg:col-span-3 space-y-6 print:hidden">
          
          {/* Audit Reminder Dashboard */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Teacher Audit Dashboard</span>
              <h2 className="text-lg font-black text-slate-900 mt-1">Grading Compliance</h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              The Principal's desk monitors tasks that are past due to maintain compliance with standard turn-around policies.
            </p>

            {/* List of outstanding assignments to remind */}
            <div className="space-y-3">
              {assignments.filter(asm => asm.submittedCount > asm.gradedCount && new Date(asm.dueDate) < new Date()).map(asm => {
                const teacherObj = TEACHERS.find(t => t.id === asm.teacherId);
                return (
                  <div key={asm.id} className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-rose-700 uppercase">LAGGING ASSESSMENT</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{asm.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{teacherObj?.name || "Faculty Member"}</p>
                    </div>
                    <button
                      onClick={() => triggerGradingReminder(asm.teacherId, asm.title)}
                      className="mt-2.5 w-full bg-white hover:bg-rose-100 border border-rose-200 text-[10px] font-black uppercase text-rose-700 py-1.5 rounded transition shadow-sm"
                    >
                      Transmit Warning Alert
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIMULATED DATABASE SYNC FEED */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Server Sync Feed</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dbLogs.map((log) => (
                <div key={log.id} className="text-xs bg-slate-50 p-2.5 border border-slate-150 rounded flex justify-between items-center font-mono">
                  <div>
                    <span className="font-bold text-indigo-600 block text-[9px]">{log.id} — {log.action}</span>
                    <span className="text-slate-500 text-[9px] font-sans block mt-0.5">{log.details}</span>
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>

      {/* ================= CRASH-RESISTANT DETAIL AUDIT DRAWER ================= */}
      {/* 
        This modal is strictly guarded against Fast Refresh null pointer crashes.
      */}
      {isAuditorOpen && activeAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-black text-slate-900">Manage Coursework Task</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  ID: {activeAssignment.id} — {activeAssignment.type}
                </p>
              </div>
              <button 
                onClick={() => setIsAuditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Assessment Details Descriptor */}
            <div className="space-y-4 text-xs">
              
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Assignment Title</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{activeAssignment.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Target Class</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {CLASSES.find(c => c.id === activeAssignment.classId)?.name || activeAssignment.classId}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Assigned Teacher</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {TEACHERS.find(t => t.id === activeAssignment.teacherId)?.name || "Teacher"}
                  </p>
                </div>
              </div>

              {/* Dynamic Weightage Mutation slider */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1.5">
                  Term Weighting Model (% of overall grade): {activeAssignment.weightage}%
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  step="5" 
                  value={activeAssignment.weightage}
                  onChange={(e) => handleMutateWeightage(activeAssignment.id, e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-bold mt-1">
                  <span>5% (Quiz / HW)</span>
                  <span>40% (Term Exam)</span>
                </div>
              </div>

              {/* Statistical Progress Box */}
              <div className="bg-slate-900 text-white p-3 rounded-xl">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Coursework Compliance</span>
                <p className="text-xs leading-relaxed text-slate-300 italic mt-1">
                  💡 "{activeAssignment.submittedCount} students submitted, {activeAssignment.gradedCount} graded. Overall grading progress stands at {
                    activeAssignment.submittedCount > 0 ? Math.round((activeAssignment.gradedCount / activeAssignment.submittedCount) * 100) : 0
                  }% compliance."
                </p>
              </div>

              {/* Action Operations Footer */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => handleDeleteTask(activeAssignment.id)}
                  className="flex-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 p-3 font-semibold rounded-lg transition text-sm shadow-sm"
                >
                  Cancel Assessment
                </button>
                <button 
                  onClick={() => setIsAuditorOpen(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow"
                >
                  Close parameters
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= STANDARDIZED ASSESSMENT CREATOR MODAL ================= */}
      {isCreatorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">Push Standardized Coursework</h3>
              <button 
                onClick={() => setIsCreatorOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Standardized Form */}
            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Assessment Unit Title *</label>
                <input 
                  type="text" required value={newAssignment.title} 
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Midterm Lab report / Final Project"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Standardized Category</label>
                  <select 
                    value={newAssignment.type} 
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Standardized Exam">Standardized Exam</option>
                    <option value="Term Project">Term Project</option>
                    <option value="Critical Essay">Critical Essay</option>
                    <option value="Homework Portfolio">Homework Portfolio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Subject Track</label>
                  <select 
                    value={newAssignment.subject} 
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {SUBJECTS.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Assigned Cohort *</label>
                  <select 
                    value={newAssignment.classId} 
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, classId: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {CLASSES.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Due Deadline *</label>
                  <input 
                    type="date" required value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Assigned Evaluator *</label>
                  <select 
                    value={newAssignment.teacherId} 
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, teacherId: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {TEACHERS.map(tch => (
                      <option key={tch.id} value={tch.id}>{tch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Term Weightage (%)</label>
                  <input 
                    type="number" min="5" max="40" step="5" value={newAssignment.weightage}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, weightage: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow mt-2"
              >
                Commit Standardized Assessment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}