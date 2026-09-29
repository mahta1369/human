import React, { useState } from 'react';
import { Page, Employee, Attendance, LeaveRequest } from './types';
import { initialEmployees, initialAttendance, initialLeaves } from './data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import AttendancePage from './components/AttendancePage';
import LeavesPage from './components/LeavesPage';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard employees={employees} attendance={attendance} leaves={leaves} />;
      case 'employees':
        return <Employees employees={employees} setEmployees={setEmployees} />;
      case 'attendance':
        return <AttendancePage employees={employees} attendance={attendance} setAttendance={setAttendance} />;
      case 'leaves':
        return <LeavesPage employees={employees} leaves={leaves} setLeaves={setLeaves} />;
      case 'reports':
        return <Reports employees={employees} attendance={attendance} leaves={leaves} />;
      default:
        return <Dashboard employees={employees} attendance={attendance} leaves={leaves} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'داشبورد';
      case 'employees': return 'کارکنان';
      case 'attendance': return 'حضور و غیاب';
      case 'leaves': return 'مرخصی‌ها';
      case 'reports': return 'گزارشات';
      default: return '';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Sidebar currentPage={currentPage} onPageChange={(page) => { setCurrentPage(page); setSidebarOpen(false); }} />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <i className="fa-solid fa-bars text-gray-600"></i>
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
                <p className="text-xs text-gray-500">سیستم مدیریت منابع انسانی</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
                <i className="fa-solid fa-bell text-gray-600"></i>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  م
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">مدیر سیستم</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-73px)]">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
