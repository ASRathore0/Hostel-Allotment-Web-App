import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from 'lucide-react';
import { ApplicationFormData } from '../../types/application';
import { submitApplication } from '../../services/applicationService';
import { useToast } from '../../components/ui/Toaster';

const ApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: user?.name || '',
    studentId: user?.studentId || '',
    departmentName: '',
    year: '',
    cgpa: 0,
    roomType: '',
    preferredBlock: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For CGPA, ensure it's a valid number between 0 and 4
    if (name === 'cgpa') {
      const cgpa = parseFloat(value);
      if (cgpa < 0 || cgpa > 4) {
        setErrors(prev => ({ ...prev, cgpa: 'CGPA must be between 0 and 4' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.cgpa;
          return newErrors;
        });
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: name === 'cgpa' ? parseFloat(value) : value }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department is required';
    }
    
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    }
    
    if (formData.cgpa < 0 || formData.cgpa > 4) {
      newErrors.cgpa = 'CGPA must be between 0 and 4';
    }
    
    if (!formData.roomType.trim()) {
      newErrors.roomType = 'Room type is required';
    }
    
    if (!formData.preferredBlock.trim()) {
      newErrors.preferredBlock = 'Preferred block is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      toast('You must be logged in to submit an application', 'error');
      return;
    }
    
    try {
      setLoading(true);
      await submitApplication(formData, user.id);
      toast('Application submitted successfully!', 'success');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast('Failed to submit application. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Hostel Application Form
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fill in your details to apply for a hostel room.
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <form className="space-y-8 divide-y divide-gray-200 p-8" onSubmit={handleSubmit}>
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Provide your personal and academic details.
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                    Student ID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="studentId"
                      id="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.studentId ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.studentId && (
                      <p className="mt-2 text-sm text-red-600">{errors.studentId}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="departmentName"
                      id="departmentName"
                      value={formData.departmentName}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.departmentName ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.departmentName && (
                      <p className="mt-2 text-sm text-red-600">{errors.departmentName}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year of Study
                  </label>
                  <div className="mt-1">
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.year ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                      <option value="5th">5th Year</option>
                    </select>
                    {errors.year && (
                      <p className="mt-2 text-sm text-red-600">{errors.year}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700">
                    CGPA
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="cgpa"
                      id="cgpa"
                      min="0"
                      max="4"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.cgpa ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.cgpa && (
                      <p className="mt-2 text-sm text-red-600">{errors.cgpa}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Room Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select your preferred room type and block.
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
                    Room Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="roomType"
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.roomType ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Select Room Type</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                      <option value="Quad">Quad</option>
                    </select>
                    {errors.roomType && (
                      <p className="mt-2 text-sm text-red-600">{errors.roomType}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="preferredBlock" className="block text-sm font-medium text-gray-700">
                    Preferred Block
                  </label>
                  <div className="mt-1">
                    <select
                      id="preferredBlock"
                      name="preferredBlock"
                      value={formData.preferredBlock}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.preferredBlock ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Select Block</option>
                      <option value="Block A">Block A</option>
                      <option value="Block B">Block B</option>
                      <option value="Block C">Block C</option>
                      <option value="Block D">Block D</option>
                    </select>
                    {errors.preferredBlock && (
                      <p className="mt-2 text-sm text-red-600">{errors.preferredBlock}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;