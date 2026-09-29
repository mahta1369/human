import React, { useState } from 'react';
import { Employee } from '../types';
import { departments } from '../data';

interface EmployeesProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const Employees: React.FC<EmployeesProps> = ({ employees, setEmployees }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    nationalId: '',
    email: '',
    phone: '',
    department: departments[0],
    position: '',
    hireDate: '',
    salary: 0,
    status: 'active',
  });

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = `${emp.firstName} ${emp.lastName} ${emp.nationalId}`.includes(searchTerm);
    const matchDept = !filterDept || emp.department === filterDept;
    const matchStatus = !filterStatus || emp.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      nationalId: '',
      email: '',
      phone: '',
      department: departments[0],
      position: '',
      hireDate: '',
      salary: 0,
      status: 'active',
    });
    setShowModal(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      nationalId: emp.nationalId,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      position: emp.position,
      hireDate: emp.hireDate,
      salary: emp.salary,
      status: emp.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این کارمند اطمینان دارید؟')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp =>
        emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
      ));
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">فعال</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">غیرفعال</span>;
      case 'onLeave':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">در مرخصی</span>;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کارکنان</h1>
          <p className="text-gray-500 mt-1">لیست و مدیریت اطلاعات کارکنان شرکت</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          <span>افزودن کارمند</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <i className="fa-solid fa-search absolute right-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="جستجوی نام یا کد ملی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">همه دپارتمان‌ها</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="onLeave">در مرخصی</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">کارمند</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">دپارتمان</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">سمت</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">تاریخ استخدام</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">حقوق</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">وضعیت</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {emp.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-500">{emp.nationalId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.hireDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.salary.toLocaleString('fa-IR')} ریال</td>
                  <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <i className="fa-solid fa-users text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-500">کارمندی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingEmployee ? 'ویرایش کارمند' : 'افزودن کارمند جدید'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <i className="fa-solid fa-xmark text-gray-500"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                  <input
                    type="text"
                    required
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تلفن</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دپارتمان</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سمت</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ استخدام</label>
                  <input
                    type="text"
                    required
                    placeholder="1403/01/01"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حقوق (ریال)</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                    <option value="onLeave">در مرخصی</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
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
                  {editingEmployee ? 'ذخیره تغییرات' : 'افزودن کارمند'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
