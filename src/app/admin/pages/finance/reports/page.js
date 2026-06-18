"use client"
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState('2026-2027');

  // Mock Database: Aggregated Financial Data
  // In production, your backend runs GROUP BY queries to generate this based on the selected dateRange
  const monthlyCashFlow = [
    { month: 'Apr', income: 450000, expense: 280000 },
    { month: 'May', income: 850000, expense: 310000 }, // Peak fee collection
    { month: 'Jun', income: 320000, expense: 250000 },
    { month: 'Jul', income: 280000, expense: 260000 },
    { month: 'Aug', income: 410000, expense: 270000 },
    { month: 'Sep', income: 750000, expense: 320000 }, // Term 2 fee collection
  ];

  const incomeBreakdown = [
    { name: 'Tuition Fees', value: 1850000 },
    { name: 'Transport Fees', value: 450000 },
    { name: 'Govt. Grants', value: 250000 },
    { name: 'Facility Rentals', value: 85000 },
    { name: 'Other Income', value: 55000 },
  ];

  const expenseBreakdown = [
    { name: 'Staff Salaries', value: 1100000 },
    { name: 'Maintenance', value: 250000 },
    { name: 'Utilities', value: 180000 },
    { name: 'Academic Supplies', value: 120000 },
    { name: 'Events', value: 40000 },
  ];

  // Colors for Charts
  const INCOME_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#64748b'];
  const EXPENSE_COLORS = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#64748b'];

  // Currency Formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  // --- Derived Calculations ---
  const totalIncome = useMemo(() => incomeBreakdown.reduce((sum, item) => sum + item.value, 0), []);
  const totalExpense = useMemo(() => expenseBreakdown.reduce((sum, item) => sum + item.value, 0), []);
  const netSurplus = totalIncome - totalExpense;
  const operatingMargin = ((netSurplus / totalIncome) * 100).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen print:bg-white print:p-0">
      
      {/* HEADER CONTROLS (Hidden on Print) */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Master Financial Report</h1>
          <p className="text-slate-500 mt-1">Executive overview of revenue, operational costs, and net surplus.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          >
            <option value="2026-2027">Academic Year 2026-2027</option>
            <option value="2025-2026">Academic Year 2025-2026</option>
            <option value="Q1-2026">Quarter 1 (Apr - Jun 2026)</option>
          </select>
          <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white font-bold py-2 px-6 rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* PRINT HEADER (Only visible when printing) */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-slate-900">Global Excellence Academy</h1>
        <h2 className="text-xl font-semibold text-slate-600 mt-1">Statement of Financial Performance</h2>
        <p className="text-sm font-bold bg-slate-100 inline-block px-4 py-1 rounded-full mt-3 uppercase tracking-widest text-slate-800">
          Period: {dateRange}
        </p>
      </div>

      {/* EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 print:border-slate-400">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(totalIncome)}</p>
          <p className="text-emerald-500 text-sm font-semibold mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            +12.5% vs Last Year
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 print:border-slate-400">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</h3>
          <p className="text-3xl font-black text-rose-600">{formatCurrency(totalExpense)}</p>
          <p className="text-rose-500 text-sm font-semibold mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
            +4.2% vs Last Year
          </p>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border print:border-slate-400 ${netSurplus >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${netSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Net Surplus / Deficit</h3>
          <p className={`text-3xl font-black ${netSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{formatCurrency(netSurplus)}</p>
          <p className={`text-sm font-semibold mt-2 ${netSurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            Operational Profit
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white print:bg-white print:text-slate-900 print:border print:border-slate-400">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 print:text-slate-500">Operating Margin</h3>
          <p className="text-3xl font-black">{operatingMargin}%</p>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden print:bg-slate-200">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(Math.max(operatingMargin, 0), 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* MAIN CASH FLOW CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 print:shadow-none print:border-slate-400 print:break-inside-avoid">
        <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Month-over-Month Cash Flow</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyCashFlow} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 500}} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}} 
                tickFormatter={(val) => `₹${val/1000}k`} 
              />
              <RechartsTooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontWeight: 600 }}/>
              <Area type="monotone" dataKey="income" name="Total Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="Total Expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHARTS (BREAKDOWNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-inside-avoid">
        
        {/* Income Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-slate-400">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Revenue Streams Analysis</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={incomeBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value">
                  {incomeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '13px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-slate-400">
          <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Operational Cost Analysis</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value">
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '13px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* FOOTER SIGNATURES (Only for Print) */}
      <div className="hidden print:grid grid-cols-3 gap-4 mt-20 pt-8 text-center text-sm font-bold text-slate-800">
        <div><div className="border-t-2 border-slate-800 w-48 mx-auto pt-2">Prepared By (Accountant)</div></div>
        <div><div className="border-t-2 border-slate-800 w-48 mx-auto pt-2">Financial Controller</div></div>
        <div><div className="border-t-2 border-slate-800 w-48 mx-auto pt-2">Principal / Director</div></div>
      </div>

    </div>
  );
};

export default FinancialReports;