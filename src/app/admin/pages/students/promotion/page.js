'use client'

import React, { useState } from 'react';

// Mock data to simulate fetching from your Next.js API/Database
const MOCK_CLASSES = [
  { id: 'c1', name: 'Grade 4-A', level: 4 },
  { id: 'c2', name: 'Grade 4-B', level: 4 },
  { id: 'c3', name: 'Grade 5-A', level: 5 },
  { id: 'c4', name: 'Grade 5-B', level: 5 },
];

const MOCK_STUDENTS = [
  { id: 's1', name: 'Arjun Mehta', gpa: '3.8', status: 'Passing', currentClassId: 'c1' },
  { id: 's2', name: 'Zara Khan', gpa: '3.6', status: 'Passing', currentClassId: 'c1' },
  { id: 's3', name: 'Rohan Sharma', gpa: '1.9', status: 'At Risk', currentClassId: 'c1' },
  { id: 's4', name: 'Priya Patel', gpa: '2.8', status: 'Passing', currentClassId: 'c1' },
];

export default function PromotionPage() {
  // Dropdown States
  const [sourceClass, setSourceClass] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // UI Loading/Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter students based on selected source class
  const displayedStudents = MOCK_STUDENTS.filter(s => s.currentClassId === sourceClass);

  // Toggle single student checkbox
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  // Toggle all visible passing students at once
  const handleSelectAllPassing = () => {
    const passingIds = displayedStudents
      .filter(s => s.status === 'Passing')
      .map(s => s.id);

    if (selectedStudents.length === passingIds.length) {
      setSelectedStudents([]); // Clear if all passing are already selected
    } else {
      setSelectedStudents(passingIds); // Auto-select only passing students
    }
  };

  // Submit Handler calling your server action or API route
  const handlePromotionSubmit = async (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0 || !targetClass) {
      setMessage({ type: 'error', text: 'Please select a destination class and at least one student.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call to backend transaction
      // replace this with: const res = await promoteStudents({ studentIds: selectedStudents, ... })
      await new Promise(resolve => setTimeout(resolve, 1500));

      setMessage({ 
        type: 'success', 
        text: `Success! ${selectedStudents.length} students have been promoted to ${MOCK_CLASSES.find(c => c.id === targetClass)?.name}.` 
      });
      setSelectedStudents([]);
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong during the database migration.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" p-6 bg-slate-50 min-h-screen rounded-xl shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Student Batch Promotion Panel</h1>
        <p className="text-slate-500 text-sm mt-1">
          Safely transition arrays of students into their next academic tier. Historical logs remain uncorrupted.
        </p>
      </div>

      {/* Global Status Banner */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg font-medium text-sm border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handlePromotionSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Configuration Controls */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Promotion Configuration</h2>
          
          {/* 1. Source Class Mapping */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Step 1: Source Class
            </label>
            <select
              value={sourceClass}
              onChange={(e) => { setSourceClass(e.target.value); setSelectedStudents([]); }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select Current Class --</option>
              {MOCK_CLASSES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Target Class Mapping */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Step 2: Target Class (Next Year)
            </label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              disabled={!sourceClass}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Select Target Class --</option>
              {MOCK_CLASSES.filter(c => c.id !== sourceClass).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Execution Button */}
          <button
            type="submit"
            disabled={isSubmitting || selectedStudents.length === 0 || !targetClass}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing database...
              </>
            ) : (
              `Promote ${selectedStudents.length} Selected Students`
            )}
          </button>
        </div>

        {/* Right Side: Student Check-List Manifest */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
            <h2 className="font-semibold text-slate-700">Roster Management</h2>
            {sourceClass && displayedStudents.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllPassing}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                {selectedStudents.length === displayedStudents.filter(s => s.status === 'Passing').length 
                  ? 'Deselect All' 
                  : 'Auto-Select All Passing'}
              </button>
            )}
          </div>

          {!sourceClass ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Please choose a Source Class from the panel to fetch the active records.
            </div>
          ) : displayedStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No students found currently enrolled in this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 w-12 text-center">Select</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4 text-center">GPA</th>
                    <th className="p-4 text-right">Academic Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedStudents.map((student) => {
                    const isChecked = selectedStudents.includes(student.id);
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectStudent(student.id)}
                            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-medium text-slate-800">{student.name}</td>
                        <td className="p-4 text-center font-mono text-xs">{student.gpa}</td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === 'Passing' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}