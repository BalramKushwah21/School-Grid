"use client"
import React, { useState } from 'react';

export default function App() {
  // 1. Core State for Teacher Registration Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Other',
    department: 'Science',
    designation: '',
    highestQualification: 'Master of Science (M.Sc.)',
    joiningDate: new Date().toISOString().split('T')[0],
    classesAssigned: '',
    salaryBracket: 'Tier 1 - Assistant Professor',
    systemRole: 'Faculty Staff',
    bioNotes: '',
    avatarSeed: '1'
  });

  const [activeTab, setActiveTab] = useState('personal'); // personal, academic, system
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [databaseLogs, setDatabaseLogs] = useState([]);

  // 2. Handle simple text updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Tab Navigation helper with basic validation checks
  const handleTabChange = (targetTab) => {
    if (targetTab === 'academic' && (!formData.fullName || !formData.email)) {
      alert("Please complete core details like Full Name and Email before proceeding.");
      return;
    }
    setActiveTab(targetTab);
  };

  // 4. Onboarding database synchronization
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a new unique teacher ID (e.g., TCH-2026-X83)
    const year = new Date().getFullYear();
    const cleanId = `TCH-${year}-${Math.floor(100 + Math.random() * 900)}`;

    setTimeout(() => {
      setLoading(false);
      setGeneratedId(cleanId);
      setIsSaved(true);

      // Append entry to local simulation database logs
      setDatabaseLogs((prev) => [
        {
          id: cleanId,
          name: formData.fullName,
          department: formData.department,
          role: formData.systemRole,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }, 1200);
  };

  // 5. Reset for next onboarding session
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'Other',
      department: 'Science',
      designation: '',
      highestQualification: 'Master of Science (M.Sc.)',
      joiningDate: new Date().toISOString().split('T')[0],
      classesAssigned: '',
      salaryBracket: 'Tier 1 - Assistant Professor',
      systemRole: 'Faculty Staff',
      bioNotes: '',
      avatarSeed: Math.floor(Math.random() * 10).toString()
    });
    setIsSaved(false);
    setGeneratedId('');
    setActiveTab('personal');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Multistep Form Panel */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm print:hidden">
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Onboarding</h1>
              <p className="text-xs text-slate-500 mt-1">Register new faculty staff into the active directory database.</p>
            </div>
            
            {isSaved && (
              <button 
                onClick={resetForm} 
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Onboard Another +
              </button>
            )}
          </div>

          {/* Stepper Tabs */}
          <div className="flex border-b border-slate-200 mb-6 text-sm">
            <button 
              onClick={() => handleTabChange('personal')}
              className={`pb-3 pr-4 font-bold border-b-2 transition ${activeTab === 'personal' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              1. Personal Details
            </button>
            <button 
              onClick={() => handleTabChange('academic')}
              className={`pb-3 px-4 font-bold border-b-2 transition ${activeTab === 'academic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              2. Academic & Classes
            </button>
            <button 
              onClick={() => handleTabChange('system')}
              className={`pb-3 pl-4 font-bold border-b-2 transition ${activeTab === 'system' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              3. System Access
            </button>
          </div>

          {/* Form Boundary */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* STEP 1: Personal Details */}
            {activeTab === 'personal' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Teacher Name *</label>
                  <input 
                    type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. Dr. Robert Chen"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email ID *</label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="r.chen@school.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="+1 (555) 432-1099"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                    <input 
                      type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select 
                      name="gender" value={formData.gender} onChange={handleInputChange}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="button" 
                    onClick={() => handleTabChange('academic')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-lg text-sm transition"
                  >
                    Continue to Academic Assignment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Academic & Classes */}
            {activeTab === 'academic' && (
              <div className="space-y-4 animate-in fade-in duration-200">
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
                      <option value="Social Sciences">Social Sciences</option>
                      <option value="Fine Arts">Fine Arts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designation</label>
                    <input 
                      type="text" name="designation" required value={formData.designation} onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="e.g. AP Chemistry Lecturer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Highest Qualification</label>
                    <input 
                      type="text" name="highestQualification" value={formData.highestQualification} onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="e.g. Ph.D. in Organic Chemistry"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Joining Effective Date</label>
                    <input 
                      type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Class / Grade Codes</label>
                  <input 
                    type="text" name="classesAssigned" value={formData.classesAssigned} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. Grade 11-A, Grade 12-B"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('personal')}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-3 rounded-lg text-sm transition"
                  >
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleTabChange('system')}
                    className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-lg text-sm transition"
                  >
                    Continue to System Access
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: System Roles & Submission */}
            {activeTab === 'system' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Onboarding Salary Level</label>
                    <select 
                      name="salaryBracket" value={formData.salaryBracket} onChange={handleInputChange}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Tier 1 - Assistant Professor">Tier 1 - Assistant Professor</option>
                      <option value="Tier 2 - Associate Professor">Tier 2 - Associate Professor</option>
                      <option value="Tier 3 - Tenured Professor">Tier 3 - Tenured Professor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">System Security Role</label>
                    <select 
                      name="systemRole" value={formData.systemRole} onChange={handleInputChange}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Faculty Staff">Faculty Staff</option>
                      <option value="Department Head">Department Head</option>
                      <option value="Academic Registrar">Academic Registrar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Professional Biography / General Notes</label>
                  <textarea 
                    name="bioNotes" rows="3" value={formData.bioNotes} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                    placeholder="Enter previous research background or special achievements..."
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('academic')}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-3 rounded-lg text-sm transition"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || isSaved}
                    className={`w-2/3 p-3 font-bold text-white rounded-lg text-sm transition shadow ${
                      isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {loading ? 'Creating Record...' : isSaved ? '✓ Database Synced' : 'Onboard Teacher'}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* SIMULATED DATABASE SYNC LOGS */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Live Server Sync Status</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {databaseLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Pending entries. Awaiting first successful registration...</p>
              ) : (
                databaseLogs.map((log) => (
                  <div key={log.id} className="text-xs bg-slate-50 p-2 border border-slate-100 rounded flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-indigo-600">{log.id}</span>
                      <span className="text-slate-800 font-medium ml-2">{log.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Verification ID Card & Onboarding Document */}
        <div className="lg:col-span-5 flex flex-col gap-6 print:w-full print:p-0">
          
          {/* Action Printable Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-xs font-semibold">
                {isSaved ? "Verified Database Entry" : "Awaiting Verification"}
              </span>
            </div>
            
            <button 
              onClick={() => window.print()}
              disabled={!isSaved}
              className={`px-4 py-1.5 rounded text-xs font-bold transition shadow ${
                isSaved ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Print Record Sheet
            </button>
          </div>

          {/* ================= DYNAMIC VISUAL ID CARD PREVIEW ================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-between relative overflow-hidden aspect-[1/1.58] max-w-xs mx-auto w-full print:hidden">
            <div className="absolute top-0 inset-x-0 h-16 bg-indigo-950 flex flex-col items-center justify-center p-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Excel Academy</h2>
              <p className="text-[8px] text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Faculty Access Card</p>
            </div>

            {/* Simulated Avatar using letters */}
            <div className="w-20 h-20 rounded-full border-4 border-white bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center mt-12 shadow-md">
              {formData.fullName 
                ? formData.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() 
                : 'T'}
            </div>

            <div className="text-center flex-grow pt-4 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-extrabold text-slate-900 text-md uppercase leading-tight">
                  {formData.fullName || 'FACULTY NAME'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {formData.designation || 'DESIGNATION / ROLE'}
                </p>
              </div>

              {/* Data Rows */}
              <div className="space-y-2 text-left text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 my-4">
                <div className="flex justify-between border-b border-slate-200/50 pb-1">
                  <span className="text-slate-400 font-medium">Department</span>
                  <span className="font-bold text-slate-800">{formData.department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1">
                  <span className="text-slate-400 font-medium">System Role</span>
                  <span className="font-bold text-indigo-600">{formData.systemRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Access Code</span>
                  <span className="font-bold font-mono text-slate-800">{generatedId || 'AWAITING_SYNC'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 w-full text-center pt-2 text-[9px] text-slate-400 font-bold">
              ID SECURITY PROTOCOL v1.0
            </div>
          </div>

          {/* ================= PRINT PREVIEW DOCUMENT SHEET ================= */}
          {/* This renders dynamically with custom styling constraints for printing/export */}
          <div className="hidden print:block w-full bg-white p-8 border border-slate-800 flex-col justify-between min-h-screen">
            <div className="text-center border-b pb-4 mb-6">
              <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">Excel Academy International</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Human Resources Directory File Entry</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div>
                <span className="block font-bold text-slate-400 uppercase">Faculty Member ID</span>
                <span className="font-mono text-base font-bold text-indigo-700">{generatedId}</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-400 uppercase">Onboarding Date</span>
                <span className="text-base font-bold text-slate-800">{formData.joiningDate}</span>
              </div>
            </div>

            <h3 className="text-sm font-black border-b border-slate-800 pb-1.5 mb-4 text-slate-800">1. PERSONAL DOSSIER</h3>
            <table className="w-full text-xs text-left mb-6 space-y-2">
              <tbody>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500 w-1/3">Full Name</td><td className="py-2 text-slate-900 font-extrabold">{formData.fullName}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Contact Email</td><td className="py-2 text-slate-800 font-mono">{formData.email}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Contact Phone</td><td className="py-2 text-slate-800">{formData.phone || 'N/A'}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Date of Birth</td><td className="py-2 text-slate-800">{formData.dob || 'N/A'}</td></tr>
              </tbody>
            </table>

            <h3 className="text-sm font-black border-b border-slate-800 pb-1.5 mb-4 text-slate-800">2. ACADEMIC & ROLE DEPLOYMENT</h3>
            <table className="w-full text-xs text-left mb-6">
              <tbody>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500 w-1/3">Department</td><td className="py-2 text-indigo-700 font-bold">{formData.department}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Official Designation</td><td className="py-2 text-slate-900 font-bold">{formData.designation}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Qualifications</td><td className="py-2 text-slate-800">{formData.highestQualification}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Salary Tier Allocation</td><td className="py-2 text-slate-800">{formData.salaryBracket}</td></tr>
                <tr className="border-b"><td className="py-2 font-bold text-slate-500">Classes Managed</td><td className="py-2 text-slate-800">{formData.classesAssigned || 'None'}</td></tr>
              </tbody>
            </table>

            <div className="mt-8 flex justify-between items-end text-[10px] font-bold text-slate-600 pt-12">
              <div className="text-center">
                <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
                <span>Registrar Signature</span>
              </div>
              <div className="text-center">
                <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
                <span>Dean of Faculty Approval</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}