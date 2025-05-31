import { User, LoginCredentials, RegisterData } from '../types/auth';

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    role: 'student',
    studentId: 'STU001',
  },
];

// In a real application, these functions would make API calls to a backend
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user
  const user = mockUsers.find(user => user.email === credentials.email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, we would validate the password here
  // For demo, we'll just check if it's 'password'
  if (credentials.password !== 'password') {
    throw new Error('Invalid email or password');
  }
  
  // Store user in localStorage for persistence
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

export const registerUser = async (data: RegisterData): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  if (mockUsers.some(user => user.email === data.email)) {
    throw new Error('User with this email already exists');
  }
  
  // Create a new user
  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    name: data.name,
    email: data.email,
    role: data.role,
    studentId: data.studentId,
  };
  
  // In a real app, we would store the user in a database
  mockUsers.push(newUser);
  
  // Store user in localStorage for persistence
  localStorage.setItem('user', JSON.stringify(newUser));
  
  return newUser;
};

export const logoutUser = async (): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Remove user from localStorage
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  
  if (!userJson) {
    return null;
  }
  
  return JSON.parse(userJson) as User;
};