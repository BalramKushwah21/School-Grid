"use client"
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SchoolExpenses = () => {
  // Mock Database: Recent Expense Transactions
  const [expenses, setExpenses] = useState([
    { id: 'EXP-1001', date: '2026-06-15', category: 'Maintenance', amount: 15000, description: 'Plumbing repair in Block B', paymentMethod: 'Bank Transfer' },
    { id: 'EXP-1002', date: '2026-06-16', category: 'Utilities', amount: 45000, description: 'Electricity Bill - May', paymentMethod: 'Auto-Debit' },
    { id: 'EXP-1003', date: '2026-06-17', category: 'Academic Supplies', amount: 8500, description: 'New whiteboard markers and dusters', paymentMethod: 'Petty Cash' },
    { id: 'EXP-1004', date: '2026-06-18', category: 'Events', amount: 25000, description: 'Annual Sports Day tent rental deposit', paymentMethod: 'Cheque' },
  ]);

  // State for adding a new expense
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Academic Supplies',
    amount: '',
    description: '',
    paymentMethod: 'Bank Transfer'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const CATEGORIES = ['Academic Supplies', 'Maintenance', 'Utilities', 'Staff Salaries', 'Events', 'Transportation', 'Miscellaneous'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  // --- Derived Calculations for Dashboard ---
  const totalExpenses = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  
  // Prepare data for the Donut Chart
  const chartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
    
    return Object.keys(categoryTotals).map((key) => ({
      name: key,
      value: categoryTotals[key]
    })).sort((a, b) => b.value - a.value); // Sort largest to smallest
  }, [expenses]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newExpense = {
      id: `EXP-${1000 + expenses.length + 1}`,
      date: formData.date,
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description,
      paymentMethod: formData.paymentMethod
    };

    // Simulate API delay
    setTimeout(() => {
      setExpenses([newExpense, ...expenses]); // Add to top of list
      setFormData({ ...formData, amount: '', description: '' }); // Reset text fields
      setIsSubmitting(false);
      // TODO: Add actual API POST request here
    }, 800);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to void this expense voucher?")) {
        setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Outbound Expenses</h1>
        <p className="text-slate-500 mt-1">Track operational costs, manage vouchers, and analyze spending patterns.</p>
      </div>

      {/* TOP DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total Monthly Spend</h3>
          <p className="text-4xl font-black">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Largest Expense Category</h3>
          <p className="text-2xl font-bold text-slate-900">
            {chartData.length > 0 ? chartData[0].name : 'N/A'}
          </p>
          {chartData.length > 0 && (
            <p className="text-sm font-medium text-rose-500 mt-1">Accounts for {((chartData[0].value / totalExpenses) * 100).toFixed(1)}% of total</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Vouchers Processed</h3>
          <p className="text-3xl font-bold text-slate-900">{expenses.length}</p>
        </div>
      </div>

      {/* MIDDLE SECTION: CHART & ENTRY FORM */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Left: Donut Chart */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Expense Distribution</h2>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No data to display</div>
            )}
          </div>
        </div>

        {/* Right: Add Expense Form */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
             <h2 className="text-lg font-bold text-slate-800">Generate New Payment Voucher</h2>
          </div>
          
          <form onSubmit={handleAddExpense} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 transition" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold">₹</span>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} min="1" className="w-full border border-slate-300 rounded-xl p-3 pl-10 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition" placeholder="0.00" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="Petty Cash">Petty Cash</option>
                  <option value="Credit Card">Corporate Credit Card</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Vendor Details</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g., Purchased lab chemicals from ABC Suppliers..." required />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmitting ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Processing Voucher...' : '+ Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* BOTTOM SECTION: TRANSACTION LEDGER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions Ledger</h2>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">Download Excel CSV &rarr;</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-500 text-xs uppercase tracking-wider border-b">
                <th className="p-4 font-bold">Voucher ID</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold w-1/3">Description</th>
                <th className="p-4 font-bold">Method</th>
                <th className="p-4 font-bold text-right">Amount</th>
                <th className="p-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="p-4 font-medium text-slate-900">{expense.id}</td>
                    <td className="p-4 text-slate-500">{expense.date}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 truncate max-w-xs">{expense.description}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium">{expense.paymentMethod}</td>
                    <td className="p-4 text-right font-bold text-rose-600">{formatCurrency(expense.amount)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(expense.id)} className="text-slate-400 hover:text-rose-600 transition">
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    No expenses recorded yet.
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

export default SchoolExpenses;