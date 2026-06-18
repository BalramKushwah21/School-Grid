"use client";

import React, { useState } from 'react';
import { FiMenu, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const ParentSidebar = ({ isOpen, onClose, menuData }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  return (
    <>
      {/* Mobile Header & Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-indigo-900 text-white p-4 shadow-md w-full absolute top-0 z-50">
        <h1 className="text-xl font-bold tracking-wide">Parent Portal</h1>
        <button onClick={onClose} className="text-2xl focus:outline-none">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-gray-900 text-gray-100 h-screen overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl custom-scrollbar ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* PC Logo / Brand Area */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
          <h2 className="text-2xl font-extrabold text-white tracking-wider">
            Parent<span className="text-indigo-400">Portal</span>
          </h2>
        </div>

        {/* Dynamic Menu Rendering */}
        <nav className="p-4 space-y-1 mt-16 md:mt-0 mb-10">
          {menuData?.map((menu, index) => (
            <div key={index}>
              {/* If Menu has Sub-menus */}
              {menu.subMenus ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(menu.title)}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-indigo-800/50 hover:text-indigo-100 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3 text-base">
                      <span className="text-xl opacity-90 group-hover:scale-110 transition-transform">{menu.icon}</span>
                      <span className="font-medium tracking-wide">{menu.title}</span>
                    </div>
                    {openDropdown === menu.title ? (
                      <FiChevronDown className="text-indigo-400" />
                    ) : (
                      <FiChevronRight className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
                    )}
                  </button>
                  
                  {/* Dropdown Items */}
                  {openDropdown === menu.title && (
                    <div className="ml-9 mt-1 mb-2 space-y-1 border-l-2 border-indigo-900/50 pl-4 py-1 animate-fade-in-down">
                      {menu.subMenus.map((sub, subIndex) => (
                        <a
                          key={subIndex}
                          href={sub.path}
                          className="block py-2 text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                        >
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Single Menu Link (e.g., Dashboard) */
                <a
                  href={menu.path}
                  className="flex items-center space-x-3 p-3 rounded-xl text-base hover:bg-indigo-800/50 hover:text-indigo-100 transition-all duration-200 group"
                >
                  <span className="text-xl opacity-90 group-hover:scale-110 transition-transform">{menu.icon}</span>
                  <span className="font-medium tracking-wide">{menu.title}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-60 z-30 md:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default ParentSidebar;