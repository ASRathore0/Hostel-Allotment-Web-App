import { Application, ApplicationFormData } from '../types/application';

// Mock applications data
let mockApplications: Application[] = [
  {
    id: '1',
    studentId: '2',
    studentName: 'Student User',
    roomType: 'Single',
    preferredBlock: 'Block A',
    cgpa: 3.5,
    status: 'approved',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-15'),
    departmentName: 'Computer Science',
    year: '3rd',
    roomNumber: 'A-101',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Student User',
    roomType: 'Double',
    preferredBlock: 'Block B',
    cgpa: 3.5,
    status: 'pending',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20'),
    departmentName: 'Computer Science',
    year: '3rd',
  },
];

// Get all applications
export const getAllApplications = async (): Promise<Application[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockApplications;
};

// Get applications for a specific student
export const getStudentApplications = async (studentId: string): Promise<Application[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockApplications.filter(app => app.studentId === studentId);
};

// Submit a new application
export const submitApplication = async (data: ApplicationFormData, userId: string): Promise<Application> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newApplication: Application = {
    id: `${mockApplications.length + 1}`,
    studentId: userId,
    studentName: data.name,
    roomType: data.roomType,
    preferredBlock: data.preferredBlock,
    cgpa: data.cgpa,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    departmentName: data.departmentName,
    year: data.year,
  };
  
  mockApplications.push(newApplication);
  
  return newApplication;
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string,
  status: 'pending' | 'approved' | 'rejected',
  roomNumber?: string
): Promise<Application> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const application = mockApplications.find(app => app.id === applicationId);
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  application.status = status;
  application.updatedAt = new Date();
  
  if (status === 'approved' && roomNumber) {
    application.roomNumber = roomNumber;
  }
  
  // Update the application in the mock data
  mockApplications = mockApplications.map(app => 
    app.id === applicationId ? application : app
  );
  
  return application;
};