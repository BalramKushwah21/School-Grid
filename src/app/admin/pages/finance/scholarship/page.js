"use client"
import React, { useState, useMemo } from 'react';

const FeeDiscount = () => {
  const [activeTab, setActiveTab] = useState('policies'); // 'policies' or 'apply'

  // Mock Database: Active Discount Policies
  const [policies, setPolicies] = useState([
    { id: 1, name: 'Sibling Discount', type: 'percentage', value: 10, criteria: 'Second child enrolled in the school' },
    { id: 2, name: 'Staff Ward', type: 'percentage', value: 50, criteria: 'Child of current teaching/non-teaching staff' },
    { id: 3, name: 'Merit Scholarship (Top 3)', type: 'flat', value: 15000, criteria: 'Secured 95%+ in previous academic year' },
    { id: 4, name: 'Early Bird Single Payment', type: 'flat', value: 2000, criteria: 'Full annual fee paid before April 15th' },
  ]);

  // Mock Database: Students for applying discounts
  const mockStudents = [
    { id: 101, rollNo: '10A-01', name: 'Aarav Sharma', class: 'Class 10 - A', totalFee: 65000 },
    { id: 102, rollNo: '09B-12', name: 'Ananya Desai', class: 'Class 9 - B', totalFee: 55000 },
    { id: 103, rollNo: '11S-05', name: 'Rohan Gupta', class: 'Class 11 - Sci', totalFee: 78500 },
  ];

  // State for adding a new policy
  const [newPolicy, setNewPolicy] = useState({ name: '', type: 'percentage', value: '', criteria: '' });

  // State for applying discounts
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [applyStatus, setApplyStatus] = useState('idle');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  // --- Handlers for Policies Tab ---
  const handleAddPolicy = (e) => {
    e.preventDefault();
    const policy = {
      id: Date.now(),
      name: newPolicy.name,
      type: newPolicy.type,
      value: parseFloat(newPolicy.value) || 0,
      criteria: newPolicy.criteria
    };
    setPolicies([...policies, policy]);
    setNewPolicy({ name: '', type: 'percentage', value: '', criteria: '' });
  };

  const handleDeletePolicy = (id) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  // --- Handlers for Apply Tab ---
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return [];
    return mockStudents.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activePolicy = policies.find(p => p.id === parseInt(selectedPolicyId));
  
  // Live calculation of discount
  const discountAmount = useMemo(() => {
    if (!selectedStudent || !activePolicy) return 0;
    if (activePolicy.type === 'percentage') {
      return (selectedStudent.totalFee * activePolicy.value) / 100;
    }
    return activePolicy.value;
  }, [selectedStudent, activePolicy]);

  const finalFee = selectedStudent ? selectedStudent.totalFee - discountAmount : 0;

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    setApplyStatus('processing');
    
    // Simulate API Call delay
    setTimeout(() => {
      setApplyStatus('success');
      // TODO: API Call -> axios.post('/api/finance/apply-discount', { studentId, policyId, discountAmount })
    }, 1000);
  };

  const resetApplication = () => {
    setSelectedStudent(null);
    setSelectedPolicyId('');
    setSearchQuery('');
    setApplyStatus('idle');
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discounts & Scholarships</h1>
          <p className="text-slate-500 mt-1">Manage institutional discount policies and allocate them to students.</p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex space-x-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('policies')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'policies' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Master Policies
        </button>
        <button 
          onClick={() => { setActiveTab('apply'); setApplyStatus('idle'); }}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'apply' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Allocate to Student
        </button>
      </div>

      {/* TAB 1: MASTER POLICIES */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Policies Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map(policy => (
              <div key={policy.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${policy.type === 'percentage' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{policy.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${policy.type === 'percentage' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {policy.type === 'percentage' ? `${policy.value}% OFF` : `FLAT ${formatCurrency(policy.value)}`}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{policy.criteria}</p>
                <div className="pt-4 border-t border-slate-100 flex justify-end  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDeletePolicy(policy.id)} className="text-xs font-bold text-rose-500 hover:text-rose-700">Remove Policy</button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Policy Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Create New Policy</h2>
            <form onSubmit={handleAddPolicy} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Policy Name</label>
                <input type="text" value={newPolicy.name} onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Sports Quota" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select value={newPolicy.type} onChange={(e) => setNewPolicy({...newPolicy, type: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Value</label>
                  <input type="number" value={newPolicy.value} onChange={(e) => setNewPolicy({...newPolicy, value: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 10" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                <textarea value={newPolicy.criteria} onChange={(e) => setNewPolicy({...newPolicy, criteria: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" rows="2" placeholder="Describe who is eligible..." required />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition shadow-md">
                Save Policy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ALLOCATE TO STUDENT */}
      {activeTab === 'apply' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            
            {/* Search Section */}
            {!selectedStudent ? (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Locate Student File</h2>
                <div className="relative max-w-xl mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 transition shadow-sm bg-slate-50" 
                    placeholder="Search Roll No (e.g., 10A-01)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Search Results Dropdown-style */}
                {searchQuery && (
                  <div className="max-w-xl mx-auto mt-4 bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <button key={student.id} onClick={() => setSelectedStudent(student)} className="w-full text-left p-4 hover:bg-indigo-50 transition flex justify-between items-center group">
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-700">{student.name}</p>
                            <p className="text-sm text-slate-500">{student.rollNo} • {student.class}</p>
                          </div>
                          <span className="text-indigo-500 font-medium text-sm">Select &rarr;</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500">No student found.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              
              /* Application Form & Live Preview */
              <div className="flex flex-col md:flex-row">
                
                {/* Left Side: Form */}
                <div className="p-8 md:w-1/2 border-r border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h3>
                      <p className="text-slate-500 text-sm">{selectedStudent.rollNo} • {selectedStudent.class}</p>
                    </div>
                    <button onClick={resetApplication} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold hover:bg-slate-300">Change Student</button>
                  </div>

                  <form onSubmit={handleApplyDiscount} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Applicable Policy</label>
                      <select 
                        value={selectedPolicyId} 
                        onChange={(e) => setSelectedPolicyId(e.target.value)} 
                        className="w-full border-2 border-slate-200 rounded-xl p-3 text-slate-700 focus:border-indigo-500 focus:ring-0 bg-white"
                        required
                        disabled={applyStatus === 'success'}
                      >
                        <option value="" disabled>-- Choose a Master Policy --</option>
                        {policies.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.type === 'percentage' ? `${p.value}%` : `₹${p.value}`})</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!selectedPolicyId || applyStatus !== 'idle'}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 
                        ${!selectedPolicyId ? 'bg-slate-300 cursor-not-allowed shadow-none' : 
                          applyStatus === 'processing' ? 'bg-indigo-400 cursor-wait' : 
                          applyStatus === 'success' ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'}`}
                    >
                      {applyStatus === 'idle' ? 'Confirm & Apply Allocation' : 
                       applyStatus === 'processing' ? 'Processing...' : 'Discount Applied Successfully!'}
                    </button>
                  </form>
                </div>

                {/* Right Side: Live Financial Preview */}
                <div className="p-8 md:w-1/2 bg-slate-900 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500 opacity-20 blur-2xl"></div>
                  
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-700 pb-2">Live Fee Projection</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="font-medium">Original Base Fee</span>
                      <span className="font-bold">{formatCurrency(selectedStudent.totalFee)}</span>
                    </div>
                    
                    <div className={`flex justify-between items-center transition-all duration-500 ${activePolicy ? 'text-emerald-400 scale-105 transform origin-left' : 'text-slate-600'}`}>
                      <span className="font-medium">Policy Deduction {activePolicy?.type === 'percentage' && `(${activePolicy.value}%)`}</span>
                      <span className="font-bold">- {formatCurrency(discountAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Revised Annual Fee</p>
                    <p className={`text-4xl font-black transition-colors duration-500 ${activePolicy ? 'text-white' : 'text-slate-500'}`}>
                      {formatCurrency(finalFee)}
                    </p>
                  </div>
                  
                  {applyStatus === 'success' && (
                    <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Ledger updated successfully.
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeDiscount;