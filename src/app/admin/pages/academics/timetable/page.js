"use client"
import React, { useState, useMemo } from 'react';

const CLASSES = [
  { id: "CLS-9A", name: "Grade 9-A" },
  { id: "CLS-10A", name: "Grade 10-A" },
  { id: "CLS-11A", name: "Grade 11-A" },
  { id: "CLS-12A", name: "Grade 12-A" }
];

const TEACHERS = [
  { id: "TCH-101", name: "Dr. Sarah Jenkins", subject: "Physics/Science" },
  { id: "TCH-102", name: "Marcus Aurelius Vance", subject: "Calculus/Mathematics" },
  { id: "TCH-103", name: "Elena Rostova", subject: "AP Lit/Languages" },
  { id: "TCH-104", name: "Raymond Reddington", subject: "World History/Social Studies" },
  { id: "TCH-105", name: "Dr. Jane Foster", subject: "Engineering/Chemistry" }
];

const SUBJECTS = [
  "Mathematics", "Calculus", "Physics", "Chemistry", "AP English Literature", "World History", "Physical Education", "Computer Science"
];

const ROOMS = ["Room 101", "Room 204", "Lecture Hall B", "Lab Annex 3", "Gymnasium", "Lab Annex 2"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const PERIODS = [
  { id: 1, time: "08:30 AM - 09:30 AM", label: "Period 1" },
  { id: 2, time: "09:35 AM - 10:35 AM", label: "Period 2" },
  { id: 3, time: "10:40 AM - 11:40 AM", label: "Period 3" },
  { id: 4, time: "11:45 AM - 12:45 PM", label: "Period 4" },
  { id: 5, time: "01:15 PM - 02:15 PM", label: "Period 5" },
  { id: 6, time: "02:20 PM - 03:20 PM", label: "Period 6" }
];

// Seeded initial schedule across classes to show instant data
const INITIAL_TIMETABLE = [
  { id: "slot-1", classId: "CLS-9A", day: "Monday", periodId: 1, subject: "Mathematics", teacherId: "TCH-102", room: "Room 101" },
  { id: "slot-2", classId: "CLS-9A", day: "Monday", periodId: 3, subject: "Physics", teacherId: "TCH-101", room: "Lab Annex 3" },
  { id: "slot-3", classId: "CLS-9A", day: "Wednesday", periodId: 2, subject: "AP English Literature", teacherId: "TCH-103", room: "Room 101" },
  { id: "slot-4", classId: "CLS-10A", day: "Monday", periodId: 1, subject: "World History", teacherId: "TCH-104", room: "Room 204" },
  { id: "slot-5", classId: "CLS-10A", day: "Tuesday", periodId: 4, subject: "Chemistry", teacherId: "TCH-105", room: "Lab Annex 2" },
  { id: "slot-6", classId: "CLS-11A", day: "Monday", periodId: 2, subject: "Calculus", teacherId: "TCH-102", room: "Lecture Hall B" },
  { id: "slot-7", classId: "CLS-12A", day: "Friday", periodId: 5, subject: "Physics", teacherId: "TCH-101", room: "Lab Annex 3" }
];

export default function App() {
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [selectedClassId, setSelectedClassId] = useState("CLS-9A");
  
  // Modal & Drawer State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // { day, periodId }
  const [activeSlotId, setActiveSlotId] = useState(null); // For editing an existing slot
  
  // Form State
  const [formSubject, setFormSubject] = useState(SUBJECTS[0]);
  const [formTeacherId, setFormTeacherId] = useState(TEACHERS[0].id);
  const [formRoom, setFormRoom] = useState(ROOMS[0]);
  
  // Feedback states
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [dbLogs, setDbLogs] = useState([
    { id: "SYS-001", action: "BOOT_SUCCESS", details: "Conflict-checking kernel online. Seed data processed.", timestamp: "10:14 AM" }
  ]);

  // Utility to fire temporary admin alerts
  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  // Checks if a teacher or room is already booked elsewhere in the school at the specified Day and Period
  const checkConflicts = (day, periodId, teacherId, room, excludeSlotId = null) => {
    const conflicts = [];
    
    timetable.forEach(slot => {
      if (slot.id === excludeSlotId) return; // Skip checking the slot we are editing
      
      if (slot.day === day && slot.periodId === Number(periodId)) {
        // Teacher conflict check
        if (slot.teacherId === teacherId) {
          const conflictingClass = CLASSES.find(c => c.id === slot.classId)?.name || slot.classId;
          const teacherName = TEACHERS.find(t => t.id === teacherId)?.name || "Teacher";
          conflicts.push({
            type: "teacher",
            message: `Conflict: ${teacherName} is already scheduled in ${conflictingClass} during Period ${periodId} on ${day}.`
          });
        }
        // Room conflict check
        if (slot.room === room) {
          const conflictingClass = CLASSES.find(c => c.id === slot.classId)?.name || slot.classId;
          conflicts.push({
            type: "room",
            message: `Conflict: Classroom "${room}" is already occupied by ${conflictingClass} during Period ${periodId} on ${day}.`
          });
        }
      }
    });

    return conflicts;
  };

  // Filter timetable slots for currently selected class
  const classTimetable = useMemo(() => {
    return timetable.filter(slot => slot.classId === selectedClassId);
  }, [timetable, selectedClassId]);

  // Derive high-level statistics for the school metrics board
  const metrics = useMemo(() => {
    const totalSlots = timetable.length;
    
    // Room usage index
    const uniqueRoomsUsed = new Set(timetable.map(s => s.room)).size;
    const roomUtilization = Math.round((uniqueRoomsUsed / ROOMS.length) * 100);

    // Busiest teacher computation
    const teacherCounts = {};
    timetable.forEach(s => {
      teacherCounts[s.teacherId] = (teacherCounts[s.teacherId] || 0) + 1;
    });
    let maxHours = 0;
    let busiestTeacherName = "N/A";
    Object.entries(teacherCounts).forEach(([tid, hrs]) => {
      if (hrs > maxHours) {
        maxHours = hrs;
        busiestTeacherName = TEACHERS.find(t => t.id === tid)?.name || "Teacher";
      }
    });

    return { totalSlots, roomUtilization, busiestTeacherName, maxHours };
  }, [timetable]);

  // Handle open cell click (create or edit)
  const handleCellClick = (day, periodId) => {
    const existingSlot = classTimetable.find(s => s.day === day && s.periodId === periodId);
    
    setSelectedCell({ day, periodId });
    
    if (existingSlot) {
      setActiveSlotId(existingSlot.id);
      setFormSubject(existingSlot.subject);
      setFormTeacherId(existingSlot.teacherId);
      setFormRoom(existingSlot.room);
    } else {
      setActiveSlotId(null);
      setFormSubject(SUBJECTS[0]);
      setFormTeacherId(TEACHERS[0].id);
      setFormRoom(ROOMS[0]);
    }
    
    setIsEditorOpen(true);
  };

  // Create or Update Schedule Slot
  const handleSaveSlot = (e) => {
    e.preventDefault();
    
    // Safety guard clause: Prevent crashing if state sync was lost
    if (!selectedCell) return;
    
    const { day, periodId } = selectedCell;

    // Run active conflict engine checks
    const activeConflicts = checkConflicts(day, periodId, formTeacherId, formRoom, activeSlotId);

    if (activeConflicts.length > 0) {
      // Alert administrator about scheduling block
      triggerNotification(activeConflicts[0].message, "error");
      return;
    }

    if (activeSlotId) {
      // UPDATE existing slot
      setTimetable(prev => prev.map(s => {
        if (s.id === activeSlotId) {
          return { ...s, subject: formSubject, teacherId: formTeacherId, room: formRoom };
        }
        return s;
      }));

      triggerNotification("Schedule slot successfully updated!", "success");
      setDbLogs(prev => [
        {
          id: "MUT-" + Math.floor(1000 + Math.random() * 9000),
          action: "SLOT_EDITED",
          details: `${CLASSES.find(c => c.id === selectedClassId)?.name}: Updated ${formSubject} in ${formRoom}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    } else {
      // CREATE brand new slot
      const newSlot = {
        id: "slot-" + Math.floor(1000 + Math.random() * 9000),
        classId: selectedClassId,
        day,
        periodId: Number(periodId),
        subject: formSubject,
        teacherId: formTeacherId,
        room: formRoom
      };

      setTimetable(prev => [...prev, newSlot]);
      triggerNotification("New slot successfully registered!", "success");
      setDbLogs(prev => [
        {
          id: "ADD-" + Math.floor(1000 + Math.random() * 9000),
          action: "SLOT_ADDED",
          details: `${CLASSES.find(c => c.id === selectedClassId)?.name}: Scheduled ${formSubject} for Period ${periodId} (${day})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }

    setIsEditorOpen(false);
  };

  // Delete/Release class slot
  const handleDeleteSlot = () => {
    if (!activeSlotId) return;

    setTimetable(prev => prev.filter(s => s.id !== activeSlotId));
    triggerNotification("Timetable slot successfully released.", "info");
    
    setDbLogs(prev => [
      {
        id: "DEL-" + Math.floor(1000 + Math.random() * 9000),
        action: "SLOT_DELETED",
        details: `Released slot of Grade ${CLASSES.find(c => c.id === selectedClassId)?.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    setIsEditorOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Toast Notification */}
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Timetable Control Center</h1>
            <p className="text-sm text-slate-500 mt-1">
              High-level planner for Principal & Dean to design master academic calendars, handle room reservations, and resolve teacher schedule conflicts.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm shadow-sm transition flex items-center gap-2"
            >
              Export Schedule (PDF)
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT BANNER (PDF LAYOUT ONLY) ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Master Schedule Directory & Conflict Audits</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Active Class: {CLASSES.find(c => c.id === selectedClassId)?.name}</span>
          <span>Room Utilization Rate: {metrics.roomUtilization}%</span>
          <span>Report Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= METRICS STATS BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Slots</span>
              <span className="text-2xl font-black text-slate-900">{metrics.totalSlots} <span className="text-xs font-semibold text-slate-400">Total</span></span>
            </div>
            <span className="text-2xl">📅</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Room Utilization</span>
              <span className="text-2xl font-black text-emerald-600">{metrics.roomUtilization}%</span>
            </div>
            <span className="text-2xl">🏢</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Busiest Educator</span>
              <span className="text-lg font-black text-indigo-600 truncate max-w-[170px] block">{metrics.busiestTeacherName}</span>
              <span className="text-xs font-semibold text-slate-400">({metrics.maxHours} Hours Weekly)</span>
            </div>
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Conflicts Active</span>
              <span className="text-2xl font-black text-slate-500">
                0 <span className="text-xs text-emerald-600 font-bold">Auto Resolved</span>
              </span>
            </div>
            <span className="text-2xl">🛡️</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN DASHBOARD BOARD ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Timetable Planner Grid */}
        <section className="lg:col-span-9 space-y-6 print:w-full print:p-0">
          
          {/* Active Class Switcher Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Select Academic Class:</span>
              <div className="flex gap-2">
                {CLASSES.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-4 py-2 text-sm font-extrabold rounded-lg transition-all ${
                      selectedClassId === cls.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-slate-400 font-semibold font-mono bg-slate-100 px-3 py-1 rounded-full">
              Live Schema: {CLASSES.find(c => c.id === selectedClassId)?.name} View
            </span>
          </div>

          {/* Master Weekly Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-800 print:rounded-none">
            
            {/* Days Column Header */}
            <div className="grid grid-cols-6 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider border-b border-slate-950 text-center py-4 print:bg-slate-800">
              <div className="text-left pl-6 flex items-center">Timings / Days</div>
              {DAYS.map(day => (
                <div key={day} className="flex items-center justify-center font-black">{day}</div>
              ))}
            </div>

            {/* Timetable Rows mapping periods */}
            <div className="divide-y divide-slate-200">
              {PERIODS.map(period => (
                <div key={period.id} className="grid grid-cols-6 min-h-[100px] hover:bg-slate-50/30 transition print:min-h-[85px]">
                  
                  {/* Row Period Detail Header */}
                  <div className="bg-slate-50/50 p-4 flex flex-col justify-center border-r border-slate-100 print:bg-transparent print:border-slate-200">
                    <span className="text-xs font-black text-slate-900">{period.label}</span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">{period.time}</span>
                  </div>

                  {/* Days columns mapping cells */}
                  {DAYS.map(day => {
                    const slot = classTimetable.find(s => s.day === day && s.periodId === period.id);
                    const teacherObj = slot ? TEACHERS.find(t => t.id === slot.teacherId) : null;

                    return (
                      <div
                        key={day}
                        onClick={() => handleCellClick(day, period.id)}
                        className={`p-3 border-r border-slate-100 last:border-r-0 cursor-pointer transition-all duration-200 relative group flex flex-col justify-between print:border-slate-200 print:p-2 ${
                          slot 
                            ? 'bg-indigo-50/25 hover:bg-indigo-50/40 border-l-2 border-l-indigo-600' 
                            : 'hover:bg-slate-100/50 hover:shadow-inner'
                        }`}
                      >
                        {slot ? (
                          <>
                            <div>
                              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1">
                                {slot.subject}
                              </span>
                              <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                                {teacherObj ? teacherObj.name : "Unassigned"}
                              </h4>
                            </div>
                            
                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase font-mono mt-3">
                              <span>{slot.room}</span>
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 font-semibold print:hidden">Edit ✎</span>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-[10px] font-extrabold text-slate-350 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider print:hidden">
                              + Book Slot
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              ))}
            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: Real-time DB mutation ledger */}
        <section className="lg:col-span-3 space-y-6 print:hidden">
          
          {/* Audit Conflicts Quick Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Conflict Guardian</span>
                <h2 className="text-lg font-black text-slate-900 mt-1">Rule Analyzer</h2>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Our active system checks room double-bookings and teacher overload boundaries automatically upon scheduling edits.
              </p>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-900 text-white flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Current Guard Status</span>
              <p className="text-[11px] leading-relaxed text-slate-300 italic">
                ✅ "0 Scheduling conflicts detected across Grade 9-A, 10-A, 11-A, and 12-A registers."
              </p>
            </div>
          </div>

          {/* SIMULATED DB LOGGER VIEW */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Scheduler Logs</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto">
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

      {/* ================= SLOT CONFIGURATION DIALOG / DRAWER ================= */}
      {/* 
        CRITICAL NEXT.JS SAFEGUARD: We check 'isEditorOpen && selectedCell' to completely guard against 
        null-pointer errors if state resets or hot-reloads during developer sessions.
      */}
      {isEditorOpen && selectedCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-black text-slate-900">Configure Class Timing Parameter</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                  {selectedCell.day} — Period {selectedCell.periodId} ({PERIODS.find(p => p.id === selectedCell.periodId)?.time})
                </p>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Config Form */}
            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              
              {/* Select Subject */}
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Academic Subject *</label>
                <select 
                  value={formSubject} 
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                >
                  {SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              {/* Select Teacher */}
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Assigned Teacher *</label>
                <select 
                  value={formTeacherId} 
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                >
                  {TEACHERS.map(tch => (
                    <option key={tch.id} value={tch.id}>{tch.name} ({tch.subject})</option>
                  ))}
                </select>
              </div>

              {/* Select Room */}
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Target Room Code *</label>
                <select 
                  value={formRoom} 
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                >
                  {ROOMS.map(rm => (
                    <option key={rm} value={rm}>{rm}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {activeSlotId && (
                  <button 
                    type="button" 
                    onClick={handleDeleteSlot}
                    className="flex-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 p-3 font-semibold rounded-lg transition text-sm shadow-sm"
                  >
                    Release Slot
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow"
                >
                  {activeSlotId ? 'Commit Parameter' : 'Book Classroom Slot'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}