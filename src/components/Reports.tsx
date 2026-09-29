import React from 'react';
import { Employee, Attendance, LeaveRequest } from '../types';

interface ReportsProps {
  employees: Employee[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
}

const Reports: React.FC<ReportsProps> = ({ employees, attendance, leaves }) => {
  const activeEmployees = employees.filter(e => e.status === 'active');
  const totalSalary = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = activeEmployees.length > 0 ? totalSalary / activeEmployees.length : 0;
  const totalLeaveDays = leaves.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0);
  const attendanceRate = attendance.length > 0
    ? ((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100).toFixed(1)
    : 0;

  const departmentReport = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { count: 0, totalSalary: 0, activeCount: 0 };
    }
    acc[emp.department].count++;
    acc[emp.department].totalSalary += emp.salary;
    if (emp.status === 'active') acc[emp.department].activeCount++;
    return acc;
  }, {} as Record<string, { count: number; totalSalary: number; activeCount: number }>);

  const employeeAttendanceReport = activeEmployees.map(emp => {
    const records = attendance.filter(a => a.employeeId === emp.id);
    const presentCount = records.filter(a => a.status === 'present' || a.status === 'late').length;
    const totalRecords = records.length || 1;
    return {
      ...emp,
      attendanceRate: ((presentCount / totalRecords) * 100).toFixed(0),
      leaveDays: leaves.filter(l => l.employeeId === emp.id && l.status === 'approved').reduce((sum, l) => sum + l.days, 0),
    };
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">گزارشات</h1>
        <p className="text-gray-500 mt-1">گزارش‌های تحلیلی منابع انسانی</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">نرخ حضور</p>
              <p className="text-3xl font-bold mt-1">{attendanceRate}%</p>
            </div>
            <i className="fa-solid fa-chart-pie text-3xl text-indigo-200"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">حقوق ماهانه کل</p>
              <p className="text-3xl font-bold mt-1">{(totalSalary / 1000000).toLocaleString('fa-IR')}</p>
              <p className="text-emerald-200 text-xs">میلیون تومان</p>
            </div>
            <i className="fa-solid fa-money-bill-trend-up text-3xl text-emerald-200"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">میانگین حقوق</p>
              <p className="text-3xl font-bold mt-1">{(avgSalary / 1000000).toLocaleString('fa-IR')}</p>
              <p className="text-amber-200 text-xs">میلیون تومان</p>
            </div>
            <i className="fa-solid fa-scale-balanced text-3xl text-amber-200"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm">کل روزهای مرخصی</p>
              <p className="text-3xl font-bold mt-1">{totalLeaveDays}</p>
              <p className="text-rose-200 text-xs">روز (تأیید شده)</p>
            </div>
            <i className="fa-solid fa-calendar-days text-3xl text-rose-200"></i>
          </div>
        </div>
      </div>

      {/* Department Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">گزارش دپارتمان‌ها</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase rounded-r-lg">دپارتمان</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">تعداد کل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">فعال</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">حقوق کل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase rounded-l-lg">میانگین حقوق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.entries(departmentReport).map(([dept, data]) => (
                <tr key={dept} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{dept}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{data.count}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{data.activeCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{(data.totalSalary / 1000000).toLocaleString('fa-IR')} م.ت</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {data.count > 0 ? ((data.totalSalary / data.count) / 1000000).toLocaleString('fa-IR') : 0} م.ت
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Performance Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">عملکرد کارکنان</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase rounded-r-lg">کارمند</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">دپارتمان</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">نرخ حضور</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">روزهای مرخصی</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase rounded-l-lg">حقوق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employeeAttendanceReport.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {emp.firstName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            Number(emp.attendanceRate) >= 90 ? 'bg-green-400' :
                            Number(emp.attendanceRate) >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${emp.attendanceRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{emp.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp.leaveDays} روز</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{(emp.salary / 1000000).toLocaleString('fa-IR')} م.ت</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
