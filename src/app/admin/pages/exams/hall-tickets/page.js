"use client"
import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Requires: npm install xlsx

const HallTicketGenerator = () => {
  const [entryMode, setEntryMode] = useState('individual'); // 'individual' or 'bulk'
  const [students, setStudents] = useState([]);
  
  // State for individual manual entry
  const [manualData, setManualData] = useState({
    rollNo: '',
    name: '',
    class: 'Class 10 - A',
    examType: 'Mid-Term Examination 2026',
    center: 'Main Campus Hall',
  });

  // Handle manual input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualData({ ...manualData, [name]: value });
  };

  // Add individual student to the print queue
  const handleAddIndividual = (e) => {
    e.preventDefault();
    const newTicket = { id: Date.now(), ...manualData };
    setStudents([...students, newTicket]);
    
    // Reset basic fields but keep Class/Exam/Center for speed
    setManualData({ ...manualData, rollNo: '', name: '' });
  };

  // Handle Excel File Upload for Bulk Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      // Map Excel data to our component state structure
      // Assuming Excel columns: RollNo, StudentName, ClassName, ExamName, CenterName
      const formattedStudents = data.map((row, index) => ({
        id: Date.now() + index,
        rollNo: row.RollNo || 'N/A',
        name: row.StudentName || 'Unknown',
        class: row.ClassName || 'N/A',
        examType: row.ExamName || 'N/A',
        center: row.CenterName || 'N/A'
      }));

      setStudents((prev) => [...prev, ...formattedStudents]);
    };
    reader.readAsBinaryString(file);
  };

  // Clear the print queue
  const clearQueue = () => setStudents([]);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen print:p-0 print:bg-white">
      
      {/* CONTROL PANEL (Hidden on Print) */}
      <div className="mb-8 print:hidden">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hall Ticket Generation</h1>
            <p className="text-gray-600">Generate individual or bulk admit cards for upcoming exams.</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={clearQueue} className="bg-red-50 text-red-600 border border-red-200 font-medium py-2 px-4 rounded-md hover:bg-red-100 transition">Clear Queue</button>
            <button onClick={handlePrint} disabled={students.length === 0} className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
              Print {students.length} Tickets
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button onClick={() => setEntryMode('individual')} className={`flex-1 py-3 font-medium text-sm text-center ${entryMode === 'individual' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              Individual Entry
            </button>
            <button onClick={() => setEntryMode('bulk')} className={`flex-1 py-3 font-medium text-sm text-center ${entryMode === 'bulk' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              Bulk Import (Excel)
            </button>
          </div>

          <div className="p-6">
            {/* INDIVIDUAL FORM */}
            {entryMode === 'individual' && (
              <form onSubmit={handleAddIndividual} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                  <input type="text" name="rollNo" value={manualData.rollNo} onChange={handleInputChange} className="w-full border rounded p-2 text-sm focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input type="text" name="name" value={manualData.name} onChange={handleInputChange} className="w-full border rounded p-2 text-sm focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input type="text" name="class" value={manualData.class} onChange={handleInputChange} className="w-full border rounded p-2 text-sm focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
                  <input type="text" name="center" value={manualData.center} onChange={handleInputChange} className="w-full border rounded p-2 text-sm focus:ring-blue-500" required />
                </div>
                <div>
                  <button type="submit" className="w-full bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700 transition">Add to Queue</button>
                </div>
              </form>
            )}

            {/* BULK IMPORT FORM */}
            {entryMode === 'bulk' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="text-sm text-gray-600 mb-4">Upload an Excel (.xlsx) file containing student data.</p>
                <p className="text-xs text-gray-500 mb-4">Required Columns: RollNo, StudentName, ClassName, ExamName, CenterName</p>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="block w-full max-w-xs mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRINT PREVIEW AREA */}
      {students.length > 0 && (
        <div className="print:block">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 print:hidden">Print Preview ({students.length} Tickets)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
            {students.map((student) => (
              <div key={student.id} className="bg-white border-2 border-gray-800 p-6 rounded-md shadow-sm print:shadow-none print:break-inside-avoid">
                
                {/* Ticket Header */}
                <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
                  <h3 className="text-xl font-bold uppercase tracking-wider text-gray-900">Global Excellence Academy</h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">HALL TICKET / ADMIT CARD</p>
                  <p className="text-xs bg-gray-800 text-white inline-block px-3 py-1 mt-2 rounded-full uppercase tracking-widest">{student.examType}</p>
                </div>

                {/* Ticket Body */}
                <div className="flex gap-4">
                  {/* Photo Placeholder */}
                  <div className="w-24 h-32 border-2 border-gray-400 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Photo</div>
                  
                  {/* Student Details */}
                  <div className="flex-1 space-y-2 text-sm">
                    <div className="flex border-b border-gray-200 pb-1">
                      <span className="font-semibold w-24 text-gray-700">Roll No:</span>
                      <span className="font-bold text-gray-900">{student.rollNo}</span>
                    </div>
                    <div className="flex border-b border-gray-200 pb-1">
                      <span className="font-semibold w-24 text-gray-700">Name:</span>
                      <span className="font-bold text-gray-900">{student.name}</span>
                    </div>
                    <div className="flex border-b border-gray-200 pb-1">
                      <span className="font-semibold w-24 text-gray-700">Class:</span>
                      <span className="font-medium text-gray-900">{student.class}</span>
                    </div>
                    <div className="flex pt-1">
                      <span className="font-semibold w-24 text-gray-700">Center:</span>
                      <span className="font-medium text-gray-900">{student.center}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Footer / Signatures */}
                <div className="mt-8 flex justify-between px-4 text-xs font-medium text-gray-600">
                  <div className="border-t border-gray-800 pt-1 w-24 text-center">Student Sign</div>
                  <div className="border-t border-gray-800 pt-1 w-24 text-center">Principal Sign</div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HallTicketGenerator;