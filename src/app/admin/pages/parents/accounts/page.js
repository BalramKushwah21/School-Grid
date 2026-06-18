"use client"
import React, { useState } from 'react';

const AdminParentProfile = () => {
  // Mock Database: Fetched based on the selected Parent ID from the directory
  const [parentData, setParentData] = useState({
    id: 'PAR-1001',
    fatherName: 'Rajesh Sharma',
    fatherOccupation: 'Software Architect',
    motherName: 'Priya Sharma',
    motherOccupation: 'Bank Manager',
    primaryContact: '9876543210',
    secondaryContact: '9876543211',
    email: 'rajesh.sharma@example.com',
    address: '45, Palm Avenue, Sector 4, Tech City',
    accountStatus: 'Active', // Active, Suspended, Inactive
    lastLogin: 'Oct 04, 2026 - 09:15 AM',
    children: [
      { id: 101, name: 'Aarav Sharma', class: 'Class 10 - A', rollNo: '10A-01', status: 'Enrolled' },
      { id: 108, name: 'Diya Sharma', class: 'Class 7 - B', rollNo: '07B-14', status: 'Enrolled' }
    ],
    communications: [
      { date: 'Oct 01, 2026', type: 'Email', subject: 'Fee Reminder - Term 2', status: 'Delivered' },
      { date: 'Sep 15, 2026', type: 'SMS', subject: 'Payment Received Acknowledgment', status: 'Read' }
    ]
  });

  const [activeTab, setActiveTab] = useState('overview'); // overview, financial, communication, settings
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...parentData });

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setParentData({ ...editForm });
    setIsEditing(false);
    // TODO: Trigger API PUT request to update parent table
  };

  const handlePasswordReset = () => {
    if(window.confirm("Send a password reset link to this parent's registered email?")) {
      alert(`Password reset link sent to ${parentData.email}`);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-indigo-600 transition bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            &larr; Back to Directory
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              {parentData.fatherName} & {parentData.motherName}
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${parentData.accountStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {parentData.accountStatus}
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Account ID: {parentData.id} • Last Login: {parentData.lastLogin}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setActiveTab('communication')} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition">
            Send Message
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition">
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex space-x-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
        {['overview', 'financial', 'communication', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Contact & Demographics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 p-5 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">Primary Contact Information</h2>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Father's Name</label>
                        <input type="text" name="fatherName" value={editForm.fatherName} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Father's Occupation</label>
                        <input type="text" name="fatherOccupation" value={editForm.fatherOccupation} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Mother's Name</label>
                        <input type="text" name="motherName" value={editForm.motherName} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Mother's Occupation</label>
                        <input type="text" name="motherOccupation" value={editForm.motherOccupation} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Primary Phone</label>
                        <input type="text" name="primaryContact" value={editForm.primaryContact} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                        <input type="email" name="email" value={editForm.email} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Residential Address</label>
                        <textarea name="address" value={editForm.address} onChange={handleInputChange} className="w-full border p-2 rounded-lg text-sm" rows="2"></textarea>
                      </div>
                    </div>
                    <button type="submit" className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm">Save Changes</button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Father's Details</p>
                      <p className="font-bold text-slate-900">{parentData.fatherName}</p>
                      <p className="text-sm text-slate-500">{parentData.fatherOccupation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mother's Details</p>
                      <p className="font-bold text-slate-900">{parentData.motherName}</p>
                      <p className="text-sm text-slate-500">{parentData.motherOccupation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Numbers</p>
                      <p className="font-bold text-slate-900">+91 {parentData.primaryContact} <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-2">Primary</span></p>
                      {parentData.secondaryContact && <p className="text-sm text-slate-500 mt-1">+91 {parentData.secondaryContact}</p>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                      <p className="font-bold text-slate-900">{parentData.email}</p>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Residential Address</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed max-w-xl">{parentData.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Linked Wards */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
              <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Linked Wards</h2>
                <button className="text-indigo-600 text-xs font-bold hover:underline">+ Link Student</button>
              </div>
              <div className="p-5 space-y-4">
                {parentData.children.map(child => (
                  <div key={child.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{child.name}</p>
                        <p className="text-xs text-slate-500">{child.rollNo} • {child.class}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">{child.status}</span>
                    </div>
                    <button className="w-full mt-3 bg-slate-50 text-slate-600 text-xs font-bold py-2 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-700 transition">
                      Go to Student Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SETTINGS / ACCOUNT CONTROL */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-5 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">Portal Access & Security</h2>
            </div>
            
            <div className="p-6 divide-y divide-slate-100">
              
              {/* Password Reset */}
              <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 first:pt-0">
                <div>
                  <h3 className="font-bold text-slate-900">Reset Portal Password</h3>
                  <p className="text-sm text-slate-500 mt-1">Send an email link allowing the parent to set a new password.</p>
                </div>
                <button onClick={handlePasswordReset} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 whitespace-nowrap">
                  Send Reset Link
                </button>
              </div>

              {/* Account Suspension */}
              <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-rose-600">Suspend Account Access</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-lg">Prevent this parent from logging into the mobile app and web portal. This does not affect the students' enrollment status.</p>
                </div>
                <button className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-rose-100 whitespace-nowrap">
                  Suspend Account
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs to keep code concise */}
      {(activeTab === 'financial' || activeTab === 'communication') && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <h3 className="text-lg font-bold text-slate-700">{activeTab === 'financial' ? 'Family Financial Ledger' : 'Communication History'}</h3>
          <p className="text-slate-500 mt-2">Data visualization for {activeTab} will render here, pulling from the global finance and messaging modules.</p>
        </div>
      )}

    </div>
  );
};

export default AdminParentProfile;