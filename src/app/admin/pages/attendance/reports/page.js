import React from 'react';
import { defaultTooltipProps } from 'recharts/types/component/Tooltip';

export default function ReportDashboard() {
  
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Analytics</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring real-time registry compliance and status logs.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all">
          Export Full Audit Trail
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Attendance Rate", value: "96.4%", color: "text-indigo-600" },
          { label: "Active Present", value: "1,248", color: "text-emerald-600" },
          { label: "Pending Review", value: "12", color: "text-amber-500" },
          { label: "Critical Absents", value: "3", color: "text-rose-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</span>
            <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Data View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent Terminal Logs</h2>
          <input className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-xs" placeholder="Search ID..." />
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Terminal</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
            {[
              { name: "Alex Smith", term: "Gate 1", time: "08:15 AM", status: "Verified" },
              { name: "Sophia Martinez", term: "Gate 1", time: "08:17 AM", status: "Verified" },
              { name: "Ethan Davis", term: "Lobby 2", time: "08:19 AM", status: "Flagged" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-slate-900 font-bold">{row.name}</td>
                <td className="px-6 py-4">{row.term}</td>
                <td className="px-6 py-4">{row.time}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    row.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

