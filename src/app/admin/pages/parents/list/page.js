"use client"
import React, { useState, useMemo } from 'react';

const ParentsList = () => {
  // Mock Database: Parents and their linked students
  const [parents] = useState([
    { 
      id: 'PAR-1001', 
      fatherName: 'Rajesh Sharma', 
      motherName: 'Priya Sharma', 
      primaryContact: '9876543210', 
      secondaryContact: '9876543211',
      email: 'rajesh.sharma@example.com',
      address: '45, Palm Avenue, Sector 4, Tech City',
      status: 'Active',
      children: [
        { id: 101, name: 'Aarav Sharma', class: 'Class 10 - A', rollNo: '10A-01' },
        { id: 108, name: 'Diya Sharma', class: 'Class 7 - B', rollNo: '07B-14' }
      ]
    },
    { 
      id: 'PAR-1002', 
      fatherName: 'Amit Gupta', 
      motherName: 'Neha Gupta', 
      primaryContact: '9876543212', 
      secondaryContact: '',
      email: 'amit.g@example.com',
      address: 'Flat 402, Sunshine Residency, Park Road',
      status: 'Active',
      children: [
        { id: 103, name: 'Rohan Gupta', class: 'Class 11 - Sci', rollNo: '11S-05' }
      ]
    },
    { 
      id: 'PAR-1003', 
      fatherName: 'Vikram Desai', 
      motherName: 'Anjali Desai', 
      primaryContact: '9876543213', 
      secondaryContact: '9876543214',
      email: 'v.desai@example.com',
      address: 'Villa 12, Green Meadows, Hill View',
      status: 'Active',
      children: [
        { id: 104, name: 'Ananya Desai', class: 'Class 9 - B', rollNo: '09B-12' },
        { id: 112, name: 'Kabir Desai', class: 'Class 4 - A', rollNo: '04A-08' }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);

  // Safeguarded Filter for live search
  const filteredParents = useMemo(() => {
    return parents.filter(p => {
      const query = searchQuery.toLowerCase();
      // Search by parent names, contact, or children names
      const parentMatch = 
        (p?.fatherName || '').toLowerCase().includes(query) || 
        (p?.motherName || '').toLowerCase().includes(query) ||
        (p?.primaryContact || '').includes(query);
      
      const childMatch = p?.children?.some(child => 
        (child?.name || '').toLowerCase().includes(query)
      );

      return parentMatch || childMatch;
    });
  }, [parents, searchQuery]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Guardian Directory</h1>
          <p className="text-slate-500 mt-1">Manage parent accounts, contact details, and linked student profiles.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
          + Invite New Parent
        </button>
      </div>

      <div className="flex gap-6 relative">
        
        {/* LEFT PANEL: DATA TABLE */}
        <div className={`transition-all duration-300 ${selectedParent ? 'w-full lg:w-2/3 hidden lg:block' : 'w-full'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition shadow-sm" 
                  placeholder="Search by parent name, phone, or student name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b">
                    <th className="p-4 font-bold">Account ID</th>
                    <th className="p-4 font-bold">Primary Guardians</th>
                    <th className="p-4 font-bold">Contact Info</th>
                    <th className="p-4 font-bold">Enrolled Wards</th>
                    <th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                  {filteredParents.length > 0 ? (
                    filteredParents.map((parent) => {
                      if (!parent) return null;
                      return (
                        <tr key={parent.id} className="hover:bg-indigo-50/30 transition duration-150 group cursor-pointer" onClick={() => setSelectedParent(parent)}>
                          <td className="p-4 font-medium text-slate-500">{parent.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{parent.fatherName}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{parent.motherName}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-700 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                              {parent.primaryContact}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 truncate max-w-[150px]">{parent.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {parent.children.map(child => (
                                <span key={child.id} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-xs font-medium">
                                  {child.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedParent(parent); }}
                              className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition"
                            >
                              View &rarr;
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-500">
                        No parent accounts found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE PARENT PROFILE (Slide-over effect) */}
        {selectedParent && (
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up h-[calc(100vh-8rem)] sticky top-6">
            
            {/* Cover & Avatar Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white relative">
              <button onClick={() => setSelectedParent(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black border-2 border-white/30 backdrop-blur-md">
                  {selectedParent?.fatherName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedParent?.fatherName}</h2>
                  <p className="text-indigo-100 text-sm font-medium">& {selectedParent?.motherName}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                 <span className="bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Account: {selectedParent?.id}</span>
                 <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">{selectedParent?.status}</span>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <button className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:shadow-sm transition group">
                  <div className="bg-indigo-50 p-2 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-600">Call</span>
                </button>
                <button className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:shadow-sm transition group">
                  <div className="bg-blue-50 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-600">Email</span>
                </button>
                <button className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-emerald-300 hover:shadow-sm transition group">
                  <div className="bg-emerald-50 p-2 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-600">SMS</span>
                </button>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Primary Phone</p>
                    <p className="text-sm font-bold text-slate-900">+91 {selectedParent?.primaryContact}</p>
                  </div>
                  {selectedParent?.secondaryContact && (
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Secondary Phone</p>
                      <p className="text-sm font-bold text-slate-900">+91 {selectedParent?.secondaryContact}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-slate-900">{selectedParent?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Residential Address</p>
                    <p className="text-sm font-medium text-slate-700 leading-snug">{selectedParent?.address}</p>
                  </div>
                </div>
              </div>

              {/* Linked Children */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Linked Wards ({selectedParent?.children?.length})</h3>
                <div className="space-y-3">
                  {selectedParent?.children?.map(child => (
                    <div key={child.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm hover:border-indigo-200 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{child.name}</p>
                          <p className="text-xs text-slate-500">{child.rollNo} • {child.class}</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
                        Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Panel Actions (Sticky Footer) */}
            <div className="p-4 bg-white border-t border-slate-200">
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-slate-800 transition">
                Edit Parent Details
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ParentsList;