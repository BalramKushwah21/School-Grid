import React from 'react';
import { GraduationCap, LayoutDashboard, Users, UserCheck, BookOpen, CreditCard, BarChart3, Settings, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Students", icon: Users },
    { label: "Teachers", icon: UserCheck },
    { label: "Classes & Courses", icon: BookOpen },
    { label: "Fees & Finance", icon: CreditCard },
    { label: "Reports", icon: BarChart3 },
  ];

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand/Logo */}
          <div className="h-16 flex items-center justify-between px-6 bg-slate-950">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-indigo-400 w-8 h-8" />
              <span className="text-xl font-bold tracking-wider">EduPulse</span>
            </div>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white focus:outline-none">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <a href="#" className="flex items-center gap-3 px-2 py-2 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">System Settings</span>
          </a>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden"></div>
      )}
    </>
  );
}