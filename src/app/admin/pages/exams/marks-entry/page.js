"use client"
import React, { useState } from 'react';

const MarksEntry = () => {
  // Filter state to select which class/exam to grade
  const [filters, setFilters] = useState({
    classGroup: 'Class 10 - A',
    examType: 'Mid-Term',
    subject: 'Mathematics',
  });

  // Mock student data - Replace with a database fetch based on the filters above
  const [students, setStudents] = useState([
    { id: 101, rollNo: '10A-01', name: 'Aarav Sharma', marks: '', remarks: '' },
    { id: 102, rollNo: '10A-02', name: 'Priya Patel', marks: '', remarks: '' },
    { id: 103, rollNo: '10A-03', name: 'Rohan Gupta', marks: '85', remarks: 'Good' },
  ]);

  const [isEditing, setIsEditing] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    // TODO: When filters change, trigger an API call to fetch the relevant students and existing marks
  };

  // Handle marks and remarks input changes for specific students
  const handleStudentDataChange = (id, field, value) => {
    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, [field]: value } : student
    );
    setStudents(updatedStudents);
  };

  // Handle saving data to the database
  const handleSaveMarks = (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    // Prepare the payload
    const payload = {
      filters,
      marksData: students
    };

    // MOCK API CALL: Replace this setTimeout with your actual axios.post or fetch
    setTimeout(() => {
      console.log('Saved Payload:', payload);
      setSaveStatus('Marks saved successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Marks Entry & Editing</h1>
        <p className="text-gray-600">Enter or update student examination marks.</p>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class & Section</label>
            <select name="classGroup" value={filters.classGroup} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="Class 10 - A">Class 10 - A</option>
              <option value="Class 10 - B">Class 10 - B</option>
              <option value="Class 11 - Science">Class 11 - Science</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <select name="examType" value={filters.examType} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="Mid-Term">Mid-Term</option>
              <option value="Finals">Finals</option>
              <option value="Unit Test 1">Unit Test 1</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select name="subject" value={filters.subject} onChange={handleFilterChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* MARKS ENTRY TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">Student List</h2>
          <div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition duration-150 text-sm">
                Edit Marks
              </button>
            ) : (
              <span className="text-sm text-blue-600 font-medium animate-pulse">Editing Mode Active</span>
            )}
          </div>
        </div>

        <form onSubmit={handleSaveMarks}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-medium w-24">Roll No.</th>
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium w-32">Marks Obtained</th>
                  <th className="p-4 font-medium w-1/3">Remarks</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="p-4 font-medium text-gray-500">{student.rollNo}</td>
                    <td className="p-4 font-semibold">{student.name}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.marks}
                        onChange={(e) => handleStudentDataChange(student.id, 'marks', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full border rounded-md p-2 text-sm text-center ${!isEditing ? 'bg-gray-100 border-transparent text-gray-800 font-bold' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                        placeholder="--"
                        required
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={student.remarks}
                        onChange={(e) => handleStudentDataChange(student.id, 'remarks', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full border rounded-md p-2 text-sm ${!isEditing ? 'bg-gray-100 border-transparent text-gray-600' : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                        placeholder="Optional remarks"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTION FOOTER */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm font-medium text-green-600">
              {saveStatus}
            </div>
            {isEditing && (
              <button type="submit" className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition duration-150 shadow-sm">
                Save All Marks
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarksEntry;