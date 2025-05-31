import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, X, Clock, Building, Filter, Search } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Application } from '../../types/application';
import { Room } from '../../types/room';
import { getAllApplications, updateApplicationStatus } from '../../services/applicationService';
import { getAllRooms } from '../../services/roomService';
import { useToast } from '../../components/ui/Toaster';

const ApplicationsManagement: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: new URLSearchParams(location.search).get('status') || '',
    search: '',
    roomType: '',
    block: '',
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsData, roomsData] = await Promise.all([
          getAllApplications(),
          getAllRooms(),
        ]);
        
        setApplications(applicationsData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast('Failed to load applications', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    // Update status filter when URL changes
    const statusParam = new URLSearchParams(location.search).get('status');
    if (statusParam !== filters.status) {
      setFilters(prev => ({ ...prev, status: statusParam || '' }));
    }
  }, [location.search, filters.status]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (filters.status && app.status !== filters.status) return false;
    
    // Filter by room type
    if (filters.roomType && app.roomType !== filters.roomType) return false;
    
    // Filter by block
    if (filters.block && app.preferredBlock !== filters.block) return false;
    
    // Search by student name or ID
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(searchLower) ||
        app.studentId.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const openApprovalModal = (application: Application) => {
    setSelectedApplication(application);
    setSelectedRoom('');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
    setSelectedRoom('');
  };
  
  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    // For approval, a room must be selected
    if (selectedRoom === '') {
      toast('Please select a room to assign', 'warning');
      return;
    }
    
    try {
      setProcessing(true);
      await updateApplicationStatus(selectedApplication.id, 'approved', selectedRoom);
      
      // Update the application in the local state
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id 
            ? { ...app, status: 'approved', roomNumber: selectedRoom } 
            : app
        )
      );
      
      toast('Application approved successfully', 'success');
      closeModal();
    } catch (error) {
      console.error('Failed to approve application:', error);
      toast('Failed to approve application', 'error');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleReject = async () => {
    if (!selectedApplication) return;
    
    try {
      setProcessing(true);
      await updateApplicationStatus(selectedApplication.id, 'rejected');
      
      // Update the application in the local state
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id 
            ? { ...app, status: 'rejected' } 
            : app
        )
      );
      
      toast('Application rejected', 'info');
      closeModal();
    } catch (error) {
      console.error('Failed to reject application:', error);
      toast('Failed to reject application', 'error');
    } finally {
      setProcessing(false);
    }
  };
  
  // Get available rooms for the selected application
  const getAvailableRooms = () => {
    if (!selectedApplication) return [];
    
    return rooms.filter(room => 
      room.status === 'available' && 
      room.type === selectedApplication.roomType &&
      room.block === selectedApplication.preferredBlock
    );
  };
  
  const availableRooms = getAvailableRooms();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Applications Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review, approve, or reject student applications.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={filters.roomType}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Room Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Quad">Quad</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-700">
              Block
            </label>
            <select
              id="block"
              name="block"
              value={filters.block}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Name or ID"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Applications List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredApplications.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No applications found matching your filters.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <li key={application.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {application.studentName}
                      </p>
                      <p className="ml-2 text-sm text-gray-500">
                        (ID: {application.studentId})
                      </p>
                      <p className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      {application.status === 'pending' && (
                        <button
                          onClick={() => openApprovalModal(application)}
                          className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:flex-wrap">
                      <p className="flex items-center text-sm text-gray-500 sm:mr-6">
                        <Building className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {application.roomType} - {application.preferredBlock}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        CGPA: {application.cgpa.toFixed(2)}
                      </p>
                      {application.status === 'approved' && application.roomNumber && (
                        <p className="mt-2 flex items-center text-sm font-medium text-green-500 sm:mt-0 sm:ml-6">
                          Room Assigned: {application.roomNumber}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        Applied on{' '}
                        <time dateTime={application.createdAt.toString()}>
                          {new Date(application.createdAt).toLocaleDateString()}
                        </time>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Application Review Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Review Application
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Student Name</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Student ID</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Department</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.departmentName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Year</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.year}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">CGPA</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.cgpa.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Application Date</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(selectedApplication.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Room Type</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.roomType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Preferred Block</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedApplication.preferredBlock}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Room Assignment */}
                    <div className="mb-4">
                      <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                        Assign Room
                      </label>
                      <div className="mt-1">
                        <select
                          id="roomNumber"
                          name="roomNumber"
                          value={selectedRoom}
                          onChange={(e) => setSelectedRoom(e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a room</option>
                          {availableRooms.length > 0 ? (
                            availableRooms.map((room) => (
                              <option key={room.id} value={room.number}>
                                {room.number} ({room.type})
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No available rooms match the preferences
                            </option>
                          )}
                        </select>
                      </div>
                      {availableRooms.length === 0 && (
                        <p className="mt-2 text-sm text-red-600">
                          No available rooms match the student's preferences. Consider rejecting or asking the student to update preferences.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={processing || availableRooms.length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <LoadingSpinner size="sm\" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                      Approve
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={processing}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <LoadingSpinner size="sm\" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="-ml-1 mr-2 h-5 w-5" />
                      Reject
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={processing}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;