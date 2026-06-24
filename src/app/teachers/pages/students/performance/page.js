"use client";

import React, { useState, useMemo } from "react";
import { 
  ShieldCheck, Star, AlertTriangle, Clock, BrainCircuit, ChevronDown
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell 
} from "recharts";

// ================= MASTER DYNAMIC DATABASE FOR PORTAL CLASSES =================
const CLASS_PERFORMANCE_DB = {
  "10-A": {
    className: "Class 10 - A",
    summary: { totalStudents: 42, classAverage: 78, attendanceRate: 92, topPerformer: "Rahul Sharma", weakStudents: 5 },
    subjectPerformance: [
      { subject: "Maths", score: 85, fill: "#0d9488" },
      { subject: "Science", score: 78, fill: "#0ea5e9" },
      { subject: "English", score: 72, fill: "#6366f1" },
      { subject: "Hindi", score: 82, fill: "#f59e0b" },
      { subject: "SST", score: 76, fill: "#ec4899" },
    ],
    strongSubject: "Mathematics (85%)",
    weakSubject: "English Literature (72%)",
    attendanceVsMarks: [
      { name: "Rahul", attendance: 98, marks: 92 },
      { name: "Aman", attendance: 95, marks: 88 },
      { name: "Riya", attendance: 80, marks: 65 },
    ],
    monthlyAttendance: [
      { month: "Jan", rate: 90 }, { month: "Feb", rate: 92 }, { month: "Mar", rate: 89 }, { month: "Apr", rate: 94 }, { month: "May", rate: 93 }
    ],
    marksDistribution: [
      { range: "90-100", students: 5 }, { range: "80-89", students: 12 }, { range: "70-79", students: 10 }, { range: "60-69", students: 8 }, { range: "Below 60", students: 7 }
    ],
    topPerformers: [
      { rank: 1, name: "Rahul Sharma", average: "92%" }, { rank: 2, name: "Priya Patel", average: "90%" }, { rank: 3, name: "Aman Verma", average: "88%" }
    ],
    needAttention: [
      { name: "Mohan Das", attendance: "68%", average: "52%" }, { name: "Deepak Kumar", attendance: "72%", average: "48%" }
    ],
    assignmentPerformance: [
      { name: "Submitted On Time", value: 85, color: "#0d9488" }, { name: "Late Submission", value: 10, color: "#eab308" }, { name: "Not Submitted", value: 5, color: "#ef4444" }
    ],
    genderPerformance: [
      { group: "Boys Average", score: 75 }, { group: "Girls Average", score: 82 }
    ],
    examComparison: [
      { exam: "Unit Test 1", average: 72 }, { exam: "Unit Test 2", average: 78 }, { exam: "Half Yearly", average: 81 }, { exam: "Final Exam", average: 84 }
    ],
    insights: [
      { text: "Class attendance improved by 4% this month.", status: "success" },
      { text: "Science is the weakest subject.", status: "warning" },
      { text: "5 students require diagnostic academic support.", status: "danger" },
      { text: "Girls are outperforming boys by a clear margin of 7%.", status: "success" },
      { text: "Assignment completion rate is running at an excellent 95%.", status: "success" }
    ]
  },
  "9-A": {
    className: "Class 9 - A",
    summary: { totalStudents: 38, classAverage: 71, attendanceRate: 88, topPerformer: "Ananya Iyer", weakStudents: 8 },
    subjectPerformance: [
      { subject: "Maths", score: 68, fill: "#0d9488" },
      { subject: "Science", score: 84, fill: "#0ea5e9" },
      { subject: "English", score: 79, fill: "#6366f1" },
      { subject: "Hindi", score: 70, fill: "#f59e0b" },
      { subject: "SST", score: 65, fill: "#ec4899" },
    ],
    strongSubject: "Science (84%)",
    weakSubject: "Social Studies (65%)",
    attendanceVsMarks: [
      { name: "Ananya", attendance: 96, marks: 94 },
      { name: "Vikram", attendance: 91, marks: 82 },
      { name: "Kabir", attendance: 74, marks: 55 },
    ],
    monthlyAttendance: [
      { month: "Jan", rate: 86 }, { month: "Feb", rate: 87 }, { month: "Mar", rate: 85 }, { month: "Apr", rate: 89 }, { month: "May", rate: 88 }
    ],
    marksDistribution: [
      { range: "90-100", students: 3 }, { range: "80-89", students: 8 }, { range: "70-79", students: 14 }, { range: "60-69", students: 7 }, { range: "Below 60", students: 6 }
    ],
    topPerformers: [
      { rank: 1, name: "Ananya Iyer", average: "94%" }, { rank: 2, name: "Aditya Joshi", average: "89%" }, { rank: 3, name: "Sneha Reddy", average: "86%" }
    ],
    needAttention: [
      { name: "Kabir Mehta", attendance: "74%", average: "55%" }, { name: "Rohan Singh", attendance: "70%", average: "51%" }
    ],
    assignmentPerformance: [
      { name: "Submitted On Time", value: 78, color: "#0d9488" }, { name: "Late Submission", value: 14, color: "#eab308" }, { name: "Not Submitted", value: 8, color: "#ef4444" }
    ],
    genderPerformance: [
      { group: "Boys Average", score: 69 }, { group: "Girls Average", score: 73 }
    ],
    examComparison: [
      { exam: "Unit Test 1", average: 65 }, { exam: "Unit Test 2", average: 69 }, { exam: "Half Yearly", average: 70 }, { exam: "Final Exam", average: 71 }
    ],
    insights: [
      { text: "Class 9-A shows high vulnerability in Mathematics concepts.", status: "danger" },
      { text: "Science practical metrics are at an all-time high.", status: "success" },
      { text: "8 students dropped below the minimum academic safety baseline.", status: "danger" },
      { text: "Girls are outperforming boys by 4% in overall aggregates.", status: "success" },
      { text: "Late homework assignments increased by 6% in SST.", status: "warning" }
    ]
  },
  "11-A": {
    className: "Class 11 - A",
    summary: { totalStudents: 45, classAverage: 83, attendanceRate: 94, topPerformer: "Gaurav Malhotra", weakStudents: 2 },
    subjectPerformance: [
      { subject: "Maths", score: 89, fill: "#0d9488" },
      { subject: "Science", score: 81, fill: "#0ea5e9" },
      { subject: "English", score: 85, fill: "#6366f1" },
      { subject: "Hindi", score: 78, fill: "#f59e0b" },
      { subject: "SST", score: 82, fill: "#ec4899" },
    ],
    strongSubject: "Mathematics (89%)",
    weakSubject: "Hindi Language (78%)",
    attendanceVsMarks: [
      { name: "Gaurav", attendance: 99, marks: 96 },
      { name: "Divya", attendance: 97, marks: 93 },
      { name: "Amit", attendance: 78, marks: 59 },
    ],
    monthlyAttendance: [
      { month: "Jan", rate: 93 }, { month: "Feb", rate: 94 }, { month: "Mar", rate: 92 }, { month: "Apr", rate: 96 }, { month: "May", rate: 94 }
    ],
    marksDistribution: [
      { range: "90-100", students: 9 }, { range: "80-89", students: 18 }, { range: "70-79", students: 11 }, { range: "60-69", students: 5 }, { range: "Below 60", students: 2 }
    ],
    topPerformers: [
      { rank: 1, name: "Gaurav Malhotra", average: "96%" }, { rank: 2, name: "Divya Sen", average: "93%" }, { rank: 3, name: "Meera Nair", average: "91%" }
    ],
    needAttention: [
      { name: "Amit Shukla", attendance: "78%", average: "59%" }, { name: "Karan Johar", attendance: "73%", average: "57%" }
    ],
    assignmentPerformance: [
      { name: "Submitted On Time", value: 91, color: "#0d9488" }, { name: "Late Submission", value: 6, color: "#eab308" }, { name: "Not Submitted", value: 3, color: "#ef4444" }
    ],
    genderPerformance: [
      { group: "Boys Average", score: 81 }, { group: "Girls Average", score: 85 }
    ],
    examComparison: [
      { exam: "Unit Test 1", average: 78 }, { exam: "Unit Test 2", average: 81 }, { exam: "Half Yearly", average: 82 }, { exam: "Final Exam", average: 83 }
    ],
    insights: [
      { text: "Excellent submission metrics; 91% of tasks loaded on time.", status: "success" },
      { text: "Maths advanced calculus scores are outstanding.", status: "success" },
      { text: "Only 2 students tracking behind target lines.", status: "success" },
      { text: "Girls retain standard performance variance at 85%.", status: "success" }
    ]
  }
};

export default function ClassPerformanceDashboard() {
  const [selectedClass, setSelectedClass] = useState("10-A");

  // Hook into master record matching key selection
  const activeData = useMemo(() => {
    return CLASS_PERFORMANCE_DB[selectedClass];
  }, [selectedClass]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ================= DYNAMIC CONTROL HEADER ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
              <ShieldCheck size={14} /> Faculty Multi-Cohort Engine Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Class Performance Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Live metrics for <span className="text-teal-700 font-extrabold">{activeData.className}</span>. Select a class to re-route components.
            </p>
          </div>

          {/* Core Dropdown Interactive Selector */}
          <div className="w-full md:w-72 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Cohort</label>
              <span className="text-sm font-bold text-slate-800">Dynamic Mapping</span>
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white px-4 py-2 text-sm font-bold text-teal-800 border border-teal-100 rounded-lg shadow-xs outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            >
              <option value="10-A">Class 10 - A (42 Students)</option>
              <option value="9-A">Class 9 - A (38 Students)</option>
              <option value="11-A">Class 11 - A (45 Students)</option>
            </select>
          </div>
        </div>

        {/* ================= TOP SUMMARY CARDS LAYER ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Enrolment</span>
            <h3 className="text-3xl font-black text-slate-900 mt-2">{activeData.summary.totalStudents}</h3>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">Active Students</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Class Average Score</span>
            <h3 className="text-3xl font-black text-indigo-600 mt-2">{activeData.summary.classAverage}%</h3>
            <span className="text-[11px] text-emerald-600 mt-1 font-bold flex items-center gap-0.5">↑ Baseline Cleared</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <h3 className="text-3xl font-black text-teal-600 mt-2">{activeData.summary.attendanceRate}%</h3>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">Monthly Threshold</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Top Performer</span>
            <h3 className="text-base font-bold text-slate-900 mt-3 truncate">{activeData.summary.topPerformer}</h3>
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">⭐ Rank 1 Holder</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between col-span-2 lg:col-span-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Critical Interventions</span>
            <h3 className="text-3xl font-black text-rose-600 mt-2">{activeData.summary.weakStudents} Std</h3>
            <span className="text-[11px] text-rose-500 font-semibold mt-1">Requires Support</span>
          </div>
        </div>

        {/* ================= MAIN METRICS INTERACTIVE GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Subject-wise Performance Card */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">1. Subject-wise Evaluation Analysis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Average academic standing scores mapped out per discipline.</p>
            </div>
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData.subjectPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subject" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: "bold" }} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="score" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40}>
                    {activeData.subjectPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-slate-50 border rounded-xl grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block font-medium text-slate-400">Class Strong Subject:</span>
                <span className="text-sm font-black text-teal-700">{activeData.strongSubject}</span>
              </div>
              <div>
                <span className="block font-medium text-slate-400">Needs Structural Improvement:</span>
                <span className="text-sm font-black text-indigo-700">{activeData.weakSubject}</span>
              </div>
            </div>
          </div>

          {/* 2. Attendance vs Marks Correlation Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">2. Attendance vs Marks Metric</h3>
              <p className="text-xs text-slate-400 mt-0.5">Correlation between presence and scoring averages.</p>
            </div>
            <div className="h-60 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.attendanceVsMarks} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: "bold" }} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', pt: 10 }} />
                  <Line type="monotone" dataKey="attendance" name="Attendance Rate (%)" stroke="#0d9488" strokeWidth={3} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="marks" name="Average Marks (%)" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 font-medium italic mt-2 text-center bg-slate-50 p-2 rounded-lg">
              💡 Observation: Drops in classroom engagement show direct impact on scoring benchmarks.
            </p>
          </div>

          {/* 3. Monthly Attendance Trend */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900">3. Monthly Attendance Blueprint</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking seasonal cluster attendance parameters.</p>
            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.monthlyAttendance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <YAxis domain={[80, 100]} stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip />
                  <Line type="linear" dataKey="rate" name="Attendance" stroke="#0ea5e9" strokeWidth={2.5} dot={{ strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Marks Distribution Histogram */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900">4. Marks Distribution Spectrum</h3>
            <p className="text-xs text-slate-400 mt-0.5">Measuring cluster volume across scoring brackets.</p>
            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData.marksDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" stroke="#94a3b8" style={{ fontSize: "10px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7. Assignment Performance Pie Chart */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">7. Assignment Execution Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tracking submission metrics across assignments.</p>
            </div>
            <div className="h-44 w-full relative flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activeData.assignmentPerformance} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {activeData.assignmentPerformance.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900">12</span>
                <span className="block text-[8px] uppercase text-slate-400 font-bold tracking-wider">Total Blocks</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] font-semibold text-slate-600">
              {activeData.assignmentPerformance.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: item.color }}></span>{item.name}</span>
                  <span className="font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Top Performers Ledger Table */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <span className="text-sm">⭐</span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">5. Elite Cohort Top Performers</h3>
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <th className="p-3 w-16 text-center">Rank</th>
                    <th className="p-3">Student Identity Name</th>
                    <th className="p-3 text-right pr-6">Academic Score Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {activeData.topPerformers.map((student) => (
                    <tr key={student.rank} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 text-center font-bold text-indigo-600">{student.rank}</td>
                      <td className="p-3 font-bold text-slate-900">{student.name}</td>
                      <td className="p-3 text-right pr-6 font-mono font-bold text-emerald-600">{student.average}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Students Needing Academic Attention Table */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-500" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">6. Priority Academic Assistance Matrix</h3>
              </div>
              <span className="text-[9px] bg-rose-50 border border-rose-100 text-rose-700 font-mono font-bold px-2 py-0.5 rounded">
                Rules: Attendance &lt;75% | Marks &lt;60%
              </span>
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <th className="p-3">Flagged Student Name</th>
                    <th className="p-3 text-center">Current Attendance</th>
                    <th className="p-3 text-right pr-6">Scoring Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {activeData.needAttention.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-emerald-600 font-bold">✓ All students cleared safety thresholds.</td>
                    </tr>
                  ) : (
                    activeData.needAttention.map((student, idx) => (
                      <tr key={idx} className="hover:bg-rose-50/30 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          {student.name}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-rose-600">{student.attendance}</td>
                        <td className="p-3 text-right pr-6 font-mono font-bold text-rose-600">{student.average}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. Gender-wise Performance Micro-Analysis */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">8. Demographics Performance Balance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Average scoring metrics compared between gender cohorts.</p>
            </div>
            <div className="h-44 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData.genderPerformance} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <YAxis dataKey="group" type="category" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0d9488" barSize={24}>
                    {activeData.genderPerformance.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={idx === 0 ? "#3b82f6" : "#ec4899"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 9. Exam Comparison Longitudinal Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-base text-slate-900">9. Cross-Examination Progression Metric</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking class average trajectory across sequential exam terms.</p>
            <div className="h-44 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.examComparison} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="exam" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: "bold" }} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="average" name="Class Average" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================= 10. AUTOMATED QUICK INSIGHTS PANEL ================= */}
          <div className="lg:col-span-12 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="p-1 bg-teal-900/50 rounded text-teal-400 text-sm">💡</span>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-100">10. Autonomous AI Quick Insights Panel</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeData.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  <span className={`text-sm select-none ${
                    insight.status === 'success' ? 'text-emerald-400' : insight.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {insight.status === 'success' ? '✓' : '⚠️'}
                  </span>
                  <p className="text-xs font-semibold text-slate-300 leading-normal">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Sync Footer */}
        <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-xs font-semibold text-center font-mono tracking-wider flex items-center justify-center gap-2">
          <BrainCircuit size={14} className="text-teal-400" />
          ROUTER STATE SYNCED SECURELY WITH COHORT CHANNELS • COCKPIT READY
        </div>

      </div>
    </div>
  );
}