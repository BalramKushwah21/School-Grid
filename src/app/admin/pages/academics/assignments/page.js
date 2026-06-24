"use client";
import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Plus, Trash2, Edit, X, 
  CheckCircle, Clock, AlertCircle, Filter, BookOpen, User
} from 'lucide-react';

// --- MOCK DATABASE RELATIONSHIPS ---
// In a real app, fetch these from your Prisma DB
const CLASSES = [
  { id: "CLS-9A", name: "Grade 9-A" },
  { id: "CLS-10A", name: "Grade 10-A" },
  { id: "CLS-11A", name: "Grade 11-A" },
  { id: "CLS-12A", name: "Grade 12-A" }
];

const TEACHERS = [
  { id: "TCH-101", name: "Dr. Sarah Jenkins" },
  { id: "TCH-102", name: "Marcus Aurelius" },
  { id: "TCH-103", name: "Elena Rostova" }
];

const SUBJECTS = ["Physics", "Calculus", "AP English", "World History", "Computer Science"];

export default function AssignmentManagementPage() {
  // ================= STATE MANAGEMENT =================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("All");

  // Main Database State for Assignments
  const [assignments, setAssignments] = useState([
    {
      id: "ASM-8821",
      title: "Quantum Physics Semester Review",
      classId: "CLS-11A",
      subject: "Physics",
      teacherId: "TCH-101",
      weightage: 20,
      dueDate: "2026-06-25",
      type: "Standardized Exam",
      totalStudents: 35,
      submittedCount: 32,
      gradedCount: 28,
    },
    {
      id: "ASM-4091",
      title: "Advanced Derivatives Practice",
      classId: "CLS-12A",
      subject: "Calculus",
      teacherId: "TCH-102",
      weightage: 15,
      dueDate: "2026-05-20", // Past date to show "Lagging" status
      type: "Homework Portfolio",
      totalStudents: 30,
      submittedCount: 30,
      gradedCount: 15, // Not fully graded
    }
  ]);

  // Drawer (Form) State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', classId: CLASSES[0].id, subject: SUBJECTS[0],
    teacherId: TEACHERS[0].id, weightage: 10, dueDate: '', type: 'Term Project'
  });

  // ================= CALCULATED METRICS =================
  const metrics = useMemo(() => {
    let totalExpected = 0;
    let totalSubmitted = 0;
    let laggingTasks = 0;

    assignments.forEach(asm => {
      totalExpected += asm.totalStudents;
      totalSubmitted += asm.submittedCount;
      
      const isPastDue = new Date(asm.dueDate) < new Date();
      if (isPastDue && asm.gradedCount < asm.submittedCount) {
        laggingTasks++;
      }
    });

    const submissionRate = totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;
    return { total: assignments.length, submissionRate, laggingTasks };
  }, [assignments]);

  const filteredAssignments = assignments.filter(asm => {
    const matchesSearch = asm.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "All" || asm.classId === filterClass;
    return matchesSearch && matchesClass;
  });

  // ================= ACTION HANDLERS =================
  const openDrawer = (asm = null) => {
    if (asm) {
      setEditingId(asm.id);
      setFormData({ ...asm });
    } else {
      setEditingId(null);
      setFormData({
        title: '', classId: CLASSES[0].id, subject: SUBJECTS[0],
        teacherId: TEACHERS[0].id, weightage: 10, dueDate: '', type: 'Term Project'
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return alert("Title and Due Date are required!");

    if (editingId) {
      // UPDATE Logic (Prisma db.assignment.update)
      setAssignments(prev => prev.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      // CREATE Logic (Prisma db.assignment.create)
      const newAssignment = {
        ...formData,
        id: `ASM-${Math.floor(1000 + Math.random() * 9000)}`,
        totalStudents: 30, // Mocked total students
        submittedCount: 0,
        gradedCount: 0
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this assessment permanently?")) {
      // DELETE Logic (Prisma db.assignment.delete)
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans flex flex-col relative overflow-hidden">
      
      {/* ===================== HEADER ===================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FileText className="text-indigo-600" size={28} />
            Assessments & Assignments
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage standardized tests, coursework, and grading compliance.</p>
        </div>
        
        <button onClick={() => openDrawer()} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md">
          <Plus size={18} /> Publish New Task
        </button>
      </div>

      {/* ===================== KPI STATS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><BookOpen size={24}/></div>
          <div>
            <div className="text-2xl font-black text-slate-800">{metrics.total}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tasks</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle size={24}/></div>
          <div>
            <div className="text-2xl font-black text-slate-800">{metrics.submissionRate}%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Submission Rate</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-rose-50">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><AlertCircle size={24}/></div>
          <div>
            <div className="text-2xl font-black text-rose-700">{metrics.laggingTasks}</div>
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Lagging Grading</div>
          </div>
        </div>
      </div>

      {/* ===================== CONTROLS ===================== */}
      <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400"/>
          <select 
            value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Classes</option>
            {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* ===================== DATA TABLE ===================== */}
      <div className="bg-white border border-slate-200 rounded-b-2xl shadow-sm overflow-hidden flex-1">
        {filteredAssignments.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center">
             <AlertCircle size={40} className="text-slate-300 mb-3"/>
             <span className="text-slate-500 font-medium">No assessments found.</span>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Assessment Info</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4 text-center">Due Timeline</th>
                  <th className="p-4 text-center">Grading Progress</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAssignments.map((asm) => {
                  const teacherName = TEACHERS.find(t => t.id === asm.teacherId)?.name || "Unknown";
                  const className = CLASSES.find(c => c.id === asm.classId)?.name || asm.classId;
                  const isPastDue = new Date(asm.dueDate) < new Date();
                  const gradeRatio = asm.submittedCount > 0 ? Math.round((asm.gradedCount / asm.submittedCount) * 100) : 0;

                  return (
                    <tr key={asm.id} className="hover:bg-slate-50/50 transition group">
                      <td className="p-4 pl-6">
                        <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded">{asm.type}</span>
                        <h4 className="font-bold text-slate-900 mt-1">{asm.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mt-1">
                          <span className="text-indigo-600">{className}</span> • <span>{asm.subject}</span> • <span>Weight: {asm.weightage}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600"><User size={12}/></div>
                          <span className="font-semibold text-slate-700 text-xs">{teacherName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-xs text-slate-700 font-bold block">{asm.dueDate}</span>
                        {isPastDue && asm.gradedCount < asm.submittedCount ? (
                           <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.5 font-bold uppercase rounded inline-block mt-1">Overdue Check</span>
                        ) : (
                           <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 font-bold uppercase rounded inline-block mt-1">On Track</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-center w-full max-w-[120px] mx-auto">
                          <div className="flex justify-between w-full text-[10px] font-bold text-slate-500 mb-1">
                            <span>{gradeRatio}% Graded</span>
                            <span>{asm.gradedCount}/{asm.submittedCount}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${gradeRatio === 100 ? "bg-emerald-500" : isPastDue ? "bg-rose-500" : "bg-indigo-500"}`} style={{ width: `${gradeRatio}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button onClick={() => openDrawer(asm)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(asm.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors ml-1" title="Delete"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================== SLIDE-OUT DRAWER (DB CRUD FORM) ===================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
      )}
      
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-800">{editingId ? 'Edit Task' : 'Publish New Task'}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Will be immediately synced to database</p>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="assignmentForm" onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Title <span className="text-red-500">*</span></label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white font-semibold">
                  <option value="Standardized Exam">Standardized Exam</option>
                  <option value="Homework Portfolio">Homework</option>
                  <option value="Term Project">Term Project</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date <span className="text-red-500">*</span></label>
                <input type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none font-mono"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Class Cohort</label>
                <select value={formData.classId} onChange={(e) => setFormData({...formData, classId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white font-semibold">
                  {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white font-semibold">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evaluator / Teacher</label>
                <select value={formData.teacherId} onChange={(e) => setFormData({...formData, teacherId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none bg-white font-semibold">
                  {TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Term Weightage (%)</label>
                <input type="number" min="5" max="50" step="5" value={formData.weightage} onChange={(e) => setFormData({...formData, weightage: Number(e.target.value)})} className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none font-mono"/>
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-200 bg-white grid grid-cols-2 gap-3">
           <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
           <button form="assignmentForm" type="submit" className="px-4 py-3 bg-indigo-600 rounded-xl text-white font-bold text-sm hover:bg-indigo-700 shadow-md transition-colors">
             {editingId ? 'Update Record' : 'Commit to DB'}
           </button>
        </div>
      </div>

    </div>
  );
}