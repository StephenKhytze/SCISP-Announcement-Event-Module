import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : undefined;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <div className="flex flex-col min-h-screen m-0 p-0 overflow-hidden bg-gray-100">
      {/* Topbar spans the full width at the top */}
      <Topbar currentUser={user} onLogout={handleLogout} onMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* Container for Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#f8f9fa]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
