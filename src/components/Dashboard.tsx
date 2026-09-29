import React from 'react';
import { Employee, Attendance, LeaveRequest } from '../types';

interface DashboardProps {
  employees: Employee[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
}

const Dashboard: React.FC<DashboardProps> = ({ employees, attendance, leaves }) => {
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeave = employees.filter(e => e.status === 'onLeave').length;
  const todayAttendance = attendance.filter(a => a.date === '1403/01/15');
  const presentToday = todayAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'halfDay').length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const totalSalary = employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary, 0);

  const stats = [
    {
      title: 'کل کارکنان',
      value: employees.length,
      icon: 'fa-users',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'کارکنان فعال',
      value: activeEmployees,
      icon: 'fa-user-check',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'حاضر امروز',
      value: presentToday,
      icon: 'fa-calendar-check',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      title: 'درخواست مرخصی',
      value: pendingLeaves,
      icon: 'fa-calendar-xmark',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>
        <p className="text-gray-500 mt-1">خلاصه وضعیت منابع انسانی شرکت</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <i className={`fa-solid ${stat.icon} ${stat.textColor} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزیع کارکنان بر اساس دپارتمان</h3>
          <div className="space-y-4">
            {Object.entries(departmentStats).map(([dept, count]) => (
              <div key={dept} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-32">{dept}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-l from-indigo-500 to-indigo-400 h-3 rounded-full transition-all"
                    style={{ width: `${(count / employees.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-center">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leaves */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">آخرین درخواست‌های مرخصی</h3>
          <div className="space-y-3">
            {leaves.slice(0, 4).map((leave) => {
              const emp = employees.find(e => e.id === leave.employeeId);
              return (
                <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-600">
                        {emp?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {emp?.firstName} {emp?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{leave.reason}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                    leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {leave.status === 'approved' ? 'تأیید شده' :
                     leave.status === 'pending' ? 'در انتظار' : 'رد شده'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Salary Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">خلاصه مالی</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5">
            <p className="text-sm text-emerald-600 mb-1">حقوق ماهانه کل</p>
            <p className="text-2xl font-bold text-emerald-800">
              {(totalSalary / 1000000).toLocaleString('fa-IR')} میلیون تومان
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <p className="text-sm text-blue-600 mb-1">میانگین حقوق</p>
            <p className="text-2xl font-bold text-blue-800">
              {activeEmployees > 0 ? ((totalSalary / activeEmployees) / 1000000).toLocaleString('fa-IR') : 0} میلیون تومان
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-5">
            <p className="text-sm text-violet-600 mb-1">در مرخصی</p>
            <p className="text-2xl font-bold text-violet-800">{onLeave} نفر</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
