"use client"
import React, { useState } from 'react';

const GradeSystem = () => {
  // Mock initial state - Replace with a database fetch (GET request) on load
  const [grades, setGrades] = useState([
    { id: 1, gradeName: 'A+', minMarks: 90, maxMarks: 100, gradePoint: '4.0', remarks: 'Outstanding' },
    { id: 2, gradeName: 'A', minMarks: 80, maxMarks: 89, gradePoint: '3.6', remarks: 'Excellent' },
    { id: 3, gradeName: 'B+', minMarks: 70, maxMarks: 79, gradePoint: '3.2', remarks: 'Very Good' },
  ]);

  // Form state for adding new grade boundaries
  const [formData, setFormData] = useState({
    gradeName: '',
    minMarks: '',
    maxMarks: '',
    gradePoint: '',
    remarks: ''
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle saving new grade rule (Ready for Database POST request)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new record
    const newGrade = {
      id: grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1, // Database will generate this later
      ...formData
    };

    // Update frontend state
    const updatedGrades = [...grades, newGrade].sort((a, b) => b.minMarks - a.minMarks); // Keep sorted by highest marks
    setGrades(updatedGrades);

    // Reset form
    setFormData({ gradeName: '', minMarks: '', maxMarks: '', gradePoint: '', remarks: '' });

    // TODO: Add your API POST request here
    // e.g., axios.post('/api/grades', newGrade)
  };

  // Handle deletion (Ready for Database DELETE request)
  const handleDelete = (id) => {
    const updatedGrades = grades.filter(grade => grade.id !== id);
    setGrades(updatedGrades);

    // TODO: Add your API DELETE request here
    // e.g., axios.delete(`/api/grades/${id}`)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Grade System Configuration</h1>
        <p className="text-gray-600">Define grading rules, boundaries, and grade points for report cards.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ADD NEW GRADE RULE FORM */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Add Grade Rule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Name</label>
              <input type="text" name="gradeName" value={formData.gradeName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. A+" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Marks (%)</label>
                <input type="number" name="minMarks" value={formData.minMarks} onChange={handleInputChange} min="0" max="100" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 90" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks (%)</label>
                <input type="number" name="maxMarks" value={formData.maxMarks} onChange={handleInputChange} min="0" max="100" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 100" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Point</label>
              <input type="number" step="0.1" name="gradePoint" value={formData.gradePoint} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 4.0" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <input type="text" name="remarks" value={formData.remarks} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Outstanding" required />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 mt-4">
              Save Grade Rule
            </button>
          </form>
        </div>

        {/* GRADE LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
             <h2 className="text-lg font-semibold text-gray-700">Active Grading Logic</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-medium">Grade</th>
                  <th className="p-4 font-medium">Marks Range</th>
                  <th className="p-4 font-medium">Grade Point</th>
                  <th className="p-4 font-medium">Remarks</th>
                  <th className="p-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                {grades.length > 0 ? (
                  grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                          {grade.gradeName}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{grade.minMarks}% - {grade.maxMarks}%</td>
                      <td className="p-4 font-semibold text-gray-900">{grade.gradePoint}</td>
                      <td className="p-4 text-gray-500">{grade.remarks}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(grade.id)} className="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No grading rules defined yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GradeSystem;