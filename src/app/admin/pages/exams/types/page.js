"use client";
import { useState } from 'react';

export default function ExamTypeManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examTypes, setExamTypes] = useState([
    { id: 1, name: "Mid-Term Examination", code: "MID-2026", term: "Semester 1", status: "Active" },
    { id: 2, name: "Final Assessment", code: "FIN-2026", term: "Semester 2", status: "Upcoming" },
  ]);

  // Form State for new entry
  const [formData, setFormData] = useState({ name: "", code: "", term: "" });

  const handleSave = (e) => {
    e.preventDefault();
    
    // Add to table state
    const newExam = { 
      ...formData, 
      id: Date.now(), 
      status: "Active" 
    };
    
    setExamTypes([...examTypes, newExam]);
    
    // Reset and Close
    setIsModalOpen(false);
    setFormData({ name: "", code: "", term: "" });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Exam Types</h1>
            <p className="text-slate-500 text-sm font-medium">Define and manage academic assessment categories.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            + Create New Type
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Exam Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Code</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Term</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examTypes.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{exam.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-sm">{exam.code}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{exam.term}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      exam.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 font-bold text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-black mb-6">Create New Exam Type</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input 
                required
                placeholder="Exam Name" 
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  required
                  placeholder="Code" 
                  className="w-1/2 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
                <input 
                  required
                  placeholder="Term" 
                  className="w-1/2 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={(e) => setFormData({...formData, term: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all">Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}