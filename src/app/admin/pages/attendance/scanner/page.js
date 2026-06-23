"use client";

import React, { useState, useRef, useEffect } from 'react';

export default function AttendanceScanner() {
  const [scanInput, setScanInput] = useState("");
  const [recentScans, setRecentScans] = useState([]);
  const [scanStatus, setScanStatus] = useState(null); // 'success', 'error', 'duplicate', null
  const [statusMessage, setStatusMessage] = useState("Ready to scan...");
  
  // Ref to keep input focused automatically
  const inputRef = useRef(null);

  // Keep focus on the hidden input field so scanner always works
  useEffect(() => {
    const keepFocus = () => inputRef.current?.focus();
    document.addEventListener("click", keepFocus);
    keepFocus();
    return () => document.removeEventListener("click", keepFocus);
  }, []);

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const currentId = scanInput.trim();
    setScanInput(""); // Clear input immediately for the next student

    try {
      // API Call to Backend
      const response = await fetch("http://localhost:5000/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: currentId })
      });
      
      const result = await response.json();

      if (response.ok) {
        // Play success beep here if needed
        setScanStatus("success");
        setStatusMessage(`${result.data.name} - Present at ${result.timestamp}`);
        
        // Add to top of recent scans list
        setRecentScans(prev => [{
            id: result.data.id,
            name: result.data.name,
            grade: result.data.grade,
            time: result.timestamp,
            status: result.message
        }, ...prev]);

      } else {
        // Play error beep here
        setScanStatus("error");
        setStatusMessage(`Error: ${result.message} (${currentId})`);
      }
    } catch (err) {
      setScanStatus("error");
      setStatusMessage("Network Error: Cannot connect to server.");
    }

    // Reset visual flash after 2 seconds
    setTimeout(() => {
      setScanStatus(null);
      setStatusMessage("Ready to scan...");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4">
        <div className="max-w-3xl w-full space-y-6">
            
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">Smart Attendance Scanner</h1>
                <p className="text-slate-500">Ensure scanner gun is connected. Point and shoot ID card barcodes.</p>
            </div>

            {/* Hidden Input for Scanner (Captures rapid keystrokes from scanner gun) */}
            <form onSubmit={handleScanSubmit} className="opacity-0 absolute -z-50">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    autoFocus
                />
            </form>

            {/* Visual Flash Dashboard */}
            <div className={`transition-all duration-300 rounded-2xl p-10 text-center shadow-lg border-4 ${
                scanStatus === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' :
                scanStatus === 'error' ? 'bg-rose-50 border-rose-500 text-rose-800' :
                'bg-white border-indigo-100 text-slate-800'
            }`}>
                <div className="text-6xl mb-4">
                    {scanStatus === 'success' ? '✅' : scanStatus === 'error' ? '❌' : '📷'}
                </div>
                <h2 className="text-2xl font-bold">{statusMessage}</h2>
                <p className="mt-2 opacity-70">
                    {scanStatus === null ? 'Waiting for barcode input...' : 'Processing next scan...'}
                </p>
            </div>

            {/* Total Scanned Counter */}
            <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-xl shadow-md">
                <span className="font-semibold text-lg">Total Scanned Today:</span>
                <span className="text-2xl font-bold">{recentScans.length}</span>
            </div>

            {/* Recent Scans Log */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-semibold text-slate-700">
                    Recent Scans Live Log
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {recentScans.length === 0 ? (
                        <p className="p-6 text-center text-slate-400">No scans recorded yet.</p>
                    ) : (
                        recentScans.map((scan, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                        {scan.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{scan.name}</p>
                                        <p className="text-xs text-slate-500">{scan.id} • {scan.grade}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-sm font-semibold text-slate-700">{scan.time}</p>
                                    <span className="text-xs text-emerald-600 font-medium">{scan.status}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    </div>
  );
}