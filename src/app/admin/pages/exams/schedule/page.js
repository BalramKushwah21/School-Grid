"use client"
import React, { useState } from 'react';

const ExamSchedule = () => {
  // Mock initial state - Replace this with a useEffect fetch call to your database later
  const [schedules, setSchedules] = useState([
    { id: 1, type: 'Mid-Term', subject: 'Mathematics', date: '2026-06-25', startTime: '09:00', endTime: '12:00', room: '101A' },
    { id: 2, type: 'Mid-Term', subject: 'Physics', date: '2026-06-26', startTime: '09:00', endTime: '11:30', room: '102B' },
  ]);

  // Form state for adding new entries
  const [formData, setFormData] = useState({
    type: 'Mid-Term',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    room: ''
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Ready for Database POST request)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new record object
    const newSchedule = {
      id: schedules.length + 1, // Replace with database-generated ID later
      ...formData
    };

    // Update frontend state
    setSchedules([...schedules, newSchedule]);

    // Reset form
    setFormData({
      type: 'Mid-Term', subject: '', date: '', startTime: '', endTime: '', room: ''
    });

    // TODO: Add your API POST request here to save 'newSchedule' to your database
    // example: axios.post('/api/exams', newSchedule).then(...)
  };

  // Handle deletion (Ready for Database DELETE request)
  const handleDelete = (id) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
    setSchedules(updatedSchedules);

    // TODO: Add your API DELETE request here
    // example: axios.delete(`/api/exams/${id}`)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exam Schedule Management</h1>
        <p className="text-gray-600">Schedule and manage upcoming examinations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ADD NEW SCHEDULE FORM */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Add New Schedule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-sm" required>
                <option value="Mid-Term">Mid-Term</option>
                <option value="Finals">Finals</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Practical">Practical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="e.g. Chemistry" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room / Hall</label>
              <input type="text" name="room" value={formData.room} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="e.g. Main Hall" required />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 mt-4">
              Save Schedule
            </button>
          </form>
        </div>

        {/* SCHEDULE LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
             <h2 className="text-lg font-semibold text-gray-700">Current Schedules</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b">
                  <th className="p-4 font-medium">Exam Type</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Room</th>
                  <th className="p-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">{schedule.type}</span></td>
                      <td className="p-4 font-medium">{schedule.subject}</td>
                      <td className="p-4">
                        <div className="font-medium">{schedule.date}</div>
                        <div className="text-xs text-gray-500">{schedule.startTime} - {schedule.endTime}</div>
                      </td>
                      <td className="p-4">{schedule.room}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(schedule.id)} className="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No exams scheduled yet.
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

export default ExamSchedule;