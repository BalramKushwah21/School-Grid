"use client"
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SchoolIncome = () => {
  // Mock Database: Recent Income Transactions (Non-Fee)
  const [incomes, setIncomes] = useState([
    { id: 'INC-2001', date: '2026-06-01', category: 'Government Grant', amount: 250000, description: 'Annual digital infrastructure grant', method: 'Bank Transfer' },
    { id: 'INC-2002', date: '2026-06-05', category: 'Facility Rental', amount: 15000, description: 'Auditorium rental for local theater group', method: 'Cheque' },
    { id: 'INC-2003', date: '2026-06-10', category: 'Merchandise Sales', amount: 45000, description: 'School uniform and tie sales', method: 'Cash / UPI' },
    { id: 'INC-2004', date: '2026-06-12', category: 'Donations', amount: 50000, description: 'Alumni association contribution', method: 'Bank Transfer' },
    { id: 'INC-2005', date: '2026-06-15', category: 'Bank Interest', amount: 8500, description: 'Quarterly savings account interest', method: 'Direct Credit' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Facility Rental',
    amount: '',
    description: '',
    method: 'Bank Transfer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const CATEGORIES = ['Government Grant', 'Facility Rental', 'Merchandise Sales', 'Donations', 'Bank Interest', 'Event Sponsorship', 'Other Income'];
  const COLORS = ['#10b981', '#059669', '#34d399', '#047857', '#6ee7b7', '#065f46']; // Emerald scale

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  // --- Derived Calculations ---
  const totalIncome = useMemo(() => incomes.reduce((sum, inc) => sum + inc.amount, 0), [incomes]);
  
  // Aggregate data for the Bar Chart
  const chartData = useMemo(() => {
    const categoryTotals = incomes.reduce((acc, inc) => {
      acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
      return acc;
    }, {});
    
    return Object.keys(categoryTotals).map((key) => ({
      category: key,
      amount: categoryTotals[key]
    })).sort((a, b) => b.amount - a.amount);
  }, [incomes]);

  const topCategory = chartData.length > 0 ? chartData[0] : { category: 'N/A', amount: 0 };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newIncome = {
      id: `INC-${2000 + incomes.length + 1}`,
      date: formData.date,
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description,
      method: formData.method
    };

    // Simulate API delay
    setTimeout(() => {
      setIncomes([newIncome, ...incomes]);
      setFormData({ ...formData, amount: '', description: '' });
      setIsSubmitting(false);
      // TODO: Add API POST request here
    }, 800);
  };

  const handleVoidReceipt = (id) => {
    if(window.confirm("Are you sure you want to void this income receipt? This action will be logged for auditing.")) {
        setIncomes(incomes.filter(inc => inc.id !== id));
        // TODO: Trigger API to soft-delete or mark status as 'Voided'
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Other Income & Revenue</h1>
        <p className="text-slate-500 mt-1">Record and analyze non-fee revenue streams like grants, rentals, and donations.</p>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
          <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-2">Total Additional Revenue</h3>
          <p className="text-4xl font-black">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Top Revenue Stream</h3>
          <p className="text-2xl font-bold text-slate-900">{topCategory.category}</p>
          <p className="text-sm font-medium text-emerald-600 mt-1">Generating {formatCurrency(topCategory.amount)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Receipts Generated</h3>
          <p className="text-3xl font-bold text-slate-900">{incomes.length}</p>
        </div>
      </div>

      {/* MAIN CONTENT: CHART & ENTRY FORM */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Left: Revenue Chart */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Revenue Breakdown</h2>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No revenue data</div>
            )}
          </div>
        </div>

        {/* Right: Add Income Form */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
             <h2 className="text-lg font-bold text-slate-800">Record Incoming Revenue</h2>
          </div>
          
          <form onSubmit={handleAddIncome} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Received Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 transition" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount Received (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold">₹</span>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} min="1" className="w-full border border-slate-300 rounded-xl p-3 pl-10 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition" placeholder="0.00" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Income Source / Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 bg-white">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <select name="method" value={formData.method} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Direct Credit">Direct Credit / Auto</option>
                  <option value="Cash / UPI">Cash / UPI</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Reference / Payer Details</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 transition" placeholder="e.g., UTR Number, or Name of the donating organization..." required />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmitting ? 'bg-emerald-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 shadow-emerald-200'}`}
              >
                {isSubmitting ? 'Generating Receipt...' : '+ Record Revenue'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* BOTTOM SECTION: TRANSACTION LEDGER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Income Ledger</h2>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition">Export Ledger &rarr;</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b">
                <th className="p-4 font-bold">Receipt ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Source</th>
                <th className="p-4 font-bold w-1/3">Reference Details</th>
                <th className="p-4 font-bold">Method</th>
                <th className="p-4 font-bold text-right">Amount</th>
                <th className="p-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {incomes.length > 0 ? (
                incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-emerald-50/50 transition duration-150">
                    <td className="p-4 font-medium text-slate-900">{income.id}</td>
                    <td className="p-4 text-slate-500">{income.date}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                        {income.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-xs">{income.description}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium">{income.method}</td>
                    <td className="p-4 text-right font-black text-emerald-600">{formatCurrency(income.amount)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleVoidReceipt(income.id)} className="text-slate-400 hover:text-rose-600 transition" title="Void Receipt">
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    No additional income recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SchoolIncome;