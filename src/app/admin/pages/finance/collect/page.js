"use client";
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Phone, User, IndianRupee, Download, Bus, X, Eye } from 'lucide-react';

// 🗄️ 1. MOCK DATABASE: Routes & Villages Mapping
const ROUTE_DATA = [
  { id: 'Route A', villages: ['X Village', 'Y Village', 'Z Sector'] },
  { id: 'Route B', villages: ['C Village', 'F Village', 'D Village'] },
  { id: 'Route C', villages: ['City Center', 'North Avenue'] },
];

// 🗄️ 2. MOCK DATABASE: Updated with new Class formats
const initialStudents = [
  { id: 'STU-101', name: 'Aarav Sharma', parent: 'Rajesh Sharma', contact: '+91 9876543210', address: 'H.No 12, X Village', class: 'Class 10th', section: 'A', route: 'Route A', village: 'X Village', totalFee: 45000, paidAmount: 20000, dueAmount: 25000 },
  { id: 'STU-102', name: 'Priya Patel', parent: 'Suresh Patel', contact: '+91 9876543211', address: 'Lane 4, C Village', class: 'Class 9th', section: 'B', route: 'Route B', village: 'C Village', totalFee: 42000, paidAmount: 42000, dueAmount: 0 },
  { id: 'STU-103', name: 'Rohan Gupta', parent: 'Amit Gupta', contact: '+91 9876543212', address: 'Block 2, F Village', class: 'Class 10th', section: 'A', route: 'Route B', village: 'F Village', totalFee: 45000, paidAmount: 10000, dueAmount: 35000 },
  { id: 'STU-104', name: 'Ananya Singh', parent: 'Vikram Singh', contact: '+91 9876543213', address: 'Plot 8, Y Village', class: 'Class 8th', section: 'A', route: 'Route A', village: 'Y Village', totalFee: 38000, paidAmount: 30000, dueAmount: 8000 },
  { id: 'STU-105', name: 'Kabir Mehta', parent: 'Deepak Mehta', contact: '+91 9876543214', address: 'Apt 15, City Center', class: 'Nursery', section: 'C', route: 'Route C', village: 'City Center', totalFee: 42000, paidAmount: 0, dueAmount: 42000 },
];

export default function FeeAndTransportRegistry() {
  const [students] = useState(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState(null); // Modal State
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('All');
  const [feeStatusFilter, setFeeStatusFilter] = useState('All');

  // Format Currency Function - Fixed Scope
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // 🧠 Core Filtering Engine
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.contact.includes(searchQuery);
      const matchesClass = classFilter === '' || student.class === classFilter;
      const matchesSection = sectionFilter === '' || student.section === sectionFilter;
      const matchesRoute = routeFilter === 'All' || student.route === routeFilter;
      const matchesFee = feeStatusFilter === 'All' || 
                         (feeStatusFilter === 'Pending' && student.dueAmount > 0) ||
                         (feeStatusFilter === 'Paid' && student.dueAmount === 0);

      return matchesSearch && matchesClass && matchesSection && matchesRoute && matchesFee;
    });
  }, [students, searchQuery, classFilter, sectionFilter, routeFilter, feeStatusFilter]);

  // Aggregate Metrics for the filtered view
  const metrics = useMemo(() => {
    return filteredStudents.reduce((acc, curr) => {
      acc.totalStudents += 1;
      acc.totalExpected += curr.totalFee;
      acc.totalCollected += curr.paidAmount;
      acc.totalDue += curr.dueAmount;
      return acc;
    }, { totalStudents: 0, totalExpected: 0, totalCollected: 0, totalDue: 0 });
  }, [filteredStudents]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans relative">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial & Geo-Transport Registry</h1>
          <p className="text-slate-500 mt-1">Unified dashboard for tracking student dues mapped across transport routes.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-50 shadow-sm transition">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition transform active:scale-95">
            <IndianRupee className="w-4 h-4" /> Collect Fee
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC METRICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Visible Students</p>
          <p className="text-3xl font-black text-slate-900">{metrics.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Expected</p>
          <p className="text-3xl font-black text-blue-600">{formatINR(metrics.totalExpected)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Collected</p>
          <p className="text-3xl font-black text-emerald-600">{formatINR(metrics.totalCollected)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-rose-200 bg-rose-50 shadow-sm">
          <p className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-1">Total Pending Dues</p>
          <p className="text-3xl font-black text-rose-700">{formatINR(metrics.totalDue)}</p>
        </div>
      </div>

      {/* 3. MULTI-LAYER FILTERING ENGINE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by student name, ID, or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Class</option>
          <option value="Nursery">Nursery</option>
          <option value="LKG">LKG</option>
          <option value="UKG">UKG</option>
          <option value="Class 1st">Class 1st</option>
          <option value="Class 2nd">Class 2nd</option>
          <option value="Class 3rd">Class 3rd</option>
          <option value="Class 4th">Class 4th</option>
          <option value="Class 5th">Class 5th</option>
          <option value="Class 6th">Class 6th</option>
          <option value="Class 7th">Class 7th</option>
          <option value="Class 8th">Class 8th</option>
          <option value="Class 9th">Class 9th</option>
          <option value="Class 10th">Class 10th</option>
          <option value="Class 11th">Class 11th</option>
          <option value="Class 12th">Class 12th</option>
        </select>

        <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Section</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
          <option value="D">Section D</option>
        </select>

        <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)} className="py-2.5 px-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="All">All Transport Routes</option>
          {ROUTE_DATA.map((route, idx) => (
            <option key={idx} value={route.id}>{route.id} ({route.villages.join(', ')})</option>
          ))}
        </select>

        <select 
          value={feeStatusFilter} 
          onChange={(e) => setFeeStatusFilter(e.target.value)} 
          className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">All Fee Status</option>
          <option value="Pending">Pending Dues</option>
          <option value="Paid">Fully Paid</option>
        </select>
      </div>

      {/* 4. MASTER DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Student Identity</th>
                <th className="p-4">Class & Sec</th>
                <th className="p-4">Transport & Geo</th>
                <th className="p-4 text-right">Fee Standing</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition duration-150">
                    
                    {/* Column 1: Student & Parent Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name} <span className="text-xs font-normal text-slate-400 ml-1">({student.id})</span></p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {student.parent}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {student.contact}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Academics */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{student.class}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Section {student.section}</p>
                    </td>

                    {/* Column 3: Routing & Address */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold w-fit">
                          <Bus className="w-3 h-3" /> {student.route}
                        </span>
                        <span className="flex items-start gap-1 text-xs text-slate-500 mt-1 max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 
                          {student.address}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Financial Status */}
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {student.dueAmount === 0 ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-md">CLEARED</span>
                        ) : (
                          <>
                            <span className="text-lg font-black text-rose-600">{formatINR(student.dueAmount)} Due</span>
                            <span className="text-xs font-medium text-slate-500">of {formatINR(student.totalFee)}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Action (Triggers Modal) */}
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-2 justify-center mx-auto text-indigo-600 hover:text-indigo-900 text-sm font-bold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" /> View Dossier
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">
                    No students found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. VIEW DOSSIER MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-indigo-600 p-6 relative">
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-indigo-700/50 hover:bg-indigo-700 p-1 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedStudent.name}</h2>
              <p className="text-indigo-100 font-medium">{selectedStudent.id} • {selectedStudent.class} (Sec {selectedStudent.section})</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parent/Guardian</p>
                  <p className="text-slate-900 font-semibold mt-1 flex items-center gap-2"><User className="w-4 h-4 text-slate-400"/> {selectedStudent.parent}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</p>
                  <p className="text-slate-900 font-semibold mt-1 flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/> {selectedStudent.contact}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address & Route</p>
                  <p className="text-slate-900 font-semibold mt-1 flex items-start gap-2"><MapPin className="w-4 h-4 text-slate-400 mt-0.5"/> {selectedStudent.address}</p>
                  <p className="text-indigo-600 text-sm font-bold mt-1 ml-6">{selectedStudent.route}</p>
                </div>
              </div>

              {/* Financial Box in Modal */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-500">Total Fee: {formatINR(selectedStudent.totalFee)}</p>
                  <p className="text-sm font-bold text-emerald-600">Paid: {formatINR(selectedStudent.paidAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-rose-500 uppercase">Pending Due</p>
                  <p className="text-2xl font-black text-rose-600">{formatINR(selectedStudent.dueAmount)}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="px-5 py-2 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}