"use client"
import React, { useState, useMemo } from 'react';

const ParentFeedback = () => {
  // Mock Database: Feedback Tickets
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-9021',
      parentId: 'PAR-1001',
      parentName: 'Rajesh Sharma',
      studentName: 'Aarav Sharma (10A-01)',
      date: '2026-06-17',
      category: 'Academics',
      subject: 'Concern regarding recent Science project grading',
      message: 'Hello, I wanted to discuss the grading criteria for the recent Science fair project. Aarav spent three weeks on his model, but the remarks do not clearly explain where marks were deducted. Could a teacher please clarify?',
      status: 'Open', // Open, In Progress, Resolved
      priority: 'Medium',
      replies: []
    },
    {
      id: 'TKT-9022',
      parentId: 'PAR-1045',
      parentName: 'Sunita Patel',
      studentName: 'Karan Patel (08C-12)',
      date: '2026-06-16',
      category: 'Transport',
      subject: 'Bus Route #4 consistently delayed',
      message: 'For the past three days, Bus #4 has been arriving at our stop 20 minutes late. This is causing Karan to miss the morning assembly. Please look into this routing delay.',
      status: 'In Progress',
      priority: 'High',
      replies: [
        { sender: 'Admin', date: '2026-06-16', text: 'Dear Sunita, we apologize for the inconvenience. We have escalated this to the transport manager. The delay is due to sudden roadwork on High Street. We are rerouting the bus starting tomorrow.' }
      ]
    },
    {
      id: 'TKT-9023',
      parentId: 'PAR-1088',
      parentName: 'Vikram Desai',
      studentName: 'Ananya Desai (09B-12)',
      date: '2026-06-10',
      category: 'Facilities',
      subject: 'Request for better cafeteria hygiene',
      message: 'My daughter mentioned that the cafeteria tables were not wiped down properly during the second lunch break. Can the janitorial staff ensure a quick wipe-down between batches?',
      status: 'Resolved',
      priority: 'Low',
      replies: [
        { sender: 'Admin', date: '2026-06-11', text: 'Thank you for bringing this to our attention, Vikram. We have instructed the facility staff to increase the cleaning frequency during the lunch overlaps. We appreciate your feedback.' }
      ]
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Derived state
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Filter and Search Logic
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => activeFilter === 'All' || t.status === activeFilter)
      .filter(t => 
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tickets, activeFilter, searchQuery]);

  // Statistics
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;

  // Handlers
  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return;
    setTickets(prev => prev.map(t => 
      t.id === selectedTicket.id ? { ...t, status: newStatus } : t
    ));
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply = {
      sender: 'Admin',
      date: new Date().toISOString().split('T')[0],
      text: replyText
    };

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        // Automatically move "Open" tickets to "In Progress" when replied to
        const updatedStatus = t.status === 'Open' ? 'In Progress' : t.status;
        return { ...t, status: updatedStatus, replies: [...t.replies, newReply] };
      }
      return t;
    }));
    
    setReplyText('');
    // TODO: Trigger API POST request to save reply and email the parent
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-rose-500';
      case 'In Progress': return 'bg-amber-500';
      case 'Resolved': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen relative overflow-hidden flex flex-col h-screen">
      
      {/* HEADER */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Parent Feedback & Queries</h1>
        <p className="text-slate-500 mt-1">Review, assign, and resolve incoming tickets from the parent portal.</p>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Action</p>
            <p className="text-2xl font-black text-rose-600">{openCount}</p>
          </div>
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black text-amber-500">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>

      {/* HELPDESK LAYOUT (Split Pane) */}
      <div className="flex gap-6 flex-1 min-h-0 relative">
        
        {/* LEFT PANE: INBOX LIST */}
        <div className={`flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${selectedTicketId ? 'w-full lg:w-1/3 hidden lg:flex' : 'w-full'}`}>
          
          {/* Filters & Search */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {['All', 'Open', 'In Progress', 'Resolved'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${activeFilter === filter ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 cursor-pointer hover:bg-indigo-50/50 transition border-l-4 ${selectedTicketId === ticket.id ? 'bg-indigo-50/30 border-indigo-500' : 'border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-400">{ticket.id}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">{ticket.subject}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{ticket.parentName} • {ticket.category}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
                    <span className="text-xs font-semibold text-slate-600">{ticket.status}</span>
                    <span className="text-xs text-slate-400 ml-auto">{ticket.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">No tickets found.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: TICKET DETAILS */}
        {selectedTicket ? (
          <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
            
            {/* Ticket Header */}
            <div className="bg-slate-900 p-6 text-white flex-shrink-0 relative">
              <button onClick={() => setSelectedTicketId(null)} className="absolute top-6 right-6 lg:hidden text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 backdrop-blur-sm`}>
                  {selectedTicket.category}
                </span>
                <span className="text-slate-400 text-sm font-medium">{selectedTicket.id}</span>
              </div>
              <h2 className="text-xl font-extrabold pr-8">{selectedTicket.subject}</h2>
              
              <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-slate-700 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                    {selectedTicket.parentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{selectedTicket.parentName}</p>
                    <p className="text-xs text-slate-400">Parent of: {selectedTicket.studentName}</p>
                  </div>
                </div>
                
                {/* Status Toggle */}
                <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1">Status:</span>
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`text-sm font-bold rounded-md px-2 py-1 outline-none appearance-none cursor-pointer border-none
                      ${selectedTicket.status === 'Resolved' ? 'bg-emerald-500 text-white' : 
                        selectedTicket.status === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}
                  >
                    <option value="Open" className="bg-white text-slate-900">Open</option>
                    <option value="In Progress" className="bg-white text-slate-900">In Progress</option>
                    <option value="Resolved" className="bg-white text-slate-900">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
              
              {/* Original Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex-shrink-0 flex items-center justify-center text-indigo-700 font-bold text-xs mt-1">
                  {selectedTicket.parentName.charAt(0)}
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-900">{selectedTicket.parentName}</span>
                    <span className="text-xs text-slate-400">{selectedTicket.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Replies */}
              {selectedTicket.replies.map((reply, index) => (
                <div key={index} className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs mt-1 shadow-md">
                    AD
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl rounded-tr-none shadow-sm flex-1">
                    <div className="flex justify-between items-center mb-2 flex-row-reverse">
                      <span className="font-bold text-sm text-indigo-900">School Admin</span>
                      <span className="text-xs text-indigo-400">{reply.date}</span>
                    </div>
                    <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap text-right">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Area */}
            {selectedTicket.status !== 'Resolved' ? (
              <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                <form onSubmit={handleSendReply} className="relative">
                  <textarea 
                    className="w-full border border-slate-300 rounded-xl p-3 pr-24 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50"
                    rows="3"
                    placeholder="Type your response to the parent here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  ></textarea>
                  <button 
                    type="submit"
                    className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    Send Reply
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-center flex-shrink-0 text-emerald-700 text-sm font-bold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                This ticket has been marked as resolved.
              </div>
            )}

          </div>
        ) : (
          <div className="hidden lg:flex flex-col flex-1 items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 p-8 text-center">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <h3 className="text-lg font-bold text-slate-600">No Ticket Selected</h3>
            <p className="text-sm mt-2 max-w-sm">Select a support ticket from the inbox on the left to view details, assign staff, and send responses.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParentFeedback;