"use client"
import React, { useState, useMemo } from 'react';

const FeeDues = () => {
  // Mock Database: Students with pending dues
  const [students, setStudents] = useState([
    { id: 101, rollNo: '10A-01', name: 'Aarav Sharma', class: 'Class 10 - A', parentContact: '9876543210', totalFee: 65000, paid: 25000, due: 40000, status: 'Overdue' },
    { id: 103, rollNo: '11S-05', name: 'Rohan Gupta', class: 'Class 11 - Sci', parentContact: '9876543212', totalFee: 78500, paid: 0, due: 78500, status: 'Critical' },
    { id: 104, rollNo: '09B-12', name: 'Ananya Desai', class: 'Class 9 - B', parentContact: '9876543213', totalFee: 55000, paid: 40000, due: 15000, status: 'Pending' },
    { id: 105, rollNo: '12C-03', name: 'Kabir Singh', class: 'Class 12 - Com', parentContact: '9876543214', totalFee: 60000, paid: 50000, due: 10000, status: 'Pending' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ totalFee: 0, paid: 0 });

  // Safeguarded Filter: Added fallbacks in case a student object is missing data
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => s && s.due > 0)
      .filter(s => {
        const query = searchQuery.toLowerCase();
        return (
          (s?.name || '').toLowerCase().includes(query) || 
          (s?.rollNo || '').toLowerCase().includes(query) ||
          (s?.class || '').toLowerCase().includes(query)
        );
      });
  }, [students, searchQuery]);

  const totalOutstanding = students.reduce((sum, s) => sum + (s?.due || 0), 0);
  const totalDefaulters = students.filter(s => s?.due > 0).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  // Handlers
  const handleSelectStudent = (student) => {
    if (!student) return;
    setSelectedStudent(student);
    setEditFormData({ totalFee: student.totalFee, paid: student.paid });
    setIsEditing(false);
  };

  const handleClearDues = (id) => {
    setStudents(prevStudents => prevStudents.map(s => {
      if (s?.id === id) {
        return { ...s, paid: s.totalFee, due: 0, status: 'Cleared' };
      }
      return s;
    }));
    setSelectedStudent(null);
  };

  const handleSaveEdits = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updatedTotal = parseFloat(editFormData.totalFee) || 0;
    const updatedPaid = parseFloat(editFormData.paid) || 0;
    const newDue = updatedTotal - updatedPaid;

    setStudents(prevStudents => prevStudents.map(s => {
      if (s?.id === selectedStudent.id) {
        return { ...s, totalFee: updatedTotal, paid: updatedPaid, due: newDue };
      }
      return s;
    }));
    
    setSelectedStudent({ ...selectedStudent, totalFee: updatedTotal, paid: updatedPaid, due: newDue });
    setIsEditing(false);
  };

  const handleSendReminder = () => {
    if (!selectedStudent) return;
    alert(`SMS and Email reminder sent to parent of ${selectedStudent.name} at ${selectedStudent.parentContact}.`);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden">
      
      {/* HEADER & SUMMARY CARDS */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fee Dues & Defaulters</h1>
        <p className="text-slate-500 mt-1">Track outstanding balances, apply adjustments, and clear pending dues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Outstanding</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Students with Dues</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalDefaulters} <span className="text-sm font-medium text-slate-500">students</span></p>
        </div>
      </div>

      <div className="flex gap-6 relative">
        
        {/* DATA TABLE */}
        <div className={`transition-all duration-300 ${selectedStudent ? 'w-2/3 hidden lg:block' : 'w-full'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition" 
                  placeholder="Search by name, roll no, or class..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b">
                    <th className="p-4 font-bold w-1/4">Student Info</th>
                    <th className="p-4 font-bold text-right">Total Fee</th>
                    <th className="p-4 font-bold text-right">Paid</th>
                    <th className="p-4 font-bold text-right">Pending Due</th>
                    <th className="p-4 font-bold text-center">Status</th>
                    <th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      if (!student) return null; // Safeguard against null objects in array
                      return (
                        <tr key={student.id} className="hover:bg-indigo-50/50 transition duration-150 group">
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{student?.name}</div>
                            <div className="text-xs text-slate-500">{student?.rollNo} • {student?.class}</div>
                          </td>
                          <td className="p-4 text-right font-medium">{formatCurrency(student?.totalFee)}</td>
                          <td className="p-4 text-right text-emerald-600 font-medium">{formatCurrency(student?.paid)}</td>
                          <td className="p-4 text-right font-bold text-rose-600">{formatCurrency(student?.due)}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${student?.status === 'Critical' ? 'bg-rose-100 text-rose-700' : student?.status === 'Overdue' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                              {student?.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleSelectStudent(student)}
                              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-500">
                        No pending dues found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* INTERACTIVE DETAILS PANEL (Guarded with optional chaining) */}
        {selectedStudent && (
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up">
            
            <div className="bg-slate-900 p-6 flex justify-between items-start text-white">
              <div>
                <h2 className="text-xl font-bold mb-1">{selectedStudent?.name}</h2>
                <p className="text-slate-400 text-sm">{selectedStudent?.rollNo} • {selectedStudent?.class}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 mb-6 text-center">
                <p className="text-rose-600 font-bold text-sm uppercase tracking-wider mb-1">Current Due Amount</p>
                <p className="text-4xl font-black text-rose-700">{formatCurrency(selectedStudent?.due)}</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Financial Breakdown</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Structure'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveEdits} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Total Assigned Fee</label>
                      <input type="number" value={editFormData.totalFee} onChange={(e) => setEditFormData({...editFormData, totalFee: e.target.value})} className="w-full border p-2 rounded-lg text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Total Paid So Far</label>
                      <input type="number" value={editFormData.paid} onChange={(e) => setEditFormData({...editFormData, paid: e.target.value})} className="w-full border p-2 rounded-lg text-sm font-bold text-emerald-600" />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-sm hover:bg-slate-800">
                      Save Adjustments
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Total Assigned Fee</span>
                      <span className="font-bold text-slate-900">{formatCurrency(selectedStudent?.totalFee)}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Amount Paid</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(selectedStudent?.paid)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-slate-800 mb-3">Guardian Contact</h3>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">+91 {selectedStudent?.parentContact}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-3">
              <button 
                onClick={handleSendReminder}
                className="bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl text-sm shadow-sm hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >
                Reminder
              </button>
              <button 
                onClick={() => handleClearDues(selectedStudent?.id)}
                className="bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-emerald-200 hover:bg-emerald-600 transition flex items-center justify-center gap-2"
              >
                Clear Dues
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default FeeDues;