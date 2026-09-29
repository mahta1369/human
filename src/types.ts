export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'onLeave';
  avatar?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'halfDay';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'sick' | 'annual' | 'personal' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type Page = 'dashboard' | 'employees' | 'attendance' | 'leaves' | 'reports';
