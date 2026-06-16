"use client"
import React, { useState } from 'react';

// Pre-populated initial teachers database
const INITIAL_TEACHERS = [
  {
    id: "TCH-2024-101",
    fullName: "Dr. Sarah Jenkins",
    email: "s.jenkins@excelacademy.edu",
    phone: "+1 (555) 234-5678",
    department: "Science",
    designation: "Head of Department (Physics)",
    joiningDate: "2018-08-15",
    status: "Active",
    classesTaught: "Grade 11-A, Grade 12-B",
    avatarColor: "bg-indigo-600"
  },
  {
    id: "TCH-2024-102",
    fullName: "Marcus Aurelius Vance",
    email: "m.vance@excelacademy.edu",
    phone: "+1 (555) 876-5432",
    department: "Mathematics",
    designation: "Senior Calculus Lecturer",
    joiningDate: "2020-01-10",
    status: "Active",
    classesTaught: "Grade 12-A, Grade 12-C",
    avatarColor: "bg-emerald-600"
  },
  {
    id: "TCH-2024-103",
    fullName: "Elena Rostova",
    email: "e.rostova@excelacademy.edu",
    phone: "+1 (555) 456-7890",
    department: "Languages",
    designation: "AP English Literature Teacher",
    joiningDate: "2021-09-01",
    status: "Active",
    classesTaught: "Grade 10-B, Grade 11-C",
    avatarColor: "bg-rose-600"
  },
  {
    id: "TCH-2024-104",
    fullName: "Raymond Reddington",
    email: "r.reddington@excelacademy.edu",
    phone: "+1 (555) 901-2345",
    department: "Social Studies",
    designation: "World History Instructor",
    joiningDate: "2019-03-24",
    status: "On Leave",
    classesTaught: "Grade 10-A, Grade 11-B",
    avatarColor: "bg-amber-600"
  }
];

const DEPARTMENTS = ["All Departments", "Science", "Mathematics", "Languages", "Social Studies", "Arts & PE"];

export default function App() {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  
  // Modal & Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'Science',
    designation: '',
    joiningDate: '',
    classesTaught: '',
    status: 'Active'
  });

  // Custom Toast/Notification Trigger
  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add/Sync New Faculty Member to Simulated Database
  const handleAddTeacherSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const colors = ["bg-indigo-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600", "bg-purple-600", "bg-teal-600"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTeacherRecord = {
      id: `TCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      ...formData,
      avatarColor: randomColor
    };

    // Simulate Server Post request latency
    setTimeout(() => {
      setTeachers((prev) => [newTeacherRecord, ...prev]);
      setLoading(false);
      setShowAddModal(false);
      triggerNotification(`${formData.fullName} has been successfully added and synced with database!`, "success");
      
      // Reset Form Data
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: 'Science',
        designation: '',
        joiningDate: '',
        classesTaught: '',
        status: 'Active'
      });
    }, 1000);
  };

  // Toggle Faculty Status (Active vs On Leave)
  const toggleStatus = (id) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "Active" ? "On Leave" : "Active";
          triggerNotification(`Updated status of ${t.fullName} to: ${nextStatus}`, "info");
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Filter and Search logic
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === "All Departments" || teacher.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Export to System PDF/Print
  const handleExportDirectory = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* Dynamic Toast System */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="text-lg">
            {notification.type === 'success' ? '🚀' : 'ℹ️'}
          </span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* ================= HEADER SECTION ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Directory & Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              Add new educators, change active status, and export physical records linked directly to school registrar databases.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportDirectory}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-sm transition flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Export Directory (PDF)
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-lg text-sm transition flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v9m-14-9v9m14-9h-14M12 5.25v13.5" /></svg>
              Register New Teacher
            </button>
          </div>
        </div>
      </header>

      {/* ================= PRINT HEADER (Shown ONLY on print layout) ================= */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Excel Academy International</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Official Faculty & Staff Register</p>
        <div className="flex justify-between mt-6 text-xs text-slate-600 font-bold">
          <span>Total Faculty Count: {filteredTeachers.length}</span>
          <span>Date Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* ================= SEARCH & CONTROLS PANEL ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, ID or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
          </div>

          {/* Department Quick Filter */}
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedDept === dept 
                  ? 'bg-slate-900 text-white shadow' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ================= TEACHERS DISPLAY CONTAINER ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center print:border-none">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-slate-700 mt-4">No Educators Found</h3>
            <p className="text-sm text-slate-400 mt-1">Verify search query or adjust your current filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
            {filteredTeachers.map((teacher) => (
              
              /* CARD BOUNDARY */
              <div 
                key={teacher.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition relative flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:border-b print:border-slate-300 print:pb-4"
              >
                
                {/* Upper Details Block */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {/* Visual Avatar */}
                    <div className={`w-14 h-14 rounded-full ${teacher.avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-sm print:w-10 print:h-10 print:text-sm`}>
                      {teacher.fullName.split(' ').map(name => name[0]).slice(0, 2).join('')}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base leading-tight print:text-md">{teacher.fullName}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{teacher.id}</p>
                    </div>
                  </div>

                  {/* Core Attributes Data Grid */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-semibold text-slate-400">Designation</span>
                      <span className="font-bold text-slate-900 text-right">{teacher.designation}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-semibold text-slate-400">Department</span>
                      <span className="font-semibold text-indigo-700">{teacher.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-semibold text-slate-400">Contact Email</span>
                      <span className="font-medium text-slate-600 font-mono select-all">{teacher.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-semibold text-slate-400">Classes Taught</span>
                      <span className="font-medium text-slate-800">{teacher.classesTaught || 'Not Assigned'}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="font-semibold text-slate-400">Joined School</span>
                      <span className="font-medium text-slate-800">{new Date(teacher.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Actions (Hidden during prints) */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 print:hidden">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${teacher.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span className="text-xs font-bold text-slate-700">{teacher.status}</span>
                  </div>

                  <button
                    onClick={() => toggleStatus(teacher.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition"
                  >
                    Change Status
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* ================= REGISTER TEACHER MODAL (LEFT MODAL) ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-lg font-black text-slate-900">Register Faculty Member</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold transition p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Dr. Jane Foster"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input 
                    type="email" name="email" required value={formData.email} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. j.foster@academy.edu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input 
                    type="text" name="phone" required value={formData.phone} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. +1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                  <select 
                    name="department" value={formData.department} onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages">Languages</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Arts & PE">Arts & PE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                  <input 
                    type="text" name="designation" required value={formData.designation} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Chemistry Lecturer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Joining Date</label>
                  <input 
                    type="date" name="joiningDate" required value={formData.joiningDate} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Academic Status</label>
                  <select 
                    name="status" value={formData.status} onChange={handleInputChange}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Classes</label>
                <input 
                  type="text" name="classesTaught" value={formData.classesTaught} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Grade 11-A, Grade 12-A"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 font-semibold rounded-lg transition text-sm shadow disabled:bg-slate-400 mt-2"
              >
                {loading ? 'Registering Faculty...' : 'Submit to School Database'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}