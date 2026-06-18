"use client"
import React, { useState, useMemo } from 'react';

const ParentManagement = () => {
  // Mock Database: Registered Parents/Guardians
  const [parents, setParents] = useState([
    { 
      id: 'PAR-1001', 
      fatherName: 'Rajesh Sharma', 
      motherName: 'Priya Sharma', 
      primaryContact: '9876543210', 
      email: 'rajesh.sharma@example.com',
      address: '45, Palm Avenue, Sector 4, Tech City',
      status: 'Active',
      linkedStudents: ['STU-8001']
    },
    { 
      id: 'PAR-1002', 
      fatherName: 'Amit Gupta', 
      motherName: 'Neha Gupta', 
      primaryContact: '9876543212', 
      email: 'amit.g@example.com',
      address: 'Flat 402, Sunshine Residency, Park Road',
      status: 'Active',
      linkedStudents: ['STU-8003']
    },
    { 
      id: 'PAR-1003', 
      fatherName: 'Vikram Desai', 
      motherName: 'Anjali Desai', 
      primaryContact: '9876543213', 
      email: 'v.desai@example.com',
      address: 'Villa 12, Green Meadows, Hill View',
      status: 'Suspended',
      linkedStudents: ['STU-8002']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Panel Modes: 'idle', 'add', 'view', 'edit'
  const [panelMode, setPanelMode] = useState('idle'); 
  const [selectedParent, setSelectedParent] = useState(null);

  // Form State for Adding/Editing
  const initialFormState = {
    fatherName: '', motherName: '', primaryContact: '', email: '',
    address: '', status: 'Active', linkedStudents: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddPanel = () => {
    setFormData(initialFormState);
    setSelectedParent(null);
    setPanelMode('add');
  };

  const openViewPanel = (parent) => {
    if (!parent) return;
    setSelectedParent(parent);
    setPanelMode('view');
  };

  const openEditPanel = () => {
    if (!selectedParent) return;
    // Convert array back to comma-separated string for editing
    setFormData({ 
      ...selectedParent, 
      linkedStudents: selectedParent.linkedStudents.join(', ') 
    });
    setPanelMode('edit');
  };

  const closePanel = () => {
    setPanelMode('idle');
    setSelectedParent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert comma-separated string to array for database state
    const processedLinkedStudents = formData.linkedStudents
      ? formData.linkedStudents.split(',').map(s => s.trim())
      : [];

    if (panelMode === 'add') {
      const newParent = {
        id: `PAR-${1000 + parents.length + 1}`,
        ...formData,
        linkedStudents: processedLinkedStudents
      };
      setParents([newParent, ...parents]);
      setPanelMode('idle');
    } 
    
    if (panelMode === 'edit') {
      const updatedParents = parents.map(p => 
        p.id === formData.id ? { ...p, ...formData, linkedStudents: processedLinkedStudents } : p
      );
      setParents(updatedParents);
      setSelectedParent({ ...formData, linkedStudents: processedLinkedStudents });
      setPanelMode('view');
    }
  };

  // --- Search & Filter ---
  const filteredParents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return parents.filter(p => 
        (p?.fatherName || '').toLowerCase().includes(query) ||
        (p?.motherName || '').toLowerCase().includes(query) ||
        (p?.primaryContact || '').toLowerCase().includes(query) ||
        (p?.id || '').toLowerCase().includes(query)
      );
  }, [parents, searchQuery]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Guardian Directory</h1>
          <p className="text-slate-500 mt-1">Manage parent accounts, contact details, and student linkages.</p>
        </div>
        <button 
          onClick={openAddPanel}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          Register New Parent
        </button>
      </div>

      <div className="flex gap-6 relative">
        
        {/* LEFT PANEL: DATA TABLE */}
        <div className={`transition-all duration-300 ${panelMode !== 'idle' ? 'w-full lg:w-2/3 hidden lg:block' : 'w-full'}`}>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
            
            {/* Search Bar */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition shadow-sm bg-white" 
                  placeholder="Search by name, ID, or phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="p-5 font-bold">Primary Guardians</th>
                    <th className="p-5 font-bold">Contact Info</th>
                    <th className="p-5 font-bold">Linked Students</th>
                    <th className="p-5 font-bold text-center">Status</th>
                    <th className="p-5 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                  {filteredParents.length > 0 ? (
                    filteredParents.map((parent) => (
                      <tr key={parent.id} className="hover:bg-indigo-50/30 transition duration-150 group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200 shadow-sm">
                              {parent?.fatherName?.charAt(0)}{parent?.motherName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 group-hover:text-indigo-700 transition">{parent.fatherName} & {parent.motherName}</div>
                              <div className="text-xs text-slate-500 mt-0.5 font-medium">{parent.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-slate-700">{parent.primaryContact}</span>
                          <div className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-[150px]">{parent.email}</div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-wrap gap-1">
                            {parent.linkedStudents.map(stu => (
                                <span key={stu} className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full inline-block">
                                  {stu}
                                </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${parent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                            {parent.status}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button 
                            onClick={() => openViewPanel(parent)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-16 text-center text-slate-500">
                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        No parents found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE SLIDE-OUT (View / Add / Edit) */}
        {panelMode !== 'idle' && (
          <div className="w-full lg:w-1/3 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up h-[calc(100vh-8rem)] sticky top-6">
            
            {/* Panel Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white flex-shrink-0">
              <h2 className="text-xl font-extrabold">
                {panelMode === 'add' ? 'New Parent Account' : panelMode === 'edit' ? 'Edit Profile' : 'Guardian Record'}
              </h2>
              <button onClick={closePanel} className="text-slate-400 hover:text-white transition bg-slate-800 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              
              {/* --- VIEW MODE --- */}
              {panelMode === 'view' && selectedParent && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4 border-4 border-white">
                      {selectedParent.fatherName.charAt(0)}{selectedParent.motherName.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{selectedParent.fatherName}</h3>
                    <h3 className="text-lg font-bold text-slate-700">& {selectedParent.motherName}</h3>
                    <p className="text-indigo-600 font-bold mt-1">{selectedParent.id}</p>
                    <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedParent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {selectedParent.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Primary Phone</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedParent.primaryContact}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Email Address</span>
                        <span className="font-bold text-slate-900 text-sm truncate ml-4">{selectedParent.email}</span>
                      </div>
                      <div className="flex flex-col pt-1">
                        <span className="text-slate-500 text-sm mb-1">Residential Address</span>
                        <span className="font-bold text-slate-900 text-sm leading-snug">{selectedParent.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Linked Student IDs</h4>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm flex flex-wrap gap-2">
                      {selectedParent.linkedStudents.length > 0 ? (
                        selectedParent.linkedStudents.map(stu => (
                            <span key={stu} className="bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                              {stu}
                            </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">No students linked yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- ADD / EDIT FORM MODE --- */}
              {(panelMode === 'add' || panelMode === 'edit') && (
                <form id="parentForm" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Father's Name</label>
                      <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Mother's Name</label>
                      <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Primary Phone</label>
                      <input type="text" name="primaryContact" value={formData.primaryContact} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Residential Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows="2" required></textarea>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Linkage</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Linked Student IDs (Comma Separated)</label>
                      <input type="text" name="linkedStudents" value={formData.linkedStudents} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., STU-8001, STU-8002" />
                      <p className="text-[10px] text-slate-400 mt-1">Ensure these IDs match active student records in the database.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Account Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </form>
              )}
            </div>

            {/* Panel Actions (Sticky Footer) */}
            <div className="p-4 bg-white border-t border-slate-200 flex gap-3 flex-shrink-0">
              {panelMode === 'view' ? (
                <>
                  <button onClick={openEditPanel} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-indigo-700 transition">
                    Edit Details
                  </button>
                  <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-slate-50 transition">
                    Reset Portal Password
                  </button>
                </>
              ) : (
                <>
                  <button onClick={panelMode === 'edit' ? () => setPanelMode('view') : closePanel} className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-sm hover:bg-slate-200 transition">
                    Cancel
                  </button>
                  <button form="parentForm" type="submit" className="w-2/3 bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-emerald-600 transition">
                    {panelMode === 'add' ? 'Create Account' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ParentManagement;