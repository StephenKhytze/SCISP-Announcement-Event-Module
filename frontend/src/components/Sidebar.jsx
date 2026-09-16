import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Monitor, BookOpen, GraduationCap, Users, LogOut, ArrowLeft, ArrowRight, X } from 'lucide-react';

export default function Sidebar({ isMobileOpen = false, onCloseMobile = () => {} }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/announcements', label: 'Announcements', icon: Monitor },
    { path: '/library', label: 'Library', icon: BookOpen },
    { path: '/student-info', label: 'Student Information', icon: GraduationCap },
    { path: '/faculty', label: 'Faculty Directory', icon: Users },
  ];

  return (
    <>
      {/* Mobile backdrop: dims the page and closes the drawer on click */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[35] md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${isCollapsed ? 'md:w-[100px]' : 'md:w-[280px]'} w-[280px] bg-[#80172B] text-white flex flex-col shrink-0 transition-all duration-300 ease-in-out
          fixed top-[86px] bottom-0 left-0 z-40 min-h-0
          md:static md:top-auto md:bottom-auto md:z-auto md:min-h-[calc(100vh-86px)]
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Mobile-only header: close button for the drawer */}
        <div className="flex md:hidden items-center justify-between p-5 border-b border-[#651020]">
          <span className="font-bold text-[15px] tracking-wide text-white/90">Menu</span>
          <button
            onClick={onCloseMobile}
            className="text-white hover:bg-white/10 p-1.5 rounded transition-colors focus:outline-none"
            title="Close menu"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Collapse arrow at the top right of sidebar (desktop only) */}
        <div className={`hidden md:flex ${isCollapsed ? 'justify-center' : 'justify-end'} p-5 transition-all duration-300`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 p-1.5 rounded transition-colors focus:outline-none"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ArrowRight className="w-6 h-6 text-white/80" /> : <ArrowLeft className="w-6 h-6 text-white/80" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col space-y-1.5 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center py-4 pl-8 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#182848] text-white rounded-r-2xl shadow-[6px_0_15px_rgba(0,0,0,0.25)] w-[calc(100%+20px)] relative z-10'
                      : 'text-white/80 hover:bg-white/10 hover:text-white rounded-r-2xl w-full pr-4'
                  } ${isCollapsed ? 'md:justify-center md:pl-0' : ''} space-x-4`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/80'}`} />
                  <span
                    className={`${isCollapsed ? 'md:hidden' : ''} font-bold text-[15px] tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300`}
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Sign Out Button at the bottom */}
        <div className="mt-auto border-t border-[#651020] pt-4 pb-6">
          <Link
            to="/auth"
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
              onCloseMobile();
            }}
            className={`flex items-center py-4 pl-8 text-white/80 hover:bg-white/10 hover:text-white rounded-r-2xl w-full transition-all duration-300 ${
              isCollapsed ? 'md:justify-center md:pr-0 md:pl-0' : ''
            } space-x-4 pr-4`}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-white/80" />
            <span
              className={`${isCollapsed ? 'md:hidden' : ''} font-bold text-[15px] tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300`}
            >
              Sign Out
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
