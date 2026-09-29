import React, { useState } from 'react';
import { Attendance, Employee } from '../types';

interface AttendancePageProps {
  employees: Employee[];
  attendance: Attendance[];
  setAttendance: React.Dispatch<React.SetStateAction<Attendance[]>>;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ employees, attendance, setAttendance }) => {
  const [selectedDate, setSelectedDate] = useState('1403/01/15');
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    employeeId: '',
    checkIn: '',
    checkOut: '',
    status: 'present' as Attendance['status'],
  });

  const todayRecords = attendance.filter(a => a.date === selectedDate);

  const stats = {
    present: todayRecords.filter(a => a.status === 'present').length,
    late: todayRecords.filter(a => a.status === 'late').length,
    absent: employees.filter(e => e.status === 'active' && !todayRecords.find(a => a.employeeId === e.id)).length,
    halfDay: todayRecords.filter(a => a.status === 'halfDay').length,
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const record: Attendance = {
      id: Date.now().toString(),
      employeeId: newRecord.employeeId,
      date: selectedDate,
      checkIn: newRecord.checkIn,
      checkOut: newRecord.checkOut,
      status: newRecord.status,
    };
    setAttendance(prev => [...prev, record]);
    setShowModal(false);
    setNewRecord({ employeeId: '', checkIn: '', checkOut: '', status: 'present' });
  };

  const getStatusBadge = (status: Attendance['status']) => {
    switch (status) {
      case 'present':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">حاضر</span>;
      case 'late':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">تأخیر</span>;
      case 'absent':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">غایب</span>;
      case 'halfDay':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">نیمه‌روز</span>;
    }
  };

  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'نامشخص';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">حضور و غیاب</h1>
          <p className="text-gray-500 mt-1">مدیریت و ثبت حضور و غیاب کارکنان</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          <span>ثبت حضور</span>
        </button>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">تاریخ:</label>
          <input
            type="text"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="1403/01/15"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-40"
          />
          <div className="flex items-center gap-6 mr-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-600">حاضر: {stats.present}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-gray-600">تأخیر: {stats.late}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-xs text-gray-600">غایب: {stats.absent}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-600">نیمه‌روز: {stats.halfDay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">کارمند</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ساعت ورود</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ساعت خروج</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">مدت کار</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {todayRecords.map((record) => {
              const hours = record.checkIn && record.checkOut
                ? parseInt(record.checkOut) - parseInt(record.checkIn)
                : 0;
              return (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {getEmployeeName(record.employeeId).charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{getEmployeeName(record.employeeId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.checkIn || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.checkOut || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{hours > 0 ? `${hours} ساعت` : '—'}</td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {todayRecords.length === 0 && (
          <div className="text-center py-12">
            <i className="fa-solid fa-clock text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">رکوردی برای این تاریخ ثبت نشده است</p>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">ثبت حضور</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            </div>
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کارمند</label>
                <select
                  required
                  value={newRecord.employeeId}
                  onChange={(e) => setNewRecord({ ...newRecord, employeeId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">انتخاب کارمند...</option>
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ساعت ورود</label>
                  <input
                    type="text"
                    placeholder="08:00"
                    value={newRecord.checkIn}
                    onChange={(e) => setNewRecord({ ...newRecord, checkIn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ساعت خروج</label>
                  <input
                    type="text"
                    placeholder="17:00"
                    value={newRecord.checkOut}
                    onChange={(e) => setNewRecord({ ...newRecord, checkOut: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                <select
                  value={newRecord.status}
                  onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value as Attendance['status'] })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="present">حاضر</option>
                  <option value="late">تأخیر</option>
                  <option value="halfDay">نیمه‌روز</option>
                  <option value="absent">غایب</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                >
                  ثبت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
