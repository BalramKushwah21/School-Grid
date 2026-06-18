"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Users2, School, CalendarCheck, Wallet, FileText, Target,
  Plus, Upload, FileSpreadsheet, BellRing, Sparkles, TrendingUp, AlertTriangle,
  Clock, Bus, BookOpen, Gift, Award, MoreVertical
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function PrincipalDashboard() {
  // ==========================================
  // 🗄️ DATABASE INTEGRATION BLUEPRINT
  // Replace this entire state with your GET /api/dashboard payload
  // ==========================================
  const [data, setData] = useState({
    welcome: {
      principalName: "Alex",
      academicYear: "2026-27",
      date: "Thursday, 18 June 2026",
      pendingApprovals: 3,
      urgentNotices: 2,
      newAdmissions: 5
    },
    kpis: [
      { title: "Total Students", value: "2,450", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { title: "Total Teachers", value: "142", icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
      { title: "Total Parents", value: "3,890", icon: Users2, color: "text-purple-600", bg: "bg-purple-50" },
      { title: "Total Classes", value: "48", icon: School, color: "text-cyan-600", bg: "bg-cyan-50" },
      { title: "Today's Attendance", value: "94.2%", icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: "Fee Collection", value: "82%", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
      { title: "Pending Admissions", value: "18", icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
      { title: "Upcoming Exams", value: "3", icon: Target, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
    ],
    charts: {
      studentsByClass: [
        { name: 'Class 8', students: 240 }, { name: 'Class 9', students: 310 },
        { name: 'Class 10', students: 380 }, { name: 'Class 11', students: 290 },
        { name: 'Class 12', students: 260 }
      ],
      attendanceTrend: [
        { day: 'Mon', perc: 94 }, { day: 'Tue', perc: 96 }, { day: 'Wed', perc: 95 },
        { day: 'Thu', perc: 92 }, { day: 'Fri', perc: 97 }
      ],
      revenue: [
        { month: 'Jan', collected: 12 }, { month: 'Feb', collected: 15 },
        { month: 'Mar', collected: 18 }, { month: 'Apr', collected: 22 },
        { month: 'May', collected: 16 }, { month: 'Jun', collected: 15 }
      ],
      gender: [
        { name: 'Male', value: 55, color: '#3b82f6' },
        { name: 'Female', value: 45, color: '#ec4899' }
      ]
    },
    attendanceDonuts: {
      students: [{ name: 'Present', value: 2450, color: '#10b981' }, { name: 'Absent', value: 95, color: '#f1f5f9' }],
      teachers: [{ name: 'Present', value: 140, color: '#6366f1' }, { name: 'Absent', value: 2, color: '#f1f5f9' }],
      staff: [{ name: 'Present', value: 32, color: '#f59e0b' }, { name: 'Absent', value: 1, color: '#f1f5f9' }]
    },
    finance: { collected: "₹15L", pending: "₹4L", expenses: "₹8L", profit: "₹7L", totalDue: "₹19L" },
    aiInsights: [
      { msg: "15 Students have critically low attendance (< 75%)", type: "danger" },
      { msg: "8 Students in Class 10-A may fail Mathematics", type: "warning" },
      { msg: "12 Fee accounts are overdue for 60+ days", type: "warning" },
      { msg: "Class 9-B attendance dropped by 7% this week", type: "danger" }
    ],
    activityFeed: [
      { time: "10:30 AM", title: "Student Admission Added", desc: "Rahul Kumar, Class 6" },
      { time: "11:15 AM", title: "Teacher Attendance Marked", desc: "140/142 Present" },
      { time: "12:10 PM", title: "Fee Received ₹15,000", desc: "Via Online Gateway" },
      { time: "12:45 PM", title: "Exam Schedule Published", desc: "Mid-Terms 2026" }
    ]
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 font-sans text-slate-800">
      
      {/* ==========================================
          SECTION 1: HERO BANNER 
      ========================================== */}
      <div className="bg-[#0b1120] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mt-20 -mr-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Good Morning, Principal {data.welcome.principalName}! 🌅
          </h1>
          <p className="text-slate-400 font-medium flex items-center gap-4">
            <span>Academic Year: {data.welcome.academicYear}</span>
            <span>•</span>
            <span className="text-blue-400">{data.welcome.date}</span>
          </p>
        </div>
        <div className="relative z-10 flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold text-amber-400">{data.welcome.pendingApprovals}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Approvals</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold text-rose-400">{data.welcome.urgentNotices}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Urgent</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold text-emerald-400">{data.welcome.newAdmissions}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">Admissions</p>
          </div>
        </div>
      </div>

      {/* ==========================================
          SECTION 2: KPI CARDS (8 Cards) 
      ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{kpi.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
              <kpi.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          SECTION 3: CHARTS ROW (4 Charts)
      ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Class */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Students by Class</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.studentsByClass}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Last 30 Days Attendance %</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="perc" stroke="#10b981" strokeWidth={4} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-2 text-slate-800">Gender Distribution</h3>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.charts.gender} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {data.charts.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Monthly Revenue Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.revenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="collected" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==========================================
          SECTION 4: QUICK ACTIONS 
      ========================================== */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Admission", icon: Plus, color: "bg-blue-500" },
            { label: "Teacher", icon: UserCheck, color: "bg-indigo-500" },
            { label: "Fee", icon: Wallet, color: "bg-emerald-500" },
            { label: "Notice", icon: BellRing, color: "bg-amber-500" },
            { label: "Exam", icon: FileText, color: "bg-rose-500" },
            { label: "Report", icon: TrendingUp, color: "bg-purple-500" },
          ].map((action, idx) => (
            <button key={idx} className={`${action.color} text-white p-4 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col items-center justify-center gap-3`}>
              <action.icon className="w-6 h-6" />
              <span className="font-bold text-sm tracking-wide">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==========================================
          MASONRY / GRID LAYOUT FOR WIDGETS
      ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Section 14: AI Insights (Premium Feature) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-1 rounded-2xl shadow-md">
            <div className="bg-white rounded-xl p-6 h-full">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                <Sparkles className="w-5 h-5 text-indigo-500" /> AI Executive Insights
              </h3>
              <div className="space-y-3">
                {data.aiInsights.map((insight, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-3.5 rounded-xl border ${insight.type === 'danger' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                    <AlertTriangle className={`w-5 h-5 shrink-0 ${insight.type === 'danger' ? 'text-rose-500' : 'text-amber-500'}`} />
                    <p className="text-sm font-semibold">{insight.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8: Financial Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center justify-between">
              Financial Overview <button className="text-sm text-blue-600 font-semibold hover:underline">View Ledger</button>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Collected</p>
                <p className="text-2xl font-extrabold text-emerald-600">{data.finance.collected}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Pending</p>
                <p className="text-2xl font-extrabold text-rose-600">{data.finance.pending}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Expenses</p>
                <p className="text-2xl font-extrabold text-amber-600">{data.finance.expenses}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Profit</p>
                <p className="text-2xl font-extrabold text-blue-600">{data.finance.profit}</p>
              </div>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden">
              <div className="bg-emerald-500 h-3" style={{width: '65%'}}></div>
              <div className="bg-rose-500 h-3" style={{width: '20%'}}></div>
              <div className="bg-amber-500 h-3" style={{width: '15%'}}></div>
            </div>
            <div className="flex gap-4 mt-3 text-xs font-semibold text-slate-500 justify-center">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Collected</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Pending</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Expenses</span>
            </div>
          </div>

          {/* Multi-widget Row: Top Performers & Pending Approvals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section 5: Pending Approvals */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Pending Approvals</h3>
              <div className="space-y-3">
                {['Pending Admissions (5)', 'Leave Requests (8)', 'Fee Discounts (3)', 'Teacher Approvals (2)'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                    <span className="font-semibold text-slate-700 text-sm">{item}</span>
                    <button className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100">Review</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 10: Top Performers */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Top Performers</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Students</p>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-amber-500"/> 1. Rahul Sharma</p>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1"><Award className="w-4 h-4 text-slate-400"/> 2. Priya Patel</p>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Award className="w-4 h-4 text-amber-700"/> 3. Aman Verma</p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Teachers</p>
                  <p className="text-sm font-semibold text-slate-700">1. Mr. Gupta • 2. Ms. Sharma • 3. Mrs. Singh</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">

          {/* Section 7: Today's Attendance (Donuts) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-slate-800">Today's Attendance</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Students */}
              <div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.attendanceDonuts.students} cx="50%" cy="50%" innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                        {data.attendanceDonuts.students.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs font-bold text-slate-800 -mt-2">Students</p>
                <p className="text-[10px] text-slate-500">2,450 / 95</p>
              </div>
              {/* Teachers */}
              <div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.attendanceDonuts.teachers} cx="50%" cy="50%" innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                        {data.attendanceDonuts.teachers.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs font-bold text-slate-800 -mt-2">Teachers</p>
                <p className="text-[10px] text-slate-500">140 / 2</p>
              </div>
              {/* Staff */}
              <div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.attendanceDonuts.staff} cx="50%" cy="50%" innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                        {data.attendanceDonuts.staff.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs font-bold text-slate-800 -mt-2">Staff</p>
                <p className="text-[10px] text-slate-500">32 / 1</p>
              </div>
            </div>
          </div>

          {/* Section 6: Recent Activity Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Live Timeline</h3>
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
              {data.activityFeed.map((activity, i) => (
                <div key={i} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                  <p className="text-xs font-bold text-blue-600 mb-0.5"><Clock className="w-3 h-3 inline mr-1 -mt-0.5"/>{activity.time}</p>
                  <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: Upcoming Events */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Upcoming Events</h3>
            <div className="space-y-3">
              {[['Science Exhibition', '21 June'], ['Sports Day', '28 June'], ['Unit Test', '5 July'], ['PTM Meeting', '10 July']].map((event, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">{event[0]}</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">{event[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Widgets Row (Birthdays, Transport, Library) */}
          <div className="grid grid-cols-1 gap-4">
            {/* Section 11: Birthdays */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500 text-white rounded-lg"><Gift className="w-5 h-5"/></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Today's Birthdays</p>
                  <p className="text-xs font-semibold text-pink-600">4 Students • 1 Teacher</p>
                </div>
              </div>
            </div>

            {/* Section 12: Transport */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-lg"><Bus className="w-5 h-5"/></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Transport Fleet</p>
                  <p className="text-xs font-semibold text-amber-700">12 Active • 0 Delayed</p>
                </div>
              </div>
            </div>

            {/* Section 13: Library */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-2xl border border-cyan-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500 text-white rounded-lg"><BookOpen className="w-5 h-5"/></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Library Status</p>
                  <p className="text-xs font-semibold text-cyan-700">84 Issued Today • 12 Pending</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}