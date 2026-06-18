"use client"
import React, { useState } from 'react';

const RolePermissionManager = () => {
  // Mock Database: System Roles
  const [roles, setRoles] = useState([
    { id: 'ROLE-1', name: 'Super Administrator', userCount: 2, isLocked: true, description: 'Full system access. Cannot be modified.' },
    { id: 'ROLE-2', name: 'Academic Admin', userCount: 5, isLocked: false, description: 'Access to Exams, Students, and Academics.' },
    { id: 'ROLE-3', name: 'Finance Admin', userCount: 3, isLocked: false, description: 'Access to Fee Collection and Expenses only.' },
    { id: 'ROLE-4', name: 'Standard Teacher', userCount: 45, isLocked: false, description: 'Can manage assigned classes and marks.' },
  ]);

  const [activeRoleId, setActiveRoleId] = useState(roles[1].id);

  // Mock Database: Available System Modules
  const systemModules = [
    'User Management', 
    'Examination & Marks', 
    'Fee Collection', 
    'School Expenses', 
    'Parent Helpdesk', 
    'System Settings'
  ];

  // Mock Database: Role-to-Permission mapping
  // Structure: { roleId: { moduleName: { view: boolean, create: boolean, edit: boolean, delete: boolean } } }
  const [permissions, setPermissions] = useState({
    'ROLE-2': {
      'User Management': { view: true, create: true, edit: true, delete: false },
      'Examination & Marks': { view: true, create: true, edit: true, delete: true },
      'Fee Collection': { view: false, create: false, edit: false, delete: false },
      'School Expenses': { view: false, create: false, edit: false, delete: false },
      'Parent Helpdesk': { view: true, create: false, edit: true, delete: false },
      'System Settings': { view: false, create: false, edit: false, delete: false },
    },
    'ROLE-3': {
      'User Management': { view: true, create: false, edit: false, delete: false },
      'Examination & Marks': { view: false, create: false, edit: false, delete: false },
      'Fee Collection': { view: true, create: true, edit: true, delete: false },
      'School Expenses': { view: true, create: true, edit: true, delete: false },
      'Parent Helpdesk': { view: false, create: false, edit: false, delete: false },
      'System Settings': { view: false, create: false, edit: false, delete: false },
    }
  });

  const activeRole = roles.find(r => r.id === activeRoleId);
  const activePermissions = permissions[activeRoleId] || {};

  // Handlers
  const handleTogglePermission = (moduleName, action) => {
    if (activeRole.isLocked) return;

    setPermissions(prev => {
      const rolePerms = prev[activeRoleId] || {};
      const modulePerms = rolePerms[moduleName] || { view: false, create: false, edit: false, delete: false };
      
      return {
        ...prev,
        [activeRoleId]: {
          ...rolePerms,
          [moduleName]: {
            ...modulePerms,
            [action]: !modulePerms[action]
          }
        }
      };
    });
  };

  const handleSavePermissions = () => {
    // TODO: Trigger API PUT request to update role_permissions mapping in DB
    alert(`Access policies for ${activeRole.name} successfully updated.`);
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ isOn, onChange, disabled }) => (
    <button 
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isOn ? 'bg-emerald-500' : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-inner'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Control Matrix</h1>
          <p className="text-slate-500 mt-1">Configure systemic roles and granular permissions for all staff users.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
          + Create Custom Role
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL: ROLES DIRECTORY */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-5 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">System Roles</h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {roles.map(role => (
                <div 
                  key={role.id}
                  onClick={() => setActiveRoleId(role.id)}
                  className={`p-5 cursor-pointer transition-all duration-200 border-l-4 ${activeRoleId === role.id ? 'bg-indigo-50/50 border-indigo-600' : 'border-transparent hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-base ${activeRoleId === role.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {role.name}
                    </h3>
                    {role.isLocked && (
                      <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{role.description}</p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {role.userCount} Assigned Users
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: PERMISSION MATRIX */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-full flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white flex-shrink-0">
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-3">
                  Editing Access: {activeRole.name}
                  {activeRole.isLocked && (
                     <span className="bg-rose-500/20 text-rose-200 border border-rose-500/50 px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase">System Locked</span>
                  )}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{activeRole.description}</p>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-5 font-bold w-1/3">Application Module</th>
                    <th className="p-5 font-bold text-center">View</th>
                    <th className="p-5 font-bold text-center">Create</th>
                    <th className="p-5 font-bold text-center">Edit</th>
                    <th className="p-5 font-bold text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                  {activeRole.isLocked ? (
                    <tr>
                      <td colSpan="5" className="p-16 text-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Root Permissions Locked</h3>
                        <p className="mt-1 text-sm">The Super Administrator role has absolute access across all modules. These permissions cannot be altered.</p>
                      </td>
                    </tr>
                  ) : (
                    systemModules.map(module => {
                      const perms = activePermissions[module] || { view: false, create: false, edit: false, delete: false };
                      return (
                        <tr key={module} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-5 font-bold text-slate-800">{module}</td>
                          <td className="p-5 text-center">
                            <ToggleSwitch isOn={perms.view} onChange={() => handleTogglePermission(module, 'view')} />
                          </td>
                          <td className="p-5 text-center">
                            <ToggleSwitch isOn={perms.create} onChange={() => handleTogglePermission(module, 'create')} disabled={!perms.view} />
                          </td>
                          <td className="p-5 text-center">
                            <ToggleSwitch isOn={perms.edit} onChange={() => handleTogglePermission(module, 'edit')} disabled={!perms.view} />
                          </td>
                          <td className="p-5 text-center">
                            <ToggleSwitch isOn={perms.delete} onChange={() => handleTogglePermission(module, 'delete')} disabled={!perms.view} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            {!activeRole.isLocked && (
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-4">
                <button className="bg-white border border-slate-300 text-slate-700 font-bold py-2.5 px-6 rounded-xl text-sm shadow-sm hover:bg-slate-100 transition">
                  Discard Changes
                </button>
                <button onClick={handleSavePermissions} className="bg-indigo-600 text-white font-bold py-2.5 px-8 rounded-xl text-sm shadow-md hover:bg-indigo-700 transition">
                  Save Access Policies
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default RolePermissionManager;