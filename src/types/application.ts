export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  roomType: string;
  preferredBlock: string;
  cgpa: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  departmentName: string;
  year: string;
  roomNumber?: string;
}

export interface ApplicationFormData {
  name: string;
  studentId: string;
  departmentName: string;
  year: string;
  cgpa: number;
  roomType: string;
  preferredBlock: string;
}