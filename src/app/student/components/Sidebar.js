"use client"
import React, { useState } from 'react';
import { FiMenu, FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const StudentSidebar = ({ menuData }) => {
  const [isOpen, setIsOpen] = useState(false); // Controls mobile sidebar visibility
  const [openDropdown, setOpenDropdown] = useState(null); // Controls which dropdown is active

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  return (
    <>
      {/* Mobile Header & Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-blue-900 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">Student Portal</h1>
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gray-900 text-gray-100 h-screen overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* PC Logo / Brand Area */}
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-700 bg-gray-900">
          <h2 className="text-2xl font-extrabold text-white tracking-wider">
            Student<span className="text-blue-500">Portal</span>
          </h2>
        </div>

        {/* Dynamic Menu Rendering */}
        <nav className="p-4 space-y-2">
          {menuData.map((menu, index) => (
            <div key={index}>
              {/* If Menu has Sub-menus (Dropdown) */}
              {menu.subMenus ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(menu.title)}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-800 hover:text-white transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3 text-lg">
                      <span>{menu.icon}</span>
                      <span className="font-small">{menu.title}</span>
                    </div>
                    {openDropdown === menu.title ? <FiChevronDown /> : <FiChevronRight />}
                  </button>
                  
                  {/* Sub-menu Items */}
                  {openDropdown === menu.title && (
                    <div className="ml-8 mt-2 space-y-1 border-l border-gray-600 pl-4">
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
                /* If Menu is a Single Link (e.g., Dashboard, Logout) */
                <a
                  href={menu.path}
                  className="flex items-center space-x-3 p-3 rounded-lg text-lg hover:bg-blue-800 hover:text-white transition-colors duration-200"
                >
                  <span>{menu.icon}</span>
                  <span className="font-medium">{menu.title}</span>
                </a>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default StudentSidebar;