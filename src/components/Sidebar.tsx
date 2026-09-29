import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const menuItems: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'داشبورد', icon: 'fa-chart-line' },
  { id: 'employees', label: 'کارکنان', icon: 'fa-users' },
  { id: 'attendance', label: 'حضور و غیاب', icon: 'fa-clock' },
  { id: 'leaves', label: 'مرخصی‌ها', icon: 'fa-calendar-xmark' },
  { id: 'reports', label: 'گزارشات', icon: 'fa-file-lines' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen text-white shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-building text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold">مدیریت منابع انسانی</h1>
            <p className="text-xs text-slate-400">نسخه ۱.۰</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-indigo-500/20 text-indigo-300 border-r-4 border-indigo-400'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 right-3 left-3">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-sm"></i>
            </div>
            <div>
              <p className="text-sm font-medium">مدیر سیستم</p>
              <p className="text-xs text-slate-400">admin@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
