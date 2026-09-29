import React, { useState } from 'react';
import { LeaveRequest, Employee } from '../types';

interface LeavesPageProps {
  employees: Employee[];
  leaves: LeaveRequest[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}

const LeavesPage: React.FC<LeavesPageProps> = ({ employees, leaves, setLeaves }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [newLeave, setNewLeave] = useState<Omit<LeaveRequest, 'id'>>({
    employeeId: '',
    type: 'annual',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    status: 'pending',
  });

  const filteredLeaves = leaves.filter(l => !filterStatus || l.status === filterStatus);

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const leave: LeaveRequest = {
      id: Date.now().toString(),
      ...newLeave,
    };
    setLeaves(prev => [...prev, leave]);
    setShowModal(false);
    setNewLeave({ employeeId: '', type: 'annual', startDate: '', endDate: '', days: 1, reason: '', status: 'pending' });
  };

  const handleStatusChange = (id: string, status: LeaveRequest['status']) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این درخواست اطمینان دارید؟')) {
      setLeaves(prev => prev.filter(l => l.id !== id));
    }
  };

  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'نامشخص';
  };

  const getTypeLabel = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'annual': return 'سالانه';
      case 'sick': return 'استعلاجی';
      case 'personal': return 'شخصی';
      case 'unpaid': return 'بدون حقوق';
    }
  };

  const getTypeBadge = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-700';
      case 'sick': return 'bg-red-100 text-red-700';
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'unpaid': return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
    }
  };

  const getStatusLabel = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return 'تأیید شده';
      case 'pending': return 'در انتظار';
      case 'rejected': return 'رد شده';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت مرخصی‌ها</h1>
          <p className="text-gray-500 mt-1">ثبت و پیگیری درخواست‌های مرخصی کارکنان</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          <span>درخواست مرخصی</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-hourglass-half text-yellow-500"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{leaves.filter(l => l.status === 'pending').length}</p>
              <p className="text-xs text-gray-500">در انتظار</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-check text-green-500"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{leaves.filter(l => l.status === 'approved').length}</p>
              <p className="text-xs text-gray-500">تأیید شده</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-xmark text-red-500"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{leaves.filter(l => l.status === 'rejected').length}</p>
              <p className="text-xs text-gray-500">رد شده</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-calendar text-indigo-500"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{leaves.reduce((sum, l) => sum + l.days, 0)}</p>
              <p className="text-xs text-gray-500">کل روزها</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">فیلتر وضعیت:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">همه</option>
            <option value="pending">در انتظار</option>
            <option value="approved">تأیید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </div>
      </div>

      {/* Leaves List */}
      <div className="space-y-4">
        {filteredLeaves.map((leave) => (
          <div key={leave.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getEmployeeName(leave.employeeId).charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{getEmployeeName(leave.employeeId)}</h3>
                  <p className="text-sm text-gray-500 mt-1">{leave.reason}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(leave.type)}`}>
                      {getTypeLabel(leave.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {leave.startDate} تا {leave.endDate}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({leave.days} روز)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(leave.status)}`}>
                  {getStatusLabel(leave.status)}
                </span>
                {leave.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatusChange(leave.id, 'approved')}
                      className="w-8 h-8 bg-green-50 text-green-500 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                      title="تأیید"
                    >
                      <i className="fa-solid fa-check text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleStatusChange(leave.id, 'rejected')}
                      className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                      title="رد"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(leave.id)}
                  className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="حذف"
                >
                  <i className="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredLeaves.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <i className="fa-solid fa-calendar-xmark text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">درخواست مرخصی‌ای یافت نشد</p>
          </div>
        )}
      </div>

      {/* Add Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">ثبت درخواست مرخصی</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            </div>
            <form onSubmit={handleAddLeave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">کارمند</label>
                <select
                  required
                  value={newLeave.employeeId}
                  onChange={(e) => setNewLeave({ ...newLeave, employeeId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">انتخاب کارمند...</option>
                  {employees.filter(e => e.status === 'active').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع مرخصی</label>
                <select
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value as LeaveRequest['type'] })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="annual">سالانه</option>
                  <option value="sick">استعلاجی</option>
                  <option value="personal">شخصی</option>
                  <option value="unpaid">بدون حقوق</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ شروع</label>
                  <input
                    type="text"
                    required
                    placeholder="1403/01/15"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ پایان</label>
                  <input
                    type="text"
                    required
                    placeholder="1403/01/17"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تعداد روز</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newLeave.days}
                  onChange={(e) => setNewLeave({ ...newLeave, days: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دلیل</label>
                <textarea
                  required
                  rows={3}
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
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
                  ثبت درخواست
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesPage;
