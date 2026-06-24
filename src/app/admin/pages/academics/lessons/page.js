"use client";
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Calendar, CheckCircle2, AlertTriangle, 
  Search, Plus, FileText, BarChart2, Clock, Trash2, X
} from 'lucide-react';

// --- MOCK DATA (Yahan aapka DB se data aayega) ---
const CLASSES = [{ id: "C1", name: "Grade 9-A" }, { id: "C2", name: "Grade 10-A" }];
const SUBJECTS = ["Mathematics", "Physics", "English", "Chemistry"];
const TEACHERS = [
  { id: "TCH-101", name: "Dr. Sarah Jenkins" },
  { id: "TCH-102", name: "Marcus Aurelius" }
];

export default function SyllabusWorkspace() {
  const [activeTab, setActiveTab] = useState("coverage");
  
  // Syllabus & Plans State
  const [syllabus, setSyllabus] = useState([
    { id: "S1", subject: "Mathematics", class: "Grade 9-A", progress: 75, status: "On Track" },
    { id: "S2", subject: "Physics", class: "Grade 9-A", progress: 40, status: "Lagging" }
  ]);

  const [lessonPlans, setLessonPlans] = useState([
    { id: "L1", title: "Introduction to Calculus", teacher: "Dr. Sarah", status: "Pending", class: "Grade 10-A" }
  ]);

  // Derived Metrics
  const metrics = useMemo(() => ({
    total: syllabus.length,
    approved: lessonPlans.filter(p => p.status === "Approved").length,
    pending: lessonPlans.filter(p => p.status === "Pending").length,
    revision: lessonPlans.filter(p => p.status === "Needs Revision").length
  }), [syllabus, lessonPlans]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      
      {/* 1. Header Section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Academic Curriculum Center</h1>
          <p className="text-sm text-slate-500 mt-1">Syllabus tracking & Lesson plan auditing</p>
        </div>
        <button onClick={() => window.print()} className="bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
          Export Report
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Syllabus Coverage" value="68%" icon={<BarChart2 />} color="text-indigo-600" />
        <StatCard title="Approved Plans" value={metrics.approved} icon={<CheckCircle2 />} color="text-emerald-600" />
        <StatCard title="Pending Review" value={metrics.pending} icon={<Clock />} color="text-amber-600" />
        <StatCard title="Revision Needed" value={metrics.revision} icon={<AlertTriangle />} color="text-rose-600" />
      </div>

      {/* 3. Workspace Navigation */}
      <div className="flex gap-6 mb-6 border-b border-slate-200">
        <button onClick={() => setActiveTab("coverage")} className={`pb-3 font-bold text-sm ${activeTab === "coverage" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500"}`}>
          Syllabus Coverage
        </button>
        <button onClick={() => setActiveTab("plans")} className={`pb-3 font-bold text-sm ${activeTab === "plans" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500"}`}>
          Lesson Plan Registry
        </button>
      </div>

      {/* 4. Dynamic Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {activeTab === "coverage" ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                <th className="p-4">Subject</th>
                <th className="p-4">Cohort</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {syllabus.map(item => (
                <tr key={item.id} className="border-b border-slate-50">
                  <td className="p-4 font-bold text-slate-800">{item.subject}</td>
                  <td className="p-4 text-sm font-semibold">{item.class}</td>
                  <td className="p-4"><div className="w-32 bg-slate-100 h-2 rounded-full"><div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.progress}%` }}></div></div></td>
                  <td className="p-4"><span className={`text-[10px] font-black px-2 py-1 rounded-full ${item.status === "On Track" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-4">
             {lessonPlans.map(plan => (
                <div key={plan.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <FileText className="text-slate-400" />
                    <div>
                      <p className="text-sm font-bold">{plan.title}</p>
                      <p className="text-xs text-slate-500">{plan.teacher} • {plan.class}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full">{plan.status}</span>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">{title}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
    </div>
  );
}