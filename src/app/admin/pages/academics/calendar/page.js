"use client"
import React, { useState, useMemo } from 'react';

// Seeded initial academic master calendar records
const INITIAL_EVENTS = [
  {
    id: "EVT-9011",
    title: "Mid-Term Academic Examinations",
    type: "Exam", // Exam, Holiday, PTM, Activity, Assembly
    date: "2026-06-15",
    cohorts: "All Grades",
    description: "Standardized mid-term theoretical evaluations across all core departments.",
    location: "Examination Halls A & B",
    mandatory: true
  },
  {
    id: "EVT-4092",
    title: "National Summer Solstice Break",
    type: "Holiday",
    date: "2026-06-19",
    cohorts: "All Staff & Students",
    description: "Official public holiday. Campus closed except for emergency maintenance.",
    location: "Campus Wide",
    mandatory: true
  },
  {
    id: "EVT-3381",
    title: "Grade 10 Parent-Teacher Conference",
    type: "PTM",
    date: "2026-06-25",
    cohorts: "Grade 10-A, Parents",
    description: "One-on-one session with teachers to discuss academic progress, syllabus tracking, and behavior reports.",
    location: "Main Auditorium",
    mandatory: false
  },
  {
    id: "EVT-1102",
    title: "Annual STEM Exhibition & Science Fair",
    type: "Activity",
    date: "2026-06-12",
    cohorts: "All Grades",
    description: "Interactive robotics, physics models, and chemical reaction trials presented by senior students.",
    location: "Science Complex & Lobby",
    mandatory: false
  },
  {
    id: "EVT-6540",
    title: "Orientation Day & Graduation Assembly",
    type: "Assembly",
    date: "2026-06-30",
    cohorts: "Grade 12-A, Faculty",
    description: "Formal sign-off ceremony and certificate distribution for graduating senior class.",
    location: "Grand Memorial Hall",
    mandatory: true
  },
  {
    id: "EVT-7721",
    title: "National Day Celebration",
    type: "Holiday",
    date: "2026-06-05",
    cohorts: "All Staff & Students",
    description: "National anniversary. Academic instruction suspended.",
    location: "Campus Grounds",
    mandatory: true
  }
];

const EVENT_TYPES = [
  { value: "Exam", label: "Academic Exam", color: "bg-rose-500", text: "text-rose-700", border: "border-rose-200", bg: "bg-rose-50" },
  { value: "Holiday", label: "School Holiday", color: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-200", bg: "bg-emerald-50" },
  { value: "PTM", label: "Parent-Teacher Meet", color: "bg-amber-500", text: "text-amber-700", border: "border-amber-200", bg: "bg-amber-50" },
  { value: "Activity", label: "Co-Curricular Activity", color: "bg-indigo-500", text: "text-indigo-700", border: "border-indigo-200", bg: "bg-indigo-50" },
  { value: "Assembly", label: "General Assembly", color: "bg-purple-500", text: "text-purple-700", border: "border-purple-200", bg: "bg-purple-50" }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function App() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState(INITIAL_EVENTS[0].id);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 18)); // Base simulation date set to June 18, 2026
  const [filterType, setFilterType] = useState("All");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Exam',
    date: '',
    cohorts: 'All Grades',
    description: '',
    location: '',
    mandatory: true
  });

  // Admin Logs & Notification triggers
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [dbLogs, setDbLogs] = useState([
    { id: "SYS-001", action: "BOOT_SUCCESS", details: "Academic Master Calendar system online. Time zone offset checked.", timestamp: "08:15 AM" }
  ]);

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000);
  };

  // Calendar date mapping helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstDayIndex = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);
  
  // Create grids matching the Calendar display table
  const paddingDays = useMemo(() => Array(firstDayIndex).fill(null), [firstDayIndex]);
  const calendarDays = useMemo(() => Array.from({ length: daysInMonth }, (_, idx) => idx + 1), [daysInMonth]);

  // Navigate between months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    // Retain 2026 context since it's the base simulation year
    setCurrentDate(new Date(2026, 5, 18));
  };

  // Retrieve events for a specific day
  const getDayEvents = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(evt => {
      const matchesDate = evt.date === dateStr;
      const matchesFilter = filterType === "All" || evt.type === filterType;
      return matchesDate && matchesFilter;
    });
  };

  // List of all events matching current filters in chronological order
  const filteredAgendaList = useMemo(() => {
    return events
      .filter(evt => {
        const evtDate = new Date(evt.date);
        const matchesMonth = evtDate.getMonth() === month && evtDate.getFullYear() === year;
        const matchesFilter = filterType === "All" || evt.type === filterType;
        return matchesMonth && matchesFilter;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, month, year, filterType]);

  // Safely grab the highlighted active details event
  const activeEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find(evt => evt.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // Academic Conflict Detection engine runs automatically when events change
  const scheduleConflicts = useMemo(() => {
    const conflicts = [];
    const dateMap = {};

    events.forEach(evt => {
      if (!dateMap[evt.date]) dateMap[evt.date] = [];
      dateMap[evt.date].push(evt);
    });

    Object.entries(dateMap).forEach(([dateStr, dayEvts]) => {
      // Rule 1: Cannot have Academic Exams scheduled on public School Holidays
      const hasHoliday = dayEvts.some(e => e.type === 'Holiday');
      const hasExam = dayEvts.some(e => e.type === 'Exam');
      if (hasHoliday && hasExam) {
        conflicts.push({
          id: `CONF-${dateStr}-H`,
          type: "Holiday Clash",
          date: dateStr,
          message: `Academic exam is scheduled on a school holiday (${dateStr}). Verify date settings.`
        });
      }

      // Rule 2: Limit student volume burnout (More than 2 high-priority events in one day)
      if (dayEvts.length > 2) {
        conflicts.push({
          id: `CONF-${dateStr}-V`,
          type: "Congestion Warning",
          date: dateStr,
          message: `Date (${dateStr}) has ${dayEvts.length} active events. This may cause student workload strain.`
        });
      }
    });

    return conflicts;
  }, [events]);

  const handleCreateEvent = (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date) {
      triggerNotification("Complete title and date parameters to dispatch event.", "error");
      return;
    }

    const uniqueId = "EVT-M" + Math.floor(1000 + Math.random() * 9000);
    const finalizedRecord = {
      id: uniqueId,
      ...newEvent,
      mandatory: Boolean(newEvent.mandatory)
    };

    setEvents(prev => [finalizedRecord, ...prev]);
    setSelectedEventId(uniqueId);
    setIsModalOpen(false);
    triggerNotification("Event successfully committed to the Master Academic Calendar!", "success");

    setDbLogs(prev => [
      {
        id: "ADD-" + Math.floor(100 + Math.random() * 900),
        action: "EVENT_COMMITTED_DB",
        details: `Dispatched "${newEvent.title}" on date ${newEvent.date}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    // Reset Form
    setNewEvent({
      title: '',
      type: 'Exam',
      date: '',
      cohorts: 'All Grades',
      description: '',
      location: '',
      mandatory: true
    });
  };

  const handleDeleteEvent = (targetId) => {
    setEvents(prev => prev.filter(e => e.id !== targetId));
    setSelectedEventId(null);
    triggerNotification("Event record removed from calendar directory.", "info");

    setDbLogs(prev => [
      {
        id: "DEL-" + Math.floor(100 + Math.random() * 900),
        action: "EVENT_REMOVED_DB",
        details: `Deleted academic schedule slot ID ${targetId}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Toast Notification Deck */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <span className="text-lg">{notification.type === 'error' ? '⚠️' : '⚙️'}</span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* ================= MASTER HEADER ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Calendar Workspace</h1>
            <p className="text-sm text-slate-500 mt-1">
              Principal and Dean scheduling desk to coordinate terms, structure exam schedules, allocate holidays, and analyze campus planning conflicts.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm shadow-sm transition flex items-center gap-2"
            >
              Export Calendar Master (PDF)
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 font-bold text-white rounded-lg text-sm shadow-md transition flex items-center gap-2"
            >
              + Create Academic Event
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT CERTIFICATE HEADING (PRINT LAYOUT) ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Master Term Scheduling & Operations Agenda</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Active View: {MONTHS[month]} {year}</span>
          <span>Schedules Monitored: {events.length} Master Events</span>
          <span>Date Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= HIGH-LEVEL METRICS STATS ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Term Events</span>
              <span className="text-2xl font-black text-slate-900">{events.length} <span className="text-xs font-semibold text-slate-400">Scheduled</span></span>
            </div>
            <span className="text-2xl">📅</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Public Holidays</span>
              <span className="text-2xl font-black text-emerald-600">{events.filter(e => e.type === 'Holiday').length} Days</span>
            </div>
            <span className="text-2xl">🌴</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Exams Configured</span>
              <span className="text-2xl font-black text-rose-500">{events.filter(e => e.type === 'Exam').length} Blocs</span>
            </div>
            <span className="text-2xl">📝</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Clashes</span>
              <span className={`text-2xl font-black ${scheduleConflicts.length > 0 ? "text-amber-500 animate-pulse" : "text-slate-500"}`}>
                {scheduleConflicts.length} Conflicts
              </span>
            </div>
            <span className="text-2xl">🛡️</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN INTERACTIVE SECTION ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: Interactive Calendar Grid */}
        <section className="lg:col-span-8 space-y-6 print:w-full">
          
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
            
            {/* Monthly Navigation */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevMonth}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-sm transition"
              >
                ◀
              </button>
              <h2 className="text-lg font-black text-slate-900 w-44 text-center">
                {MONTHS[month]} {year}
              </h2>
              <button 
                onClick={handleNextMonth}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-sm transition"
              >
                ▶
              </button>
              <button 
                onClick={handleGoToday}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition ml-1"
              >
                Today (June 18)
              </button>
            </div>

            {/* Quick Status Type Filter */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Grid:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Categories</option>
                <option value="Exam">Academic Exams</option>
                <option value="Holiday">School Holidays</option>
                <option value="PTM">Parent-Teacher Meet</option>
                <option value="Activity">Activities</option>
                <option value="Assembly">Assemblies</option>
              </select>
            </div>

          </div>

          {/* Monthly Matrix Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-800 print:rounded-none">
            
            {/* Days Column Headers */}
            <div className="grid grid-cols-7 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider py-4 text-center print:bg-slate-800">
              {WEEKDAYS.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days cells layout */}
            <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y divide-slate-100 border-t border-slate-100">
              
              {/* Padding empty initial cells */}
              {paddingDays.map((_, idx) => (
                <div key={`pad-${idx}`} className="bg-slate-50/50 min-h-[110px] p-2 print:bg-transparent"></div>
              ))}

              {/* Monthly active cells */}
              {calendarDays.map(day => {
                const dayEventsList = getDayEvents(day);
                
                // Highlight simulator logic for June 18, 2026
                const isToday = day === 18 && month === 5 && year === 2026;

                return (
                  <div
                    key={day}
                    className={`min-h-[110px] p-2 flex flex-col justify-between transition-all relative ${
                      isToday ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    
                    {/* Calendar Day Digit Indicator */}
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-extrabold p-1.5 w-7 h-7 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-indigo-600 text-white font-black shadow-md' : 'text-slate-700'
                      }`}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-100/50 px-1.5 py-0.5 rounded print:hidden">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Compact lists of events inside the cell */}
                    <div className="space-y-1 overflow-y-auto max-h-[70px] pr-1">
                      {dayEventsList.map(evt => {
                        const typeObj = EVENT_TYPES.find(t => t.value === evt.type) || EVENT_TYPES[0];
                        const isHighlighted = evt.id === selectedEventId;

                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventId(evt.id);
                            }}
                            className={`text-[9px] font-bold p-1 rounded border truncate cursor-pointer transition ${
                              isHighlighted 
                                ? 'ring-2 ring-indigo-500 border-indigo-300' 
                                : `${typeObj.bg} ${typeObj.text} ${typeObj.border} hover:scale-[1.02]`
                            }`}
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 bg-current"></span>
                            {evt.title}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* ================= PRINT TABLE VIEW IN PDF PREVIEW ================= */}
          <div className="hidden print:block w-full">
            <h4 className="text-md font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
              Active Agenda Register
            </h4>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Date</th>
                  <th className="p-2 border-r border-slate-300">Event Title</th>
                  <th className="p-2 border-r border-slate-300">Category</th>
                  <th className="p-2 border-r border-slate-300">Target Cohorts</th>
                  <th className="p-2">Campus Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgendaList.map(evt => (
                  <tr key={evt.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300 font-mono font-bold">{evt.date}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">{evt.title}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{evt.type}</td>
                    <td className="p-2 border-r border-slate-300 text-slate-600">{evt.cohorts}</td>
                    <td className="p-2 text-slate-600">{evt.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* RIGHT COMPONENT: Agenda Sidebar, Detail Panel & DB Sync Monitor */}
        <section className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Calendar Detail Audit Deck (Safe Render with optional chaining verification) */}
          {activeEvent ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
              
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border tracking-wider ${
                    EVENT_TYPES.find(t => t.value === activeEvent.type)?.bg || "bg-slate-100"
                  } ${
                    EVENT_TYPES.find(t => t.value === activeEvent.type)?.text || "text-slate-700"
                  } ${
                    EVENT_TYPES.find(t => t.value === activeEvent.type)?.border || "border-slate-200"
                  }`}>
                    {activeEvent.type}
                  </span>
                  
                  {activeEvent.mandatory && (
                    <span className="text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded uppercase tracking-wider">
                      Mandatory
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-950 mt-3 leading-snug">
                  {activeEvent.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono mt-1">
                  Event ID: {activeEvent.id}
                </p>
              </div>

              {/* Data Specifications Grid */}
              <div className="space-y-3.5 text-xs font-semibold leading-relaxed mb-6">
                
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Target Date</span>
                  <span className="font-mono text-slate-900">{activeEvent.date}</span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Deployment Cohorts</span>
                  <span className="text-slate-800">{activeEvent.cohorts}</span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400">Facility Location</span>
                  <span className="text-slate-800">{activeEvent.location || "Not Scheduled"}</span>
                </div>

                <div>
                  <span className="block text-slate-400 mb-1">Schedule Description</span>
                  <p className="font-medium text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-150">
                    "{activeEvent.description || "No supplemental details registered."}"
                  </p>
                </div>

              </div>

              {/* Delete Mutation Operations Button */}
              <button
                onClick={() => handleDeleteEvent(activeEvent.id)}
                className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs p-2.5 rounded-lg transition"
              >
                Delete / Release Schedule Slot
              </button>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center italic text-slate-400">
              Select any calendar event block to audit administrative parameters.
            </div>
          )}

          {/* AUTOMATED CONFLICT ALERTS WIDGET */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Conflict Guardian</h3>
            
            {scheduleConflicts.length === 0 ? (
              <div className="p-3 bg-indigo-50/20 text-indigo-800 text-xs rounded-xl font-medium border border-indigo-100 flex gap-2 items-center">
                <span>🛡️</span>
                <p>No operational clashes detected for {MONTHS[month]} {year}.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {scheduleConflicts.map(conf => (
                  <div key={conf.id} className="p-3 bg-amber-50/50 border border-amber-200 text-amber-800 rounded-xl text-xs flex flex-col gap-1">
                    <span className="font-black uppercase text-[10px] tracking-wider text-amber-700">⚠️ {conf.type}</span>
                    <p className="font-medium leading-relaxed">{conf.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIMULATED DATABASE SYNC FEED LOGS */}
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

      {/* ================= STANDARD CREATOR DIALOG MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">Configure Academic Event</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Event Form */}
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Event Title / Milestone Name *</label>
                <input 
                  type="text" required value={newEvent.title} 
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. End Term Practical Exams / Annual Sports Day"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Event Type Category</label>
                  <select 
                    value={newEvent.type} 
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                  >
                    {EVENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Execution Date *</label>
                  <input 
                    type="date" required value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Target Cohorts</label>
                  <input 
                    type="text" value={newEvent.cohorts}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, cohorts: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. All Grades, Grade 11-A Only"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Campus Location / Hub</label>
                  <input 
                    type="text" value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Auditorium Hall, Physics Lab Annex"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Supplemental Agenda Description</label>
                <textarea 
                  value={newEvent.description} 
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Insert schedule descriptors, materials or prerequisite notifications required..."
                  rows="3"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-slate-600">Mark as Mandatory Attendance</span>
                  <span className="text-[10px] text-slate-400 font-semibold block">Enforces compliance alert badges for assigned cohorts.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={newEvent.mandatory}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, mandatory: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow mt-2"
              >
                Broadcast Event to Master Directory
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}