import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { X, LayoutDashboard, FileText, Home, Users, Building } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  
  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { to: '/student/application', label: 'Apply for Room', icon: <FileText className="mr-3 h-5 w-5" /> },
    { to: '/student/rooms', label: 'Room Availability', icon: <Building className="mr-3 h-5 w-5" /> },
  ];
  
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { to: '/admin/applications', label: 'Applications', icon: <FileText className="mr-3 h-5 w-5" /> },
    { to: '/admin/rooms', label: 'Manage Rooms', icon: <Building className="mr-3 h-5 w-5" /> },
  ];
  
  const links = isAdmin ? adminLinks : studentLinks;
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <NavLink to="/" className="text-blue-600 font-bold text-xl">OHRAS</NavLink>
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto">
            <nav className="mt-5 px-2 space-y-1">
              <NavLink to="/" className={navLinkClass}>
                <Home className="mr-3 h-5 w-5" />
                Home
              </NavLink>
              
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass} end>
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name?.[0] || <Users className="h-5 w-5" />}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs font-medium text-gray-500">{isAdmin ? 'Administrator' : 'Student'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;