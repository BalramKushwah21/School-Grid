"use client"
import React, { useState, useMemo } from 'react';

const TeacherManagement = () => {
  // Mock Database: Teaching Staff
  const [teachers, setTeachers] = useState([
    { 
      id: 'TCH-5001', 
      firstName: 'Vikram', 
      lastName: 'Singh', 
      department: 'Mathematics', 
      designation: 'Senior Faculty',
      email: 'v.singh@globalexcellence.edu', 
      phone: '9876543111', 
      joinDate: '2018-06-15',
      status: 'Active',
      classesAssigned: ['Class 10 - A', 'Class 12 - Sci']
    },
    { 
      id: 'TCH-5002', 
      firstName: 'Anjali', 
      lastName: 'Desai', 
      department: 'Science', 
      designation: 'Lab Instructor',
      email: 'a.desai@globalexcellence.edu', 
      phone: '9876543112', 
      joinDate: '2020-04-10',
      status: 'Active',
      classesAssigned: ['Class 8 - C', 'Class 9 - B']
    },
    { 
      id: 'TCH-5003', 
      firstName: 'Rahul', 
      lastName: 'Verma', 
      department: 'Physical Education', 
      designation: 'Sports Coach',
      email: 'r.verma@globalexcellence.edu', 
      phone: '9876543113', 
      joinDate: '2023-01-20',
      status: 'On Leave',
      classesAssigned: ['All Primary Classes']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  // Panel Modes: 'idle', 'add', 'view', 'edit'
  const [panelMode, setPanelMode] = useState('idle'); 
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Form State for Adding/Editing
  const initialFormState = {
    firstName: '', lastName: '', department: 'Mathematics', designation: '',
    email: '', phone: '', joinDate: new Date().toISOString().split('T')[0], status: 'Active'
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddPanel = () => {
    setFormData(initialFormState);
    setSelectedTeacher(null);
    setPanelMode('add');
  };

  const openViewPanel = (teacher) => {
    if (!teacher) return;
    setSelectedTeacher(teacher);
    setPanelMode('view');
  };

  const openEditPanel = () => {
    if (!selectedTeacher) return;
    setFormData({ ...selectedTeacher });
    setPanelMode('edit');
  };

  const closePanel = () => {
    setPanelMode('idle');
    setSelectedTeacher(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (panelMode === 'add') {
      const newTeacher = {
        id: `TCH-${5000 + teachers.length + 1}`,
        ...formData,
        classesAssigned: [] // Newly added teachers have no classes assigned yet
      };
      setTeachers([newTeacher, ...teachers]);
      setPanelMode('idle');
    } 
    
    if (panelMode === 'edit') {
      const updatedTeachers = teachers.map(t => 
        t.id === formData.id ? { ...t, ...formData } : t
      );
      setTeachers(updatedTeachers);
      // Automatically update the view state so the user sees their changes
      setSelectedTeacher({ ...formData });
      setPanelMode('view');
    }
    
    // TODO: Add API POST (Add) or PUT (Edit) requests here
  };

  // --- Search & Filter ---
  const filteredTeachers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return teachers.filter(t => 
      (t?.firstName || '').toLowerCase().includes(query) ||
      (t?.lastName || '').toLowerCase().includes(query) ||
      (t?.department || '').toLowerCase().includes(query) ||
      (t?.id || '').toLowerCase().includes(query)
    );
  }, [teachers, searchQuery]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Directory</h1>
          <p className="text-slate-500 mt-1">Manage teaching staff profiles, departmental assignments, and contact data.</p>
        </div>
        <button 
          onClick={openAddPanel}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add New Faculty
        </button>
      </div>

      <div className="flex gap-6 relative">
        
        {/* LEFT PANEL: DATA TABLE */}
        <div className={`transition-all duration-300 ${panelMode !== 'idle' ? 'w-full lg:w-2/3 hidden lg:block' : 'w-full'}`}>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
            
            {/* Search Bar */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition shadow-sm bg-white" 
                  placeholder="Search by name, ID, or department..." 
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
                    <th className="p-5 font-bold">Faculty Member</th>
                    <th className="p-5 font-bold">Department</th>
                    <th className="p-5 font-bold">Contact Info</th>
                    <th className="p-5 font-bold text-center">Status</th>
                    <th className="p-5 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-indigo-50/30 transition duration-150 group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                              {teacher?.firstName?.charAt(0)}{teacher?.lastName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 group-hover:text-indigo-700 transition">{teacher.firstName} {teacher.lastName}</div>
                              <div className="text-xs text-slate-500 mt-0.5 font-medium">{teacher.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-slate-700">{teacher.department}</span>
                          <div className="text-xs text-slate-500 mt-0.5">{teacher.designation}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-medium text-slate-700">{teacher.phone}</div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{teacher.email}</div>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button 
                            onClick={() => openViewPanel(teacher)}
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
                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        No faculty members found matching your search.
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
                {panelMode === 'add' ? 'Register New Faculty' : panelMode === 'edit' ? 'Edit Profile' : 'Faculty Profile'}
              </h2>
              <button onClick={closePanel} className="text-slate-400 hover:text-white transition bg-slate-800 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Panel Body (Dynamic rendering based on mode) */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              
              {/* --- VIEW MODE --- */}
              {panelMode === 'view' && selectedTeacher && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4 border-4 border-white">
                      {selectedTeacher.firstName.charAt(0)}{selectedTeacher.lastName.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{selectedTeacher.firstName} {selectedTeacher.lastName}</h3>
                    <p className="text-indigo-600 font-bold">{selectedTeacher.designation}</p>
                    <p className="text-slate-500 text-sm">{selectedTeacher.department} Department</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Employment</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Employee ID</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedTeacher.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Email</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedTeacher.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Phone</span>
                        <span className="font-bold text-slate-900 text-sm">+91 {selectedTeacher.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Date of Joining</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedTeacher.joinDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Current Status</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${selectedTeacher.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {selectedTeacher.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Class Assignments</h4>
                    {selectedTeacher.classesAssigned.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.classesAssigned.map((cls, index) => (
                          <span key={index} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                            {cls}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No classes currently assigned.</p>
                    )}
                  </div>
                </div>
              )}

              {/* --- ADD / EDIT FORM MODE --- */}
              {(panelMode === 'add' || panelMode === 'edit') && (
                <form id="facultyForm" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Contact Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                      <select name="department" value={formData.department} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Physical Education">Physical Education</option>
                        <option value="Languages">Languages</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Designation</label>
                      <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Senior Faculty" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Date of Joining</label>
                      <input type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Panel Actions (Sticky Footer) */}
            <div className="p-4 bg-white border-t border-slate-200 flex gap-3 flex-shrink-0">
              {panelMode === 'view' ? (
                <>
                  <button onClick={openEditPanel} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-indigo-700 transition">
                    Edit Faculty Profile
                  </button>
                  <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-slate-50 transition">
                    Assign Classes
                  </button>
                </>
              ) : (
                <>
                  <button onClick={panelMode === 'edit' ? () => setPanelMode('view') : closePanel} className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-sm hover:bg-slate-200 transition">
                    Cancel
                  </button>
                  <button form="facultyForm" type="submit" className="w-2/3 bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-emerald-600 transition">
                    {panelMode === 'add' ? 'Save New Faculty' : 'Save Changes'}
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

export default TeacherManagement;