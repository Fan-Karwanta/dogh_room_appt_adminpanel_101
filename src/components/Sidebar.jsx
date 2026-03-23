import React from 'react';
import { LayoutDashboard, CalendarDays, Clock, CheckCircle, XCircle, Ban, LogOut, Settings } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'All Appointments', icon: CalendarDays },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'approved', label: 'Approved', icon: CheckCircle },
  { id: 'declined', label: 'Declined', icon: XCircle },
  { id: 'cancelled', label: 'Cancelled', icon: Ban },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Sidebar({ currentPage, onNavigate, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/dogh_logo.png" alt="DOGH" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">DOGH Admin</h2>
            <p className="text-xs text-gray-500 leading-tight">Appointment System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
