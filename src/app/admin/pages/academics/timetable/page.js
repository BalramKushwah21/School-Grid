"use client";
import React, { useState } from "react";
import { 
  CalendarDays, Clock, Plus, Trash2, Edit, Save, 
  User, BookOpen, MapPin, Coffee, Settings2, X
} from "lucide-react";

// --- MOCK DATABASE DATA ---
const CLASSES = ["Class 9 - A", "Class 9 - B", "Class 10 - A", "Class 10 - B"];
const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer", "P.E."];
const TEACHERS = ["Rajesh Sharma", "Anita Desai", "Dr. Vikram Singh", "Pooja Verma", "Karan Johar"];
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetableBuilderPage() {
  // ================= STATE MANAGEMENT =================
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [includeSaturday, setIncludeSaturday] = useState(true);

  // 1. Dynamic Rows (Periods)
  const [periods, setPeriods] = useState([
    { id: "p1", name: "1st Period", startTime: "08:00 AM", endTime: "08:45 AM", isBreak: false },
    { id: "p2", name: "2nd Period", startTime: "08:45 AM", endTime: "09:30 AM", isBreak: false },
    { id: "break1", name: "Lunch Break", startTime: "09:30 AM", endTime: "10:00 AM", isBreak: true },
    { id: "p3", name: "3rd Period", startTime: "10:00 AM", endTime: "10:45 AM", isBreak: false },
  ]);

  // 2. Dynamic Matrix (State storing assignments)
  const [timetable, setTimetable] = useState({
    "Monday_p1": { subject: "Mathematics", teacher: "Rajesh Sharma", room: "R-101" },
    "Monday_p2": { subject: "Science", teacher: "Dr. Vikram Singh", room: "Lab-1" },
  });

  // Modals State
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [periodForm, setPeriodForm] = useState({ id: "", name: "", startTime: "", endTime: "", isBreak: false });

  const [cellModalOpen, setCellModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null); // { day, periodId, key }
  const [cellForm, setCellForm] = useState({ subject: "", teacher: "", room: "" });

  // ================= ACTION HANDLERS =================

  const activeDays = includeSaturday ? WEEK_DAYS : WEEK_DAYS.slice(0, 5);

  // Period (Row) Actions
  const handleSavePeriod = () => {
    if (!periodForm.name || !periodForm.startTime) return alert("Fill required fields!");
    setPeriods([...periods, { ...periodForm, id: `p_${Date.now()}` }]);
    setPeriodModalOpen(false);
  };

  const removePeriod = (id) => {
    if(window.confirm("Delete this period/row?")) {
      setPeriods(periods.filter(p => p.id !== id));
      const newTimetable = { ...timetable };
      Object.keys(newTimetable).forEach(key => { if(key.endsWith(`_${id}`)) delete newTimetable[key]; });
      setTimetable(newTimetable);
    }
  };

  // Cell Actions
  const openCellModal = (day, periodId) => {
    const key = `${day}_${periodId}`;
    setActiveCell({ day, periodId, key });
    setCellForm(timetable[key] || { subject: SUBJECTS[0], teacher: TEACHERS[0], room: "" });
    setCellModalOpen(true);
  };

  const saveCellAssignment = () => {
    if (!activeCell) return; // 🛠️ FIX: Safety check added
    setTimetable({ ...timetable, [activeCell.key]: cellForm });
    setCellModalOpen(false);
  };

  const clearCellAssignment = () => {
    if (!activeCell) return; // 🛠️ FIX: Safety check added
    const newTimetable = { ...timetable };
    delete newTimetable[activeCell.key];
    setTimetable(newTimetable);
    setCellModalOpen(false);
  };

  const saveTimetableToDB = () => {
    console.log("Saving Timetable Layout:", { class: selectedClass, periods, timetable });
    alert("✨ Timetable Saved Successfully to Database!");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans flex flex-col">
      
      {/* ===================== HEADER & CONTROLS ===================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <CalendarDays className="text-indigo-600" size={28} />
            Master Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Design periods, assign teachers, and manage schedules dynamically.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
           <span className="text-xs font-bold text-slate-500 pl-2">Select Class:</span>
           <select 
              value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
           >
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <button onClick={() => { setPeriodForm({ name: "", startTime: "", endTime: "", isBreak: false }); setPeriodModalOpen(true); }} 
              className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-200">
             <Plus size={16} /> Add Period / Row
           </button>
           <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-600">
              <input type="checkbox" checked={includeSaturday} onChange={(e) => setIncludeSaturday(e.target.checked)} className="w-4 h-4 accent-indigo-600"/>
              Include Saturday (6 Days)
           </label>
        </div>
        <button onClick={saveTimetableToDB} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
          <Save size={16} /> Save Timetable
        </button>
      </div>

      {/* ===================== TIMETABLE GRID (MATRIX) ===================== */}
      <div className="bg-white border border-slate-200 rounded-b-2xl shadow-sm overflow-x-auto flex-1 custom-scrollbar pb-6">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-900 text-white border-b-4 border-indigo-500">
              <th className="p-4 text-sm font-bold w-48 border-r border-slate-700 text-center uppercase tracking-wider">Time / Period</th>
              {activeDays.map(day => (
                <th key={day} className="p-4 text-sm font-bold text-center border-r border-slate-700 w-48 uppercase tracking-wider">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
               <tr><td colSpan={activeDays.length + 1} className="p-12 text-center text-slate-400 font-medium italic">No periods added yet. Click "Add Period" to build grid.</td></tr>
            ) : (
              periods.map((period) => (
                <tr key={period.id} className="border-b border-slate-200 group/row hover:bg-slate-50 transition-colors">
                  
                  {/* Row Header (Period Info) */}
                  <td className="p-3 border-r border-slate-200 bg-slate-50 align-top relative">
                    <button onClick={() => removePeriod(period.id)} className="absolute top-1 right-1 p-1 text-slate-400 hover:text-red-600 bg-white rounded opacity-0 group-hover/row:opacity-100 transition-opacity shadow-sm"><Trash2 size={12}/></button>
                    <div className="font-black text-slate-800 text-sm mb-1">{period.name}</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 font-mono bg-white inline-flex px-2 py-1 rounded border border-slate-200">
                       <Clock size={12} className="text-indigo-500"/> {period.startTime} - {period.endTime}
                    </div>
                  </td>

                  {/* Columns (Days Mapping) */}
                  {period.isBreak ? (
                    <td colSpan={activeDays.length} className="bg-amber-50/50 p-4 border-r border-slate-200 text-center">
                       <div className="flex flex-col items-center justify-center text-amber-600 font-black tracking-widest uppercase">
                          <Coffee size={24} className="mb-2 opacity-50"/>
                          {period.name}
                       </div>
                    </td>
                  ) : (
                    activeDays.map(day => {
                      const key = `${day}_${period.id}`;
                      const cellData = timetable[key];
                      
                      return (
                        <td key={key} className="p-2 border-r border-slate-200 align-top">
                          {cellData ? (
                            // Filled Cell
                            <div onClick={() => openCellModal(day, period.id)} className="bg-white border border-indigo-200 rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-indigo-400 group h-full">
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-black text-slate-800 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{cellData.subject}</span>
                                  <Edit size={12} className="text-slate-300 group-hover:text-indigo-500"/>
                               </div>
                               <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 mb-1">
                                  <User size={12} className="text-slate-400"/> {cellData.teacher}
                               </div>
                               {cellData.room && (
                                 <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                    <MapPin size={10} className="text-rose-400"/> Room: {cellData.room}
                                 </div>
                               )}
                            </div>
                          ) : (
                            // Empty Cell (Add Button)
                            <div onClick={() => openCellModal(day, period.id)} className="h-full min-h-[80px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer transition-all">
                               <Plus size={20} />
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== MODALS ===================== */}
      
      {/* 1. Add Period Modal */}
      {periodModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-black text-slate-800 text-lg">Add New Period / Row</h3>
                <button onClick={() => setPeriodModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Period Name</label>
                  <input type="text" value={periodForm.name} onChange={e => setPeriodForm({...periodForm, name: e.target.value})} placeholder="e.g. 1st Period or Lunch" className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Time</label>
                    <input type="time" value={periodForm.startTime} onChange={e => setPeriodForm({...periodForm, startTime: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Time</label>
                    <input type="time" value={periodForm.endTime} onChange={e => setPeriodForm({...periodForm, endTime: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
                  </div>
                </div>
                <label className="flex items-center gap-2 p-3 border border-amber-200 bg-amber-50 rounded-xl cursor-pointer">
                   <input type="checkbox" checked={periodForm.isBreak} onChange={e => setPeriodForm({...periodForm, isBreak: e.target.checked})} className="w-4 h-4 accent-amber-600"/>
                   <span className="text-sm font-bold text-amber-800 flex items-center gap-2"><Coffee size={16}/> This is a Break / Recess</span>
                </label>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button onClick={() => setPeriodModalOpen(false)} className="px-4 py-2 font-bold text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSavePeriod} className="px-5 py-2 font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-md transition-colors">Save Period</button>
             </div>
          </div>
        </div>
      )}

      {/* 2. Assign Cell (Subject/Teacher) Modal */}
      {/* 🛠️ FIX: Added `activeCell &&` so it never renders if activeCell is null */}
      {cellModalOpen && activeCell && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white w-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
             <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                <div>
                   <h3 className="font-black text-lg">Assign Subject</h3>
                   <p className="text-xs font-medium text-indigo-100 opacity-90">{activeCell.day} • Period Mapping</p>
                </div>
                <button onClick={() => setCellModalOpen(false)} className="text-indigo-200 hover:text-white"><X size={20}/></button>
             </div>
             
             <div className="p-6 space-y-5 bg-slate-50">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                  <select value={cellForm.subject} onChange={e => setCellForm({...cellForm, subject: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 bg-white">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teacher</label>
                  <select value={cellForm.teacher} onChange={e => setCellForm({...cellForm, teacher: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 bg-white">
                    {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room No. (Optional)</label>
                  <input type="text" value={cellForm.room} onChange={e => setCellForm({...cellForm, room: e.target.value})} placeholder="e.g. Lab-1 or Room 204" className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-white"/>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-200 bg-white flex justify-between items-center">
                <button onClick={clearCellAssignment} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"><Trash2 size={14}/> Clear Cell</button>
                <div className="flex gap-2">
                   <button onClick={() => setCellModalOpen(false)} className="px-4 py-2 font-bold text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                   <button onClick={saveCellAssignment} className="px-5 py-2 font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-md transition-colors">Assign</button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}