"use client"
import React, { useState, useEffect } from 'react';

const FeeStructure = () => {
  // Mock State: Existing Fee Structures
  const [feeStructures, setFeeStructures] = useState([
    { id: 1, className: 'Class 10', academicYear: '2026-2027', tuitionFee: 45000, libraryFee: 2000, transportFee: 15000, activityFee: 3000 },
    { id: 2, className: 'Class 11 - Science', academicYear: '2026-2027', tuitionFee: 55000, libraryFee: 3500, transportFee: 15000, activityFee: 5000 },
  ]);

  // Form State for adding a new structure
  const [formData, setFormData] = useState({
    className: '',
    academicYear: '2026-2027',
    tuitionFee: '',
    libraryFee: '',
    transportFee: '',
    activityFee: ''
  });

  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'add'
  const [liveTotal, setLiveTotal] = useState(0);

  // Auto-calculate live total when form data changes
  useEffect(() => {
    const total = 
      (parseFloat(formData.tuitionFee) || 0) + 
      (parseFloat(formData.libraryFee) || 0) + 
      (parseFloat(formData.transportFee) || 0) + 
      (parseFloat(formData.activityFee) || 0);
    setLiveTotal(total);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStructure = {
      id: Date.now(),
      className: formData.className,
      academicYear: formData.academicYear,
      tuitionFee: parseFloat(formData.tuitionFee) || 0,
      libraryFee: parseFloat(formData.libraryFee) || 0,
      transportFee: parseFloat(formData.transportFee) || 0,
      activityFee: parseFloat(formData.activityFee) || 0,
    };
    
    setFeeStructures([...feeStructures, newStructure]);
    setFormData({ className: '', academicYear: '2026-2027', tuitionFee: '', libraryFee: '', transportFee: '', activityFee: '' });
    setActiveTab('view');

    // TODO: Add your API POST request here
    // example: axios.post('/api/finance/fee-structure', newStructure)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fee Structure Configuration</h1>
        <p className="text-slate-500 mt-1">Design and manage premium fee blueprints for all academic classes.</p>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex space-x-4 mb-6 border-b border-slate-200 pb-px">
        <button 
          onClick={() => setActiveTab('view')}
          className={`pb-3 px-2 text-sm font-semibold transition-colors duration-200 ${activeTab === 'view' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Active Structures
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className={`pb-3 px-2 text-sm font-semibold transition-colors duration-200 ${activeTab === 'add' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          + Create New Structure
        </button>
      </div>

      {/* VIEW ACTIVE STRUCTURES */}
      {activeTab === 'view' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feeStructures.map((fee) => {
            const grandTotal = fee.tuitionFee + fee.libraryFee + fee.transportFee + fee.activityFee;
            return (
              <div key={fee.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex justify-between items-center text-white">
                  <div>
                    <h2 className="text-xl font-bold">{fee.className}</h2>
                    <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium mt-2 backdrop-blur-sm">
                      Session: {fee.academicYear}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">Total Annual Fee</p>
                    <p className="text-3xl font-extrabold">{formatCurrency(grandTotal)}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Fee Breakdown (Heads)</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Tuition Fee</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(fee.tuitionFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Library Fee</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(fee.libraryFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Transport Fee</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(fee.transportFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Activity Fee</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(fee.activityFee)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">Edit Structure</button>
                    <button className="px-4 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW STRUCTURE FORM */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Build Fee Blueprint</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Top Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Class</label>
                  <input type="text" name="className" value={formData.className} onChange={handleInputChange} placeholder="e.g., Class 12 - Commerce" className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Academic Year</label>
                  <select name="academicYear" value={formData.academicYear} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                    <option value="2026-2027">2026-2027</option>
                    <option value="2027-2028">2027-2028</option>
                  </select>
                </div>
              </div>

              {/* Fee Heads Inputs */}
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Fee Components (INR)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tuition Fee</label>
                  <span className="absolute bottom-3 left-3 text-slate-400">₹</span>
                  <input type="number" name="tuitionFee" value={formData.tuitionFee} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-8 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" required />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Library / Lab Fee</label>
                  <span className="absolute bottom-3 left-3 text-slate-400">₹</span>
                  <input type="number" name="libraryFee" value={formData.libraryFee} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-8 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Transport Fee</label>
                  <span className="absolute bottom-3 left-3 text-slate-400">₹</span>
                  <input type="number" name="transportFee" value={formData.transportFee} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-8 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Extracurricular / Activity Fee</label>
                  <span className="absolute bottom-3 left-3 text-slate-400">₹</span>
                  <input type="number" name="activityFee" value={formData.activityFee} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-8 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
                </div>
              </div>

              {/* Dynamic Summary & Submit */}
              <div className="bg-indigo-50 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center border border-indigo-100">
                <div className="mb-4 md:mb-0">
                  <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-1">Live Calculated Total</p>
                  <p className="text-4xl font-black text-indigo-900">{formatCurrency(liveTotal)}</p>
                </div>
                <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5">
                  Save Fee Blueprint
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;