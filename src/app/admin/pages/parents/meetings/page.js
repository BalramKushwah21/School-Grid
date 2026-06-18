"use client"
import React, { useState, useMemo } from 'react';

const ParentMeetings = () => {
  // Mock Database: Scheduled Meetings
  const [meetings, setMeetings] = useState([
    {
      id: 'MTG-3001',
      parentName: 'Rajesh Sharma',
      studentName: 'Aarav Sharma (10A-01)',
      teacherName: 'Mr. Vikram Singh',
      date: '2026-06-20',
      time: '10:00 AM',
      type: 'Virtual (Zoom)',
      purpose: 'Academic Performance Review',
      status: 'Scheduled' // Scheduled, Completed, Cancelled
    },
    {
      id: 'MTG-3002',
      parentName: 'Sunita Patel',
      studentName: 'Karan Patel (08C-12)',
      teacherName: 'Ms. Anjali Desai',
      date: '2026-06-18',
      time: '02:30 PM',
      type: 'In-Person',
      purpose: 'Behavioral Consultation',
      status: 'Completed'
    },
    {
      id: 'MTG-3003',
      parentName: 'Vikram Desai',
      studentName: 'Ananya Desai (09B-12)',
      teacherName: 'Mr. Rahul Verma',
      date: '2026-06-22',
      time: '11:15 AM',
      type: 'In-Person',
      purpose: 'Term 1 Goal Setting',
      status: 'Scheduled'
    }
  ]);

  // Form State for new meeting
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    teacherName: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'In-Person',
    purpose: ''
  });

  const [activeFilter, setActiveFilter] = useState('Upcoming'); // Upcoming, Past, All

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    const newMeeting = {
      id: `MTG-${3000 + meetings.length + 1}`,
      ...formData,
      status: 'Scheduled'
    };

    setMeetings([...meetings, newMeeting]);
    setFormData({
      parentName: '', studentName: '', teacherName: '', 
      date: new Date().toISOString().split('T')[0], time: '', type: 'In-Person', purpose: ''
    });
    
    // TODO: Trigger API POST request to save meeting and send invites
  };

  const handleStatusChange = (id, newStatus) => {
    setMeetings(prev => prev.map(m => 
      m.id === id ? { ...m, status: newStatus } : m
    ));
  };

  // Filter Logic
  const filteredMeetings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return meetings.filter(m => {
      if (activeFilter === 'Upcoming') return m.date >= today && m.status === 'Scheduled';
      if (activeFilter === 'Past') return m.date < today || m.status === 'Completed';
      return true;
    }).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
  }, [meetings, activeFilter]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Parent Meetings & Scheduling</h1>
        <p className="text-slate-500 mt-1">Coordinate 1-on-1 consultations, PTMs, and virtual sessions seamlessly.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: SCHEDULING FORM */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="bg-slate-900 p-6 border-b border-slate-800 text-white">
              <h2 className="text-lg font-bold">Schedule New Meeting</h2>
              <p className="text-slate-400 text-xs mt-1">Invites will be sent automatically.</p>
            </div>
            
            <form onSubmit={handleScheduleMeeting} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Parent Name / ID</label>
                <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g., Rajesh Sharma" required />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Student Name (Roll No)</label>
                <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g., Aarav Sharma (10A-01)" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Assigned Teacher</label>
                <input type="text" name="teacherName" value={formData.teacherName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g., Mr. Vikram Singh" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Meeting Mode</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option value="In-Person">In-Person (Campus)</option>
                    <option value="Virtual (Zoom)">Virtual (Zoom / Meet)</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Meeting Purpose</label>
                <textarea name="purpose" value={formData.purpose} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition" rows="2" placeholder="Brief description of the agenda..." required></textarea>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition transform hover:-translate-y-0.5 mt-2">
                Send Meeting Invite
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: MEETING DASHBOARD */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-full flex flex-col">
            
            {/* Toolbar */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Meeting Itinerary</h2>
              <div className="flex bg-slate-200/50 p-1 rounded-lg">
                {['Upcoming', 'Past', 'All'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${activeFilter === filter ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Meetings List */}
            <div className="p-6 flex-1 bg-slate-50/50">
              <div className="space-y-4">
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition group relative overflow-hidden">
                      {/* Left color bar indicator */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${meeting.status === 'Scheduled' ? 'bg-indigo-500' : meeting.status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        
                        {/* Date & Time Block */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl p-3 w-28 text-center">
                          <span className="text-xs font-bold text-rose-500 uppercase">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-black text-slate-800 leading-none my-1">{meeting.date.split('-')[2]}</span>
                          <span className="text-xs font-bold text-slate-500">{meeting.time}</span>
                        </div>

                        {/* Meeting Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-slate-900 text-lg">{meeting.purpose}</h3>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(meeting.status)}`}>
                              {meeting.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                              <span className="font-medium">{meeting.parentName}</span>
                              <span className="text-slate-400 text-xs">({meeting.studentName})</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                              <span className="font-medium">With: {meeting.teacherName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 sm:col-span-2 mt-1">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                              <span className="font-medium text-indigo-600">{meeting.type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {meeting.status === 'Scheduled' && (
                          <div className="flex flex-row md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                            <button onClick={() => handleStatusChange(meeting.id, 'Completed')} className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                              Mark Completed
                            </button>
                            <button onClick={() => handleStatusChange(meeting.id, 'Cancelled')} className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="font-medium">No {activeFilter.toLowerCase()} meetings found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentMeetings;