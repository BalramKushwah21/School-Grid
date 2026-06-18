"use client"
import React, { useState, useEffect } from 'react';

const FeeCollection = () => {
  // Mock Database: Students with their fee status
  const mockDatabase = [
    { id: 101, rollNo: '10A-01', name: 'Aarav Sharma', class: 'Class 10 - A', parentContact: '9876543210', totalFee: 65000, amountPaid: 25000 },
    { id: 102, rollNo: '10A-02', name: 'Priya Patel', class: 'Class 10 - A', parentContact: '9876543211', totalFee: 65000, amountPaid: 65000 },
    { id: 103, rollNo: '11S-05', name: 'Rohan Gupta', class: 'Class 11 - Science', parentContact: '9876543212', totalFee: 78500, amountPaid: 0 },
  ];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Cash',
    remarks: ''
  });
  const [transactionStatus, setTransactionStatus] = useState('idle'); // idle, processing, success

  // Derived calculations
  const dueAmount = selectedStudent ? selectedStudent.totalFee - selectedStudent.amountPaid : 0;
  const liveBalance = selectedStudent ? dueAmount - (parseFloat(paymentData.amount) || 0) : 0;
  const isFullyPaid = dueAmount === 0;

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    // Simulate database lookup by Roll No or Name
    const found = mockDatabase.find(s => 
      s.rollNo.toLowerCase() === searchQuery.toLowerCase() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSelectedStudent(found || null);
    setTransactionStatus('idle');
    setPaymentData({ amount: '', method: 'Cash', remarks: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Prevent entering more than the due amount
    if (name === 'amount' && parseFloat(value) > dueAmount) {
      setPaymentData({ ...paymentData, [name]: dueAmount.toString() });
      return;
    }
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) return;

    setTransactionStatus('processing');
    
    // Simulate API Call delay
    setTimeout(() => {
      // Update local state to reflect payment success
      setSelectedStudent(prev => ({
        ...prev,
        amountPaid: prev.amountPaid + parseFloat(paymentData.amount)
      }));
      setTransactionStatus('success');
      
      // TODO: Add actual API POST request here
      // example: axios.post('/api/finance/collect', { studentId: selectedStudent.id, ...paymentData })
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fee Collection Terminal</h1>
        <p className="text-slate-500 mt-1">Search students, process payments, and generate instant receipts.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: SEARCH & PAYMENT ENTRY */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm" 
                  placeholder="Search by Roll No (e.g., 10A-01) or Student Name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition shadow-sm">
                Lookup
              </button>
            </form>
          </div>

          {/* Student Info & Payment Form */}
          {selectedStudent && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
              
              {/* Profile Ribbon */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h2>
                    <p className="text-sm text-slate-500">{selectedStudent.rollNo} • {selectedStudent.class}</p>
                  </div>
                </div>
                {isFullyPaid && (
                  <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    No Dues Pending
                  </span>
                )}
              </div>

              {/* Payment Entry Form */}
              {!isFullyPaid ? (
                <div className="p-6">
                  <form onSubmit={handleProcessPayment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Amount (INR)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold">₹</span>
                          <input 
                            type="number" 
                            name="amount" 
                            value={paymentData.amount} 
                            onChange={handleInputChange} 
                            max={dueAmount}
                            className="block w-full pl-10 pr-3 py-3 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-slate-900" 
                            placeholder="0" 
                            required 
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Max allowed: {formatCurrency(dueAmount)}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                        <select name="method" value={paymentData.method} onChange={handleInputChange} className="block w-full px-3 py-3 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700">
                          <option value="Cash">Cash</option>
                          <option value="Credit/Debit Card">Credit / Debit Card</option>
                          <option value="UPI / QR">UPI / QR Code</option>
                          <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction Remarks / Reference No. (Optional)</label>
                        <input type="text" name="remarks" value={paymentData.remarks} onChange={handleInputChange} className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., UTR Number or Cheque No..." />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={transactionStatus === 'processing'}
                      className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${transactionStatus === 'processing' ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'}`}
                    >
                      {transactionStatus === 'processing' ? 'Processing Transaction...' : `Collect ${formatCurrency(paymentData.amount || 0)}`}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-500 text-lg">This student has cleared all dues for the current academic session.</p>
                </div>
              )}
            </div>
          )}

          {/* Not Found State */}
          {!selectedStudent && searchQuery !== '' && transactionStatus === 'idle' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               No student found matching "{searchQuery}". Please check the Roll Number.
            </div>
          )}

        </div>

        {/* RIGHT PANEL: LIVE RECEIPT / FINANCIAL SUMMARY */}
        {selectedStudent && (
          <div className="xl:col-span-1">
            <div className={`bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl text-white sticky top-6 transition-all duration-500 ${transactionStatus === 'success' ? 'ring-4 ring-emerald-500' : ''}`}>
              
              <div className="text-center pb-6 border-b border-slate-700 mb-6">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Fee Statement</h3>
                <p className="text-2xl font-light">{selectedStudent.rollNo}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Annual Fee</span>
                  <span className="font-semibold">{formatCurrency(selectedStudent.totalFee)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Previously Paid</span>
                  <span className="font-semibold">- {formatCurrency(selectedStudent.amountPaid - (transactionStatus === 'success' ? parseFloat(paymentData.amount) : 0))}</span>
                </div>
                <div className="flex justify-between items-center text-red-300 font-medium">
                  <span>Previous Due</span>
                  <span>{formatCurrency(transactionStatus === 'success' ? dueAmount + parseFloat(paymentData.amount) : dueAmount)}</span>
                </div>
              </div>

              {/* Dynamic Current Payment Section */}
              <div className="bg-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-200">Paying Now</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(paymentData.amount || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>Method</span>
                  <span>{paymentData.method}</span>
                </div>
              </div>

              {/* Live Remaining Balance */}
              <div className="text-center pt-2">
                <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Updated Pending Dues</p>
                <p className={`text-4xl font-black ${liveBalance === 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {formatCurrency(liveBalance)}
                </p>
              </div>

              {/* Success Overlay / Print Button */}
              {transactionStatus === 'success' && (
                <div className="mt-8">
                  <div className="bg-emerald-500 text-white text-center py-2 rounded-lg font-bold mb-4 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Payment Successful
                  </div>
                  <button onClick={() => window.print()} className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg">
                    Print Official Receipt
                  </button>
                  <button onClick={() => setTransactionStatus('idle')} className="w-full mt-3 text-slate-400 text-sm hover:text-white transition">
                    Process Another Payment
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeeCollection;