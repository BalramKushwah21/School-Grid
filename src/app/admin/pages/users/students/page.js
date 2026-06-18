"use client"
import React, { useState, useMemo } from 'react';

const StudentManagement = () => {
  // Mock Database: Enrolled Students
  const [students, setStudents] = useState([
    { 
      id: 'STU-8001', 
      firstName: 'Aarav', 
      lastName: 'Sharma', 
      classAssigned: 'Class 10 - A', 
      rollNo: '10A-01',
      dob: '2010-05-14',
      admissionDate: '2016-04-01',
      parentId: 'PAR-1001',
      parentName: 'Rajesh Sharma',
      status: 'Enrolled'
    },
    { 
      id: 'STU-8002', 
      firstName: 'Ananya', 
      lastName: 'Desai', 
      classAssigned: 'Class 9 - B', 
      rollNo: '09B-12',
      dob: '2011-08-22',
      admissionDate: '2017-04-05',
      parentId: 'PAR-1003',
      parentName: 'Vikram Desai',
      status: 'Enrolled'
    },
    { 
      id: 'STU-8003', 
      firstName: 'Rohan', 
      lastName: 'Gupta', 
      classAssigned: 'Class 11 - Sci', 
      rollNo: '11S-05',
      dob: '2009-11-03',
      admissionDate: '2015-04-10',
      parentId: 'PAR-1002',
      parentName: 'Amit Gupta',
      status: 'Suspended'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  
  // Panel Modes: 'idle', 'add', 'view', 'edit'
  const [panelMode, setPanelMode] = useState('idle'); 
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State for Adding/Editing
  const initialFormState = {
    firstName: '', lastName: '', classAssigned: 'Class 10 - A', rollNo: '',
    dob: '', admissionDate: new Date().toISOString().split('T')[0], 
    parentId: '', parentName: '', status: 'Enrolled'
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddPanel = () => {
    setFormData(initialFormState);
    setSelectedStudent(null);
    setPanelMode('add');
  };

  const openViewPanel = (student) => {
    if (!student) return;
    setSelectedStudent(student);
    setPanelMode('view');
  };

  const openEditPanel = () => {
    if (!selectedStudent) return;
    setFormData({ ...selectedStudent });
    setPanelMode('edit');
  };

  const closePanel = () => {
    setPanelMode('idle');
    setSelectedStudent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (panelMode === 'add') {
      const newStudent = {
        id: `STU-${8000 + students.length + 1}`,
        ...formData
      };
      setStudents([newStudent, ...students]);
      setPanelMode('idle');
    } 
    
    if (panelMode === 'edit') {
      const updatedStudents = students.map(s => 
        s.id === formData.id ? { ...s, ...formData } : s
      );
      setStudents(updatedStudents);
      setSelectedStudent({ ...formData });
      setPanelMode('view');
    }
    
    // TODO: Add API POST (Add) or PUT (Edit) requests here
  };

  // --- Search & Filter ---
  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return students
      .filter(s => classFilter === 'All' || s?.classAssigned === classFilter)
      .filter(s => 
        (s?.firstName || '').toLowerCase().includes(query) ||
        (s?.lastName || '').toLowerCase().includes(query) ||
        (s?.rollNo || '').toLowerCase().includes(query) ||
        (s?.id || '').toLowerCase().includes(query)
      );
  }, [students, searchQuery, classFilter]);

  // Unique classes for the filter dropdown
  const uniqueClasses = ['All', ...new Set(students.map(s => s.classAssigned))];

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 mt-1">Manage enrollments, academic profiles, and parent linkages.</p>
        </div>
        <button 
          onClick={openAddPanel}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Enroll New Student
        </button>
      </div>

      <div className="flex gap-6 relative">
        
        {/* LEFT PANEL: DATA TABLE */}
        <div className={`transition-all duration-300 ${panelMode !== 'idle' ? 'w-full lg:w-2/3 hidden lg:block' : 'w-full'}`}>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
            
            {/* Search & Filter Bar */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition shadow-sm bg-white" 
                  placeholder="Search by name, ID, or roll no..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full md:w-auto border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              >
                {uniqueClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="p-5 font-bold">Student Profile</th>
                    <th className="p-5 font-bold">Class & Roll No</th>
                    <th className="p-5 font-bold">Guardian Info</th>
                    <th className="p-5 font-bold text-center">Status</th>
                    <th className="p-5 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-indigo-50/30 transition duration-150 group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm">
                              {student?.firstName?.charAt(0)}{student?.lastName?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 group-hover:text-indigo-700 transition">{student.firstName} {student.lastName}</div>
                              <div className="text-xs text-slate-500 mt-0.5 font-medium">{student.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-slate-700">{student.classAssigned}</span>
                          <div className="text-xs text-slate-500 mt-0.5 font-medium">Roll: {student.rollNo}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-medium text-slate-700 truncate max-w-[150px]">{student.parentName}</div>
                          <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1">{student.parentId}</div>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${student.status === 'Enrolled' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : student.status === 'Suspended' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button 
                            onClick={() => openViewPanel(student)}
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
                        No students found matching your filters.
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
                {panelMode === 'add' ? 'New Enrollment' : panelMode === 'edit' ? 'Edit Profile' : 'Student Record'}
              </h2>
              <button onClick={closePanel} className="text-slate-400 hover:text-white transition bg-slate-800 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              
              {/* --- VIEW MODE --- */}
              {panelMode === 'view' && selectedStudent && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4 border-4 border-white">
                      {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                    <p className="text-indigo-600 font-bold">{selectedStudent.id}</p>
                    <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedStudent.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {selectedStudent.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Details</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Class Assigned</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedStudent.classAssigned}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Roll Number</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedStudent.rollNo}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500 text-sm">Admission Date</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedStudent.admissionDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Date of Birth</span>
                        <span className="font-bold text-slate-900 text-sm">{selectedStudent.dob}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Guardian Linkage</h4>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-bold text-indigo-900 text-sm">{selectedStudent.parentName}</p>
                        <p className="text-xs text-indigo-700 mt-1">{selectedStudent.parentId}</p>
                      </div>
                      <button className="text-indigo-600 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition shadow-sm">
                        View Parent
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- ADD / EDIT FORM MODE --- */}
              {(panelMode === 'add' || panelMode === 'edit') && (
                <form id="studentForm" onSubmit={handleSubmit} className="space-y-5">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Class</label>
                      <input type="text" name="classAssigned" value={formData.classAssigned} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Class 10 - A" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Roll Number</label>
                      <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., 10A-01" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Admission Date</label>
                      <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parent/Guardian Details</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Parent Account ID (Linkage)</label>
                      <input type="text" name="parentId" value={formData.parentId} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., PAR-1001" required />
                      <p className="text-[10px] text-slate-400 mt-1">This links the student to the Parent Portal dashboard.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Guardian Name</label>
                      <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Enrollment Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                      <option value="Enrolled">Enrolled</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Graduated">Graduated / Alumni</option>
                      <option value="Transferred">Transferred</option>
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
                    Edit Student Data
                  </button>
                  <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-slate-50 transition">
                    View Report Card
                  </button>
                </>
              ) : (
                <>
                  <button onClick={panelMode === 'edit' ? () => setPanelMode('view') : closePanel} className="w-1/3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl text-sm hover:bg-slate-200 transition">
                    Cancel
                  </button>
                  <button form="studentForm" type="submit" className="w-2/3 bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-emerald-600 transition">
                    {panelMode === 'add' ? 'Enroll Student' : 'Save Changes'}
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

export default StudentManagement;