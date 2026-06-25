"use client";

import React, { useState, useMemo } from "react";
import { 
  Printer, Search, Building, CheckCircle, ShieldCheck, 
  ArrowRightLeft, Users, ChevronLeft, Edit3, Database
} from "lucide-react";

// ================= DYNAMIC TEACHERS DATABASE (MOCK) =================
const TEACHERS_DB = [
  {
    id: "TCH-2026-042", name: "Anjali Sharma", designation: "Senior PGT", department: "Mathematics & Computing",
    panNumber: "ABCDE1234F", uanNumber: "100987654321", bankName: "HDFC Bank Ltd.", accountNo: "XXXXXXXXX4512",
    workingDays: 26, presentDays: 26,
    defaultEarnings: [
      { id: 1, name: "Basic Salary", amount: 45000 },
      { id: 2, name: "House Rent Allowance (HRA)", amount: 18000 },
      { id: 3, name: "Dearness Allowance (DA)", amount: 5400 },
      { id: 4, name: "Special Allowance", amount: 3500 },
    ],
    defaultDeductions: [
      { id: 1, name: "Provident Fund (EPF)", amount: 5400 },
      { id: 2, name: "Tax Deducted at Source (TDS)", amount: 2100 },
      { id: 3, name: "Professional Tax", amount: 200 },
    ]
  },
  {
    id: "TCH-2026-018", name: "Vikram Rathore", designation: "TGT Teacher", department: "Science (Physics)",
    panNumber: "VXYZA9876K", uanNumber: "100987659999", bankName: "ICICI Bank", accountNo: "XXXXXXXXX8890",
    workingDays: 26, presentDays: 24, // 2 days absent
    defaultEarnings: [
      { id: 1, name: "Basic Salary", amount: 38000 },
      { id: 2, name: "House Rent Allowance (HRA)", amount: 15200 },
      { id: 3, name: "Dearness Allowance (DA)", amount: 4560 },
      { id: 4, name: "Special Allowance", amount: 2000 },
    ],
    defaultDeductions: [
      { id: 1, name: "Provident Fund (EPF)", amount: 4560 },
      { id: 2, name: "Tax Deducted at Source (TDS)", amount: 1200 },
      { id: 3, name: "Professional Tax", amount: 200 },
      { id: 4, name: "Leave Deduction", amount: 2500 }, // Editable later
    ]
  },
  {
    id: "TCH-2026-089", name: "Meera Nair", designation: "Primary Teacher", department: "English Literature",
    panNumber: "MNPQR4567L", uanNumber: "100987651111", bankName: "SBI Bank", accountNo: "XXXXXXXXX3321",
    workingDays: 26, presentDays: 26,
    defaultEarnings: [
      { id: 1, name: "Basic Salary", amount: 32000 },
      { id: 2, name: "House Rent Allowance (HRA)", amount: 12800 },
      { id: 3, name: "Dearness Allowance (DA)", amount: 3840 },
    ],
    defaultDeductions: [
      { id: 1, name: "Provident Fund (EPF)", amount: 3840 },
      { id: 2, name: "Professional Tax", amount: 200 },
    ]
  }
];

// Helpers
const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if ((num = num.toString()).length > 9) return 'Overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() + ' Only';
};

export default function PayrollWorkspace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Editable Form States
  const [earningsForm, setEarningsForm] = useState([]);
  const [deductionsForm, setDeductionsForm] = useState([]);
  const payMonth = "June 2026";

  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, success

  // Filter Teachers List
  const filteredTeachers = useMemo(() => {
    return TEACHERS_DB.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Load Teacher into Editor
  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setEarningsForm(JSON.parse(JSON.stringify(teacher.defaultEarnings))); // Deep copy
    setDeductionsForm(JSON.parse(JSON.stringify(teacher.defaultDeductions)));
    setPaymentStatus("pending");
  };

  // Back to Roster
  const handleBack = () => {
    setSelectedTeacher(null);
    setPaymentStatus("pending");
  };

  // Handle Form Edits
  const handleEarningChange = (index, value) => {
    const newEarnings = [...earningsForm];
    newEarnings[index].amount = Number(value) || 0;
    setEarningsForm(newEarnings);
  };

  const handleDeductionChange = (index, value) => {
    const newDeductions = [...deductionsForm];
    newDeductions[index].amount = Number(value) || 0;
    setDeductionsForm(newDeductions);
  };

  // Live Calculations
  const totalEarnings = useMemo(() => earningsForm.reduce((sum, item) => sum + item.amount, 0), [earningsForm]);
  const totalDeductions = useMemo(() => deductionsForm.reduce((sum, item) => sum + item.amount, 0), [deductionsForm]);
  const netSalary = totalEarnings - totalDeductions;
  const amountInWords = useMemo(() => numberToWords(netSalary), [netSalary]);

  // Simulate Process & Sync
  const handleProcessSalary = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStatus("success");
    }, 2000);
  };

  // ================= VIEW 1: TEACHERS DIRECTORY LISTING =================
  if (!selectedTeacher) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">
                <Users size={14} /> Staff Payroll Directory
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select Teacher for Payroll</h1>
              <p className="text-xs text-slate-500 mt-0.5">Search and select a faculty member to edit and generate their salary slip.</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-24">Employee ID</th>
                  <th className="p-4">Teacher Identity</th>
                  <th className="p-4">Department & Role</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-mono font-bold text-slate-500">{teacher.id}</td>
                    <td className="p-4 font-bold text-slate-900">{teacher.name}</td>
                    <td className="p-4 text-slate-600">
                      <span className="block">{teacher.designation}</span>
                      <span className="text-[10px] uppercase text-slate-400 font-bold">{teacher.department}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleSelectTeacher(teacher)}
                        className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-100 px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs"
                      >
                        Generate Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW 2: EDIT SALARY & GENERATE RECEIPT =================
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-800 font-sans print:p-0 print:bg-white">
      
      {/* Dynamic Success Toast for DB Sync */}
      {paymentStatus === "success" && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-1 animate-in fade-in slide-in-from-top-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 p-1 rounded-full text-xs text-white"><Database size={12} /></span>
            <p className="text-sm font-bold text-emerald-400">Synced to Teacher Portal DB!</p>
          </div>
          <p className="text-[10px] text-slate-400 font-mono ml-6">{selectedTeacher.id} • Payslip Available in Faculty App</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 print:block">
        
        {/* Back Button & Header (Hidden on Print) */}
        <div className="flex items-center justify-between print:hidden">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition">
            <ChevronLeft size={16} /> Back to Directory
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
          
          {/* ================= LEFT PANEL: EDITABLE FORMS (HIDDEN ON PRINT) ================= */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 size={18} className="text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">Edit Salary Details</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">Modifying details for <span className="text-slate-900 font-bold">{selectedTeacher.name}</span>.</p>

              {/* Earnings Editor */}
              <div className="space-y-3 mb-6">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider border-b pb-1">Earnings Structure</h3>
                {earningsForm.map((item, idx) => (
                  <div key={item.id} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">{item.name}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono font-bold">₹</span>
                      <input 
                        type="number" 
                        value={item.amount} 
                        onChange={(e) => handleEarningChange(idx, e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm font-bold font-mono text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Deductions Editor */}
              <div className="space-y-3 mb-8">
                <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-wider border-b pb-1">Deductions</h3>
                {deductionsForm.map((item, idx) => (
                  <div key={item.id} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">{item.name}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-mono font-bold">₹</span>
                      <input 
                        type="number" 
                        value={item.amount} 
                        onChange={(e) => handleDeductionChange(idx, e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm font-bold font-mono text-slate-900"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {paymentStatus === "pending" ? (
                <button 
                  onClick={handleProcessSalary}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="animate-pulse flex items-center gap-2"><ArrowRightLeft size={16} className="animate-spin" /> Processing & Syncing...</span>
                  ) : (
                    <>Process & Disburse {formatINR(netSalary)}</>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-3 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-sm text-center">
                    <span className="flex items-center gap-1"><CheckCircle size={16} /> Salary Disbursed</span>
                    <span className="text-[10px] font-semibold text-emerald-600">Synced to Teacher Portal</span>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Printer size={16} /> Print Official Payslip
                  </button>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
              <Database size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold text-indigo-800 leading-relaxed">
                Clicking "Process & Disburse" locks the receipt parameters and securely pushes the generated slip to the respective Teacher's independent portal via DB.
              </p>
            </div>
          </div>

          {/* ================= RIGHT PANEL: LIVE A4 PRINTABLE RECEIPT ================= */}
          <div className="lg:col-span-8 print:col-span-12">
            
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 relative overflow-hidden print:border-none print:shadow-none print:p-0 transition-all">
              
              {/* PAID Watermark */}
              {paymentStatus === "success" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
                  <span className="text-[80px] sm:text-[130px] font-black text-emerald-600 -rotate-45 tracking-widest border-8 border-emerald-600 px-8 py-4 rounded-3xl">
                    DISBURSED
                  </span>
                </div>
              )}

              <div className="relative z-10">
                {/* Slip Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-slate-900 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-2xl">GW</div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Greenwood International School</h1>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Plot 4B, Knowledge Park, Greater Noida, UP - 201310</p>
                      <p className="text-xs text-slate-500 font-medium">Affiliation No: CBSE/2130894 | HR Dept: hr@greenwood.edu.in</p>
                    </div>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center mb-8">
                  <span className="inline-block bg-slate-100 text-slate-800 font-black text-lg px-6 py-2 rounded-lg border border-slate-300 uppercase tracking-widest">
                    Payslip for {payMonth}
                  </span>
                </div>

                {/* Employee Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 text-xs font-semibold text-slate-700 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"><span className="text-slate-500 font-bold uppercase text-[9px]">Employee Name:</span> <span className="text-slate-900 font-black">{selectedTeacher.name}</span></p>
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"><span className="text-slate-500 font-bold uppercase text-[9px]">Employee ID:</span> <span className="font-mono text-slate-900">{selectedTeacher.id}</span></p>
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"><span className="text-slate-500 font-bold uppercase text-[9px]">Designation:</span> <span>{selectedTeacher.designation}</span></p>
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"><span className="text-slate-500 font-bold uppercase text-[9px]">Department:</span> <span>{selectedTeacher.department}</span></p>
                  
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5 mt-2"><span className="text-slate-500 font-bold uppercase text-[9px]">Bank Name:</span> <span>{selectedTeacher.bankName}</span></p>
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5 mt-2"><span className="text-slate-500 font-bold uppercase text-[9px]">Account Number:</span> <span className="font-mono">{selectedTeacher.accountNo}</span></p>
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"><span className="text-slate-500 font-bold uppercase text-[9px]">PAN Number:</span> <span className="font-mono">{selectedTeacher.panNumber}</span></p>
                  <p className="flex justify-between border-b border-dashed border-slate-200 pb-1.5"><span className="text-slate-500 font-bold uppercase text-[9px]">UAN Number:</span> <span className="font-mono">{selectedTeacher.uanNumber}</span></p>

                  <p className="flex justify-between pt-1"><span className="text-slate-500 font-bold uppercase text-[9px]">Working Days:</span> <span>{selectedTeacher.workingDays}</span></p>
                  <p className="flex justify-between pt-1"><span className="text-slate-500 font-bold uppercase text-[9px]">Present Days:</span> <span>{selectedTeacher.presentDays}</span></p>
                </div>

                {/* Live Salary Breakdown Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-2 border-slate-900 rounded-xl overflow-hidden mb-6">
                  
                  {/* Earnings */}
                  <div className="border-b sm:border-b-0 sm:border-r border-slate-400">
                    <div className="bg-slate-100 text-slate-800 font-black uppercase text-[10px] tracking-wider p-3 border-b border-slate-300 flex justify-between">
                      <span>Earnings</span><span>Amount (₹)</span>
                    </div>
                    <div className="p-3 space-y-3 min-h-[160px]">
                      {earningsForm.map(item => (
                        <div key={item.id} className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{item.name}</span><span className="font-mono">{formatINR(item.amount).replace('₹', '')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-3 border-t border-slate-300 flex justify-between text-sm">
                      <span className="font-black text-slate-900">Gross Earnings</span>
                      <span className="font-black font-mono text-emerald-700">{formatINR(totalEarnings)}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <div className="bg-slate-100 text-slate-800 font-black uppercase text-[10px] tracking-wider p-3 border-b border-slate-300 flex justify-between">
                      <span>Deductions</span><span>Amount (₹)</span>
                    </div>
                    <div className="p-3 space-y-3 min-h-[160px]">
                      {deductionsForm.map(item => (
                        <div key={item.id} className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{item.name}</span><span className="font-mono">{formatINR(item.amount).replace('₹', '')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-3 border-t border-slate-300 flex justify-between text-sm">
                      <span className="font-black text-slate-900">Total Deductions</span>
                      <span className="font-black font-mono text-rose-600">{formatINR(totalDeductions)}</span>
                    </div>
                  </div>

                </div>

                {/* Net Payable */}
                <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 shadow-sm">
                  <div className="text-center sm:text-left mb-2 sm:mb-0">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net Salary Payable</span>
                    <p className="text-sm font-semibold mt-1">Rupees {amountInWords}</p>
                  </div>
                  <div className="text-2xl font-black font-mono tracking-tight text-emerald-400">
                    {formatINR(netSalary)}
                  </div>
                </div>

                {/* Signatures */}
                <div className="flex flex-col sm:flex-row justify-between items-end gap-8 mt-16 px-4">
                  <div className="w-full sm:w-1/3 text-center pt-6 border-t border-slate-400">
                    <p className="text-xs font-black uppercase text-slate-900">Employee Signature</p>
                  </div>
                  <div className="w-full sm:w-1/3 text-center pt-6 border-t border-slate-400">
                    <p className="text-xs font-black uppercase text-slate-900">Authorized Signatory</p>
                    <p className="text-[9px] font-bold text-slate-500 mt-0.5">Finance / HR Department</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}