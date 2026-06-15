import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function NavItem({ menu, isOpen, onToggle }) {
  const Icon = menu.icon;

  // 1. अगर ड्रॉपडाउन नहीं है (जैसे Dashboard)
  if (!menu.isDropdown) {
    return (
      <a 
        href={menu.link} 
        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-colors"
      >
        <Icon className="w-4 h-4 text-indigo-400" />
        <span>{menu.name}</span>
      </a>
    );
  }

  // 2. अगर ड्रॉपडाउन है (जैसे Students, Teachers आदि)
  return (
    <div className="w-full">
      <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isOpen ? 'bg-slate-800 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-indigo-400" />
          <span>{menu.name}</span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
      </button>

      {/* सब-मेनू आइटम्स */}
      {isOpen && (
        <div className="mt-1 pl-8 pr-1 py-1 bg-slate-950/20 rounded-lg space-y-0.5 border-l-2 border-slate-800 ml-4">
          {menu.subItems.map((subItem, index) => (
            <a 
              key={index} 
              href={subItem.link} 
              className="block py-1.5 px-3 text-xs font-medium text-gray-400 hover:text-white rounded-md hover:bg-slate-800/40 transition-colors"
            >
              {subItem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}