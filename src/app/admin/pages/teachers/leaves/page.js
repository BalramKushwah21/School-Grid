"use client"
import React, { useState, useMemo } from 'react';

const INITIAL_REQUESTS = [
  {
    id: "LR-2026-904",
    applicantName: "Emma Watson",
    applicantType: "Student",
    departmentClass: "Grade 10-A",
    leaveType: "Medical Leave",
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    reason: "Scheduled dental surgery and recovery period.",
    status: "Pending",
    email: "e.watson@excelacademy.edu",
    submissionDate: "2026-06-16"
  },
  {
    id: "LR-2026-871",
    applicantName: "Dr. Sarah Jenkins",
    applicantType: "Faculty",
    departmentClass: "Science Department",
    leaveType: "Casual Leave",
    startDate: "2026-06-22",
    endDate: "2026-06-23",
    reason: "Attending National Physics Seminar as keynote speaker.",
    status: "Approved",
    email: "s.jenkins@excelacademy.edu",
    submissionDate: "2026-06-14"
  },
  {
    id: "LR-2026-752",
    applicantName: "James Carter",
    applicantType: "Student",
    departmentClass: "Grade 11-B",
    leaveType: "Personal Leave",
    startDate: "2026-06-25",
    endDate: "2026-06-28",
    reason: "Attending family wedding out of state.",
    status: "Approved",
    email: "j.carter@excelacademy.edu",
    submissionDate: "2026-06-12"
  }
];

const LEAVE_TYPES = ["Medical Leave", "Casual Leave", "Duty Leave", "Personal Leave", "Maternity/Paternity Leave"];

export default function App() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [selectedRequestId, setSelectedRequestId] = useState(INITIAL_REQUESTS[0].id);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [databaseLogs, setDatabaseLogs] = useState([
    { id: "LOG-9912", action: "SYSTEM_BOOT", details: "Leave request registry online.", timestamp: "09:00 AM" }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantType: 'Student',
    departmentClass: '',
    leaveType: 'Medical Leave',
    startDate: '',
    endDate: '',
    reason: '',
    email: ''
  });

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewRequestSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const generatedId = `LR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const submissionDate = new Date().toISOString().split('T')[0];

    const newRequest = {
      id: generatedId,
      ...formData,
      status: "Pending",
      submissionDate
    };

    setTimeout(() => {
      setRequests(prev => [newRequest, ...prev]);
      setSelectedRequestId(generatedId);
      setLoading(false);
      triggerNotification("Leave application submitted & queued for evaluation!", "success");
      
      // Update DB Logs
      setDatabaseLogs(prev => [
        {
          id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          action: "SUBMIT_LEAVE",
          details: `Filed ${newRequest.leaveType} for ${newRequest.applicantName}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);

      // Reset form fields
      setFormData({
        applicantName: '',
        applicantType: 'Student',
        departmentClass: '',
        leaveType: 'Medical Leave',
        startDate: '',
        endDate: '',
        reason: '',
        email: ''
      });
    }, 1000);
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    }));

    const targetReq = requests.find(r => r.id === id);
    triggerNotification(`Request ${id} marked as ${newStatus.toUpperCase()}`, newStatus === "Approved" ? "success" : "info");

    // Push log to Database ledger
    setDatabaseLogs(prev => [
      {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        action: `LEAVE_${newStatus.toUpperCase()}`,
        details: `ID ${id} authorized for ${targetReq?.applicantName || 'Applicant'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
  };

  // Filter requests based on status tabs & applicant type
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesStatus = filterStatus === "All" || req.status === filterStatus;
      const matchesType = filterType === "All" || req.applicantType === filterType;
      return matchesStatus && matchesType;
    });
  }, [requests, filterStatus, filterType]);

  // Selected Request detail payload
  const activeRequest = useMemo(() => {
    return requests.find(req => req.id === selectedRequestId) || requests[0];
  }, [requests, selectedRequestId]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === "Pending").length;
    const approved = requests.filter(r => r.status === "Approved").length;
    const rejected = requests.filter(r => r.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, [requests]);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* ================= STREAMING_CHUNK:Rendering main header and notification system... ================= */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <span className="text-lg">{notification.type === 'success' ? '✅' : 'ℹ️'}</span>
          <p className="text-sm font-semibold">{notification.message}</p>
        </div>
      )}

      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leave Application & Approval Portal</h1>
            <p className="text-sm text-slate-500 mt-1">
              Submit digital leave requests, audit the evaluation queue, and generate official signed certificates of absence.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
              DATABASE CONNECTED
            </span>
          </div>
        </div>
      </header>

      {/* Stats Board */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Filed</span>
              <span className="text-2xl font-black text-slate-900">{stats.total}</span>
            </div>
            <span className="text-xl">📁</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Audit</span>
              <span className="text-2xl font-black text-amber-500">{stats.pending}</span>
            </div>
            <span className="text-xl">⏳</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</span>
              <span className="text-2xl font-black text-emerald-600">{stats.approved}</span>
            </div>
            <span className="text-xl">✅</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</span>
              <span className="text-2xl font-black text-rose-600">{stats.rejected}</span>
            </div>
            <span className="text-xl">❌</span>
          </div>
        </div>
      </section>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= STREAMING_CHUNK:Building the Leave Application Form card... ================= */}
        {/* LEFT COLUMN: Apply Form & Database transaction feed */}
        <section className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              Leave Application Form
            </h2>

            <form onSubmit={handleNewRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Applicant Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, applicantType: "Student" }))}
                    className={`py-1.5 text-xs font-bold rounded-md transition ${formData.applicantType === 'Student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, applicantType: "Faculty" }))}
                    className={`py-1.5 text-xs font-bold rounded-md transition ${formData.applicantType === 'Faculty' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    Faculty / Staff
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" name="applicantName" required value={formData.applicantName} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50" 
                  placeholder="e.g. David Miller"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    {formData.applicantType === 'Student' ? 'Class / Grade' : 'Department'}
                  </label>
                  <input 
                    type="text" name="departmentClass" required value={formData.departmentClass} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50" 
                    placeholder={formData.applicantType === 'Student' ? 'e.g. Grade 11-A' : 'e.g. Science Dept'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Leave Category</label>
                  <select
                    name="leaveType" value={formData.leaveType} onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {LEAVE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                  <input 
                    type="date" name="startDate" required value={formData.startDate} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                  <input 
                    type="date" name="endDate" required value={formData.endDate} onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="name@excelacademy.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reason / Explanation</label>
                <textarea 
                  name="reason" required rows="3" value={formData.reason} onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none resize-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Detail the circumstances necessitating absence..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white p-3 font-semibold rounded-lg transition text-sm shadow disabled:bg-slate-400"
              >
                {loading ? 'Transmitting application...' : 'File Application to Registrar'}
              </button>
            </form>
          </div>

          {/* Database Log Flow Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Server Sync Feed</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {databaseLogs.map((log) => (
                <div key={log.id} className="text-xs bg-slate-50 p-2.5 border border-slate-150 rounded flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-indigo-600 block">{log.id} — {log.action}</span>
                    <span className="text-slate-500 text-[11px]">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STREAMING_CHUNK:Creating the Active Leave Requests queue grid... ================= */}
        {/* RIGHT COLUMN: Queue grid list & Slip viewer */}
        <section className="lg:col-span-7 space-y-6 print:w-full print:p-0">
          
          {/* List Queue */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
            
            {/* Filtering parameters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <h3 className="text-md font-bold text-slate-950">Active Audit Queue</h3>
              
              <div className="flex flex-wrap gap-2">
                <select 
                  value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600"
                >
                  <option value="All">All Types</option>
                  <option value="Student">Student Only</option>
                  <option value="Faculty">Faculty Only</option>
                </select>

                <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold">
                  {["All", "Pending", "Approved", "Rejected"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setFilterStatus(tab)}
                      className={`px-2.5 py-1 rounded transition ${filterStatus === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {filteredRequests.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">No matching leave requests found in active registry queue.</p>
              ) : (
                filteredRequests.map(req => {
                  const isSelected = req.id === selectedRequestId;
                  return (
                    <div 
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-150 hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 block">{req.applicantName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{req.id} • {req.applicantType} • {req.departmentClass}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Audit approval controls */}
            {activeRequest && activeRequest.status === 'Pending' && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Audit action for current selection:</span>
                  <span className="font-bold text-slate-900 text-sm">{activeRequest.applicantName}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(activeRequest.id, "Rejected")}
                    className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-lg transition"
                  >
                    Reject Leave
                  </button>
                  <button 
                    onClick={() => handleStatusChange(activeRequest.id, "Approved")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Approve Leave
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= STREAMING_CHUNK:Designing the dynamic Approved Leave Pass/Certificate preview... ================= */}
          {/* Live Document Preview & Certificate */}
          {activeRequest ? (
            <div className="space-y-4 print:w-full print:p-0">
              
              {/* Document Actions banner */}
              <div className="w-full bg-slate-900 text-white p-4 rounded-xl shadow flex items-center justify-between print:hidden">
                <span className="text-xs font-medium">
                  {activeRequest.status === 'Approved' ? "✅ Document Verified & Signed" : "⏳ Awaiting Approval Signature"}
                </span>
                <button
                  onClick={handlePrintCertificate}
                  disabled={activeRequest.status !== 'Approved'}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow ${
                    activeRequest.status === 'Approved' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Download / Print Slip
                </button>
              </div>

              {/* Leave Certification Document Frame */}
              <div className="bg-white border-8 border-double border-slate-800 p-8 shadow-xl rounded-sm aspect-[1.41/1] relative flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
                
                {/* Visual Background Stamp */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                  <span className="text-9xl font-black uppercase text-slate-900 tracking-widest">EXCEL</span>
                </div>

                {/* Print layout institution header */}
                <div className="text-center border-b border-slate-800 pb-3">
                  <h1 className="text-xl font-extrabold uppercase tracking-widest text-slate-900">Excel Academy International</h1>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">Office of the Registrar & Academic Council</p>
                </div>

                {/* Subtitle */}
                <div className="text-center my-2">
                  <h3 className="text-md font-serif italic text-slate-800">Official Certificate of Leave & Excused Absence</h3>
                </div>

                {/* Certificate Core Statement */}
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed px-2">
                  <p>This document acts as verified certification that the excused absence request submitted by 
                    <span className="font-bold border-b border-slate-300 px-2 text-slate-900 mx-1">{activeRequest.applicantName}</span> 
                    serving in the capacity of <span className="font-semibold text-indigo-700">{activeRequest.applicantType}</span> 
                    associated with <span className="font-bold text-slate-800">{activeRequest.departmentClass}</span> has been formally reviewed.
                  </p>

                  <p>The leave application, filed on <span className="font-semibold font-mono">{activeRequest.submissionDate}</span> 
                    specifically requesting category <span className="font-bold underline text-slate-900">{activeRequest.leaveType}</span>, has been processed for the effective duration spanning:
                  </p>

                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex justify-around text-center font-mono my-2 print:bg-transparent">
                    <div>
                      <span className="block text-[8px] uppercase text-slate-400 font-bold font-sans">Start Effective Date</span>
                      <span className="font-bold text-slate-900 text-sm">{activeRequest.startDate}</span>
                    </div>
                    <div className="border-l border-slate-200"></div>
                    <div>
                      <span className="block text-[8px] uppercase text-slate-400 font-bold font-sans">End Effective Date</span>
                      <span className="font-bold text-slate-900 text-sm">{activeRequest.endDate}</span>
                    </div>
                  </div>

                  <p className="italic text-slate-500 text-[11px] leading-tight mt-1">
                    <span className="font-bold not-italic uppercase text-[9px] text-slate-400 block mb-0.5">Reason Submitted:</span>
                    "{activeRequest.reason}"
                  </p>
                </div>

                {/* Authority Signature Stamps */}
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100 px-2 text-[9px] font-bold text-slate-600">
                  <div className="text-center">
                    <span className="block font-mono text-slate-400 mb-1">{activeRequest.id}</span>
                    <span>System Database Serial ID</span>
                  </div>

                  {/* Stamp Graphic */}
                  <div className={`w-14 h-14 rounded-full border-2 ${activeRequest.status === 'Approved' ? 'border-emerald-500/40' : 'border-amber-500/40'} flex items-center justify-center p-1 relative`}>
                    <div className={`w-full h-full rounded-full border border-dashed ${activeRequest.status === 'Approved' ? 'border-emerald-500/50 text-emerald-600' : 'border-amber-500/50 text-amber-600'} flex flex-col items-center justify-center text-center scale-90`}>
                      <span className="text-[7px] font-black tracking-widest">{activeRequest.status.toUpperCase()}</span>
                      <span className="text-[5px] uppercase font-bold">REGISTRAR</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-20 border-t border-slate-350 mx-auto mb-1"></div>
                    <span>Principal Signature Stamp</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center italic text-slate-400 print:hidden">
              Select an entry from the Active Audit Queue to view, approve, and print certification.
            </div>
          )}

        </section>

      </main>

    </div>
  );
}