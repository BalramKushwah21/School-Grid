"use client"
import React, { useState, useMemo } from 'react';

const INITIAL_TEACHERS = [
  { id: "TCH-2024-101", name: "Dr. Sarah Jenkins", department: "Science", designation: "Head of Physics", baseSalary: 6200, status: "Paid" },
  { id: "TCH-2024-102", name: "Marcus Aurelius Vance", department: "Mathematics", designation: "Calculus Lecturer", baseSalary: 5500, status: "Processing" },
  { id: "TCH-2024-103", name: "Elena Rostova", department: "Languages", designation: "AP Lit Teacher", baseSalary: 4800, status: "Paid" },
  { id: "TCH-2024-104", name: "Raymond Reddington", department: "Social Studies", designation: "World History Instructor", baseSalary: 5100, status: "Pending" }
];

export default function App() {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [selectedTeacherId, setSelectedTeacherId] = useState(INITIAL_TEACHERS[0].id);
  const [theme, setTheme] = useState('indigo'); // indigo, emerald, amber
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionLogs, setTransactionLogs] = useState([]);

  // Pay Stub Variables
  const [payPeriod, setPayPeriod] = useState("June 2026");
  const [workingDays, setWorkingDays] = useState(22);
  const [daysPresent, setDaysPresent] = useState(22);
  const [bonusPay, setBonusPay] = useState(350);
  const [taxDeductionRate, setTaxDeductionRate] = useState(12); // Percent
  const [insuranceDeduction, setInsuranceDeduction] = useState(150); // Flat

  // Get current selected teacher object
  const activeTeacher = useMemo(() => {
    return teachers.find(t => t.id === selectedTeacherId) || teachers[0];
  }, [teachers, selectedTeacherId]);

  // Derived Calculations
  const calculations = useMemo(() => {
    const proratedBase = Math.round((activeTeacher.baseSalary / workingDays) * daysPresent);
    const grossPay = proratedBase + Number(bonusPay);
    const taxAmount = Math.round(grossPay * (taxDeductionRate / 100));
    const totalDeductions = taxAmount + Number(insuranceDeduction);
    const netSalary = grossPay - totalDeductions;

    return { proratedBase, grossPay, taxAmount, totalDeductions, netSalary };
  }, [activeTeacher, workingDays, daysPresent, bonusPay, taxDeductionRate, insuranceDeduction]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalProcessed = teachers.length;
    const paid = teachers.filter(t => t.status === "Paid").length;
    const processing = teachers.filter(t => t.status === "Processing").length;
    const pending = teachers.filter(t => t.status === "Pending").length;
    
    // Total estimated payroll cost (using teachers' basic base pay totals)
    const totalCost = teachers.reduce((sum, t) => sum + t.baseSalary, 0);

    return { totalProcessed, paid, processing, pending, totalCost };
  }, [teachers]);

  // Handle pay record dispatch
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setLoading(true);

    const generatedTxId = 'TXN-2026-' + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      setLoading(false);
      setIsSaved(true);

      // Update current status in list
      setTeachers(prev => prev.map(t => {
        if (t.id === selectedTeacherId) {
          return { ...t, status: "Paid" };
        }
        return t;
      }));

      // Append Transaction to Server Sync Log
      setTransactionLogs(prev => [
        {
          txId: generatedTxId,
          name: activeTeacher.name,
          payout: calculations.netSalary,
          period: payPeriod,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }, 1500);
  };

  // Quick select dynamic theme details
  const themes = {
    indigo: { accent: 'text-indigo-600', border: 'border-indigo-600', fill: 'bg-indigo-600 hover:bg-indigo-700', badge: 'bg-indigo-50 text-indigo-700 border-indigo-150' },
    emerald: { accent: 'text-emerald-600', border: 'border-emerald-600', fill: 'bg-emerald-600 hover:bg-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-150' },
    amber: { accent: 'text-amber-600', border: 'border-amber-600', fill: 'bg-amber-600 hover:bg-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-150' }
  };

  const currentTheme = themes[theme];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
      {/* ================= HEADER PANEL ================= */}
      <header className="bg-white border-b border-slate-200 py-6 px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Faculty Payroll & Wage Administration</h1>
            <p className="text-sm text-slate-500 mt-1">
              Verify monthly teaching schedules, calculate allowances, manage tax deductibles, and print verified slips.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Aesthetic:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button onClick={() => { setTheme('indigo'); setIsSaved(false); }} className={`w-6 h-6 rounded bg-indigo-600 transition ${theme === 'indigo' ? 'ring-2 ring-indigo-400 scale-110' : 'opacity-60'}`}></button>
              <button onClick={() => { setTheme('emerald'); setIsSaved(false); }} className={`w-6 h-6 rounded bg-emerald-600 transition ${theme === 'emerald' ? 'ring-2 ring-emerald-400 scale-110' : 'opacity-60'}`}></button>
              <button onClick={() => { setTheme('amber'); setIsSaved(false); }} className={`w-6 h-6 rounded bg-amber-500 transition ${theme === 'amber' ? 'ring-2 ring-amber-400 scale-110' : 'opacity-60'}`}></button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= STATISTICS PANEL ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 print:hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Outflow</span>
            <span className="text-2xl font-black text-slate-900">${stats.totalCost.toLocaleString()}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Members</span>
            <span className="text-2xl font-black text-emerald-600">{stats.paid} <span className="text-xs font-medium text-slate-400">/ {stats.totalProcessed}</span></span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">In Processing Queue</span>
            <span className="text-2xl font-black text-amber-500">{stats.processing}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Unprocessed / Pending</span>
            <span className="text-2xl font-black text-rose-500">{stats.pending}</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN INTERACTIVE MATRIX ================= */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: Teacher Select & Interactive Calculator Form */}
        <section className="lg:col-span-5 space-y-6 print:hidden">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
              Salary Computation Console
            </h2>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Select Educator */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Select Faculty Member</label>
                <select 
                  value={selectedTeacherId} 
                  onChange={(e) => { setSelectedTeacherId(e.target.value); setIsSaved(false); }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.id.split('-').pop()})</option>
                  ))}
                </select>
              </div>

              {/* Pay Period & Workday Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Wage Term / Period</label>
                  <input 
                    type="text" value={payPeriod} onChange={(e) => { setPayPeriod(e.target.value); setIsSaved(false); }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" placeholder="e.g. June 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Expected Days</label>
                  <input 
                    type="number" value={workingDays} onChange={(e) => { setWorkingDays(Math.max(1, e.target.value)); setIsSaved(false); }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
                  />
                </div>
              </div>

              {/* Days Present & Special Bonuses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Days Present</label>
                  <input 
                    type="number" max={workingDays} value={daysPresent} onChange={(e) => { setDaysPresent(Math.min(workingDays, Math.max(0, e.target.value))); setIsSaved(false); }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bonuses / Extras ($)</label>
                  <input 
                    type="number" value={bonusPay} onChange={(e) => { setBonusPay(Math.max(0, e.target.value)); setIsSaved(false); }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
                  />
                </div>
              </div>

              {/* Deductibles / Taxes */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tax Withholding (%)</label>
                  <input 
                    type="number" max="100" value={taxDeductionRate} onChange={(e) => { setTaxDeductionRate(Math.max(0, e.target.value)); setIsSaved(false); }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Benefits / Insur. ($)</label>
                  <input 
                    type="number" value={insuranceDeduction} onChange={(e) => { setInsuranceDeduction(Math.max(0, e.target.value)); setIsSaved(false); }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none"
                  />
                </div>
              </div>

              {/* Complete Payout Call */}
              <button 
                type="submit" 
                disabled={loading || activeTeacher.status === "Paid" && isSaved}
                className={`w-full mt-2 text-white p-3 font-semibold rounded-lg transition text-sm shadow flex items-center justify-center gap-2 ${
                  loading ? 'bg-slate-400' : isSaved && activeTeacher.status === "Paid" ? 'bg-emerald-600 hover:bg-emerald-700' : currentTheme.fill
                }`}
              >
                {loading ? 'Pushing Bank Transfer...' : isSaved ? '✓ Payout Confirmed' : 'Authorize & Disburse Wages'}
              </button>
            </form>
          </div>

          {/* SIMULATED SYSTEM TRANSACTION LOG */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Ledger Transmissions</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactionLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No wage payouts dispatched during active operational session.</p>
              ) : (
                transactionLogs.map((log) => (
                  <div key={log.txId} className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{log.name}</p>
                      <p className="text-[9px] text-indigo-600 font-mono font-bold tracking-tight">{log.txId} • {log.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+${log.payout.toLocaleString()}</p>
                      <p className="text-[8px] text-slate-400 font-mono font-bold">{log.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: Wage Slip Canvas Preview Sheet */}
        <section className="lg:col-span-7 flex flex-col items-center print:w-full print:p-0">
          
          {/* Action Header Banner */}
          <div className="w-full max-w-2xl mb-4 bg-slate-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-xs font-semibold">
                {isSaved ? "Verified & Transferred Statement" : "Unverified Temporary Pay Statement"}
              </span>
            </div>
            
            <button 
              onClick={() => window.print()}
              disabled={!isSaved}
              className={`px-5 py-2 text-xs font-extrabold rounded-lg shadow-lg transition-all ${
                isSaved 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Print Official Slip
            </button>
          </div>

          {/* Payslip Document Canvas Layout (Strict Golden Ratio Frame) */}
          <div className="w-full max-w-2xl bg-white p-10 border-[6px] border-double border-slate-800 shadow-2xl rounded-sm aspect-[1/1.41] relative flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
            
            {/* Top School Branding Header */}
            <div>
              <div className="text-center border-b border-slate-800 pb-4 mb-6">
                <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900">EXCEL ACADEMY INTERNATIONAL</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Faculty & Staff Compensation Disbursement File</p>
                <span className="inline-block bg-slate-900 text-white font-mono font-bold px-3 py-0.5 text-[10px] uppercase tracking-widest mt-3 rounded-sm">
                  Official Salary Certificate
                </span>
              </div>

              {/* Header Info Rows */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6 border-b border-dashed border-slate-200 pb-4">
                <div className="space-y-1">
                  <p><span className="font-semibold text-slate-400">Employee Name:</span> <span className="font-extrabold text-slate-900">{activeTeacher.name}</span></p>
                  <p><span className="font-semibold text-slate-400">Department:</span> <span className="font-bold text-slate-800">{activeTeacher.department}</span></p>
                  <p><span className="font-semibold text-slate-400">Official Designation:</span> <span className="font-medium text-slate-600">{activeTeacher.designation}</span></p>
                </div>
                <div className="text-right space-y-1">
                  <p><span className="font-semibold text-slate-400">Disbursement Cycle:</span> <span className="font-bold text-slate-800">{payPeriod}</span></p>
                  <p><span className="font-semibold text-slate-400">Faculty File ID:</span> <span className="font-mono font-bold text-slate-900">{activeTeacher.id}</span></p>
                  <p><span className="font-semibold text-slate-400">Operational Session:</span> <span className="font-mono text-slate-500 font-bold">2026_DISB_04</span></p>
                </div>
              </div>

              {/* Main Financial Wages Table */}
              <div className="space-y-4">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase text-[9px] tracking-wider">
                      <th className="p-2.5">Earnings Description</th>
                      <th className="p-2.5 text-right">Amount</th>
                      <th className="p-2.5">Deductions & Offsets</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 font-medium">
                      <td className="p-2.5 text-slate-600">Base Salary Scale (Monthly)</td>
                      <td className="p-2.5 text-right text-slate-800">${activeTeacher.baseSalary.toLocaleString()}</td>
                      <td className="p-2.5 text-slate-600">Income Tax Witheld ({taxDeductionRate}%)</td>
                      <td className="p-2.5 text-right text-rose-700">-${calculations.taxAmount.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100 font-medium">
                      <td className="p-2.5 text-slate-600">Prorated Basic Payout ({daysPresent}/{workingDays} days)</td>
                      <td className="p-2.5 text-right text-slate-800">${calculations.proratedBase.toLocaleString()}</td>
                      <td className="p-2.5 text-slate-600">Insurance & Pension Premiums</td>
                      <td className="p-2.5 text-right text-rose-700">-${Number(insuranceDeduction).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-100 font-medium">
                      <td className="p-2.5 text-slate-600">Special Administrative Bonus</td>
                      <td className="p-2.5 text-right text-slate-800">${Number(bonusPay).toLocaleString()}</td>
                      <td className="p-2.5 text-slate-600">Additional Levy Offsets</td>
                      <td className="p-2.5 text-right text-rose-700">-$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summaries Blocks */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-slate-200">
                <div className="bg-slate-50 p-3 rounded border border-slate-100 print:bg-transparent">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Gross Monthly Income</span>
                  <span className="text-sm font-extrabold text-slate-800">${calculations.grossPay.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100 print:bg-transparent text-right">
                  <span className="block text-[8px] uppercase font-bold text-slate-400">Total Deductibles Sum</span>
                  <span className="text-sm font-extrabold text-rose-700">-${calculations.totalDeductions.toLocaleString()}</span>
                </div>
              </div>

              {/* Net Payout Banner highlight with current theme accent */}
              <div className={`mt-6 p-4 border rounded-lg flex items-center justify-between ${currentTheme.badge}`}>
                <div>
                  <span className="block text-[9px] uppercase font-black tracking-wider opacity-60">Net Disbursed Take-Home Amount</span>
                  <span className="text-xs font-semibold italic text-slate-500">Credited to Registered Teacher Account</span>
                </div>
                <span className="text-2xl font-black">${calculations.netSalary.toLocaleString()}</span>
              </div>
            </div>

            {/* Bottom Signature Seals Block */}
            <div className="flex justify-between items-end border-t border-slate-100 pt-8 text-[9px] font-bold text-slate-500">
              <div className="text-center">
                <div className="w-24 border-t border-slate-350 mx-auto mb-1"></div>
                <span>Faculty Recipient Signature</span>
              </div>

              {/* Visual payment validation stamp */}
              <div className="text-center flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full border-2 ${isSaved ? 'border-emerald-500/40 text-emerald-600' : 'border-amber-500/40 text-amber-600'} flex items-center justify-center p-1`}>
                  <div className={`w-full h-full rounded-full border border-dashed ${isSaved ? 'border-emerald-500/50' : 'border-amber-500/50'} flex flex-col items-center justify-center text-[7px] font-black`}>
                    <span>{isSaved ? "RELEASED" : "COMPUTING"}</span>
                    <span className="text-[4px] font-bold mt-0.5">TREASURY</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 border-t border-slate-350 mx-auto mb-1"></div>
                <span>Disbursing Registrar Seal</span>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}