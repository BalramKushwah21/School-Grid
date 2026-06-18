"use client"
import React, { useState } from 'react';

const AdminProfile = () => {
  // Mock Database: Admin User Data
  const [adminData, setAdminData] = useState({
    id: 'ADM-001',
    firstName: 'Siddharth',
    lastName: 'Malhotra',
    email: 'principal@globalexcellence.edu',
    phone: '9876543200',
    role: 'Super Administrator',
    department: 'School Management',
    joinDate: '2022-04-01',
    status: 'Active',
    avatar: 'S',
  });

  const [recentLogins] = useState([
    { id: 1, date: 'Oct 04, 2026', time: '08:45 AM', device: 'MacBook Pro - Chrome', location: 'School Campus IP', status: 'Success' },
    { id: 2, date: 'Oct 03, 2026', time: '07:30 PM', device: 'iPhone 14 - Safari', location: 'Home Network', status: 'Success' },
    { id: 3, date: 'Oct 01, 2026', time: '02:15 AM', device: 'Unknown Windows PC', location: 'Unknown IP', status: 'Failed Attempt' },
  ]);

  const [activeTab, setActiveTab] = useState('personal'); // personal, security, activity
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...adminData });

  // Handlers
  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setAdminData({ ...editForm });
    setIsEditing(false);
    // TODO: Trigger API PUT request to update admin table
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert("Password change request sent. Please verify via your registered email.");
    // TODO: Trigger API to handle password rotation
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile & Settings</h1>
        <p className="text-slate-500 mt-1">Manage your administrative account, security settings, and personal details.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: PROFILE CARD */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            
            {/* Cover Photo & Avatar */}
            <div className="h-32 bg-gradient-to-r from-slate-900 to-indigo-900 relative">
              <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition backdrop-blur-sm text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
            
            <div className="px-6 pb-6 relative">
              <div className="w-24 h-24 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-black -mt-12 mb-4 relative z-10">
                {adminData.avatar}
                <button className="absolute bottom-0 right-0 bg-slate-900 p-1.5 rounded-full border-2 border-white text-white hover:bg-slate-700 transition">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{adminData.firstName} {adminData.lastName}</h2>
                <p className="text-indigo-600 font-bold text-sm mt-0.5">{adminData.role}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="font-medium text-slate-700">{adminData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <span className="font-medium text-slate-700">+91 {adminData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                  </div>
                  <span className="font-medium text-slate-700">ID: {adminData.id}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Account {adminData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: TABS & EDIT FORMS */}
        <div className="xl:col-span-2">
          
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
            <button onClick={() => setActiveTab('personal')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'personal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              Personal Information
            </button>
            <button onClick={() => setActiveTab('security')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'security' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              Security & Password
            </button>
            <button onClick={() => setActiveTab('activity')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'activity' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              System Activity
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* TAB: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div className="animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-lg font-bold text-slate-800">Profile Details</h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition"
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Details'}
                  </button>
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">First Name</label>
                          <input type="text" name="firstName" value={editForm.firstName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Last Name</label>
                          <input type="text" name="lastName" value={editForm.lastName} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Email Address</label>
                          <input type="email" name="email" value={editForm.email} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Contact Number</label>
                          <input type="text" name="phone" value={editForm.phone} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Department</label>
                          <input type="text" name="department" value={editForm.department} disabled className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm text-slate-500 cursor-not-allowed" />
                          <p className="text-xs text-slate-400 mt-1">Role and department changes require IT Database intervention.</p>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-md">
                          Save Profile Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                        <p className="text-lg font-bold text-slate-900">{adminData.firstName} {adminData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Role</p>
                        <p className="text-lg font-bold text-slate-900">{adminData.role}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-lg font-medium text-slate-700">{adminData.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Number</p>
                        <p className="text-lg font-medium text-slate-700">+91 {adminData.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                        <p className="text-lg font-medium text-slate-700">{adminData.department}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">System Join Date</p>
                        <p className="text-lg font-medium text-slate-700">{adminData.joinDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-lg font-bold text-slate-800">Account Security</h2>
                  <p className="text-xs text-slate-500 mt-1">Ensure your account is protected with a strong password and 2FA.</p>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-5 mb-8">
                    <h3 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Change Password</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Current Password</label>
                      <input type="password" required className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">New Password</label>
                      <input type="password" required className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Confirm New Password</label>
                      <input type="password" required className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md hover:bg-slate-800 transition">
                      Update Password
                    </button>
                  </form>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div>
                        <h3 className="font-bold text-indigo-900">Two-Factor Authentication (2FA)</h3>
                        <p className="text-xs text-indigo-700 mt-1">Add an extra layer of security to your admin account.</p>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACTIVITY LOG */}
            {activeTab === 'activity' && (
              <div className="animate-fade-in-up">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">System Activity Log</h2>
                    <p className="text-xs text-slate-500 mt-1">Recent login attempts associated with your account.</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                        <th className="p-4 font-bold">Date & Time</th>
                        <th className="p-4 font-bold">Device & Browser</th>
                        <th className="p-4 font-bold">Location / IP</th>
                        <th className="p-4 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                      {recentLogins.map(login => (
                        <tr key={login.id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{login.date}</p>
                            <p className="text-xs text-slate-500">{login.time}</p>
                          </td>
                          <td className="p-4 font-medium">{login.device}</td>
                          <td className="p-4 text-slate-500">{login.location}</td>
                          <td className="p-4 text-right">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${login.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                              {login.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;