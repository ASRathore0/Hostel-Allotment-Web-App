import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Building, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Application } from '../../types/application';
import { Room } from '../../types/room';
import { getAllApplications } from '../../services/applicationService';
import { getAllRooms } from '../../services/roomService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Calculate statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
  
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
  const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {user?.name}!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of the hostel room allocation system.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/admin/applications"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Manage Applications
          </Link>
          <Link
            to="/admin/rooms"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Building className="-ml-1 mr-2 h-5 w-5" />
            Manage Rooms
          </Link>
        </div>
      </div>
      
      {/* Application Statistics */}
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Application Statistics
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Applications
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {totalApplications}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/applications" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Applications
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {pendingApplications}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/applications?status=pending" className="font-medium text-blue-600 hover:text-blue-500">
                View pending
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approved Applications
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {approvedApplications}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/applications?status=approved" className="font-medium text-blue-600 hover:text-blue-500">
                View approved
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejected Applications
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {rejectedApplications}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/applications?status=rejected" className="font-medium text-blue-600 hover:text-blue-500">
                View rejected
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Room Statistics */}
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Room Statistics
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Rooms
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {totalRooms}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/rooms" className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Rooms
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {availableRooms}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/rooms?status=available" className="font-medium text-blue-600 hover:text-blue-500">
                View available
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Occupied Rooms
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {occupiedRooms}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/rooms?status=occupied" className="font-medium text-blue-600 hover:text-blue-500">
                View occupied
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Under Maintenance
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {maintenanceRooms}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/rooms?status=maintenance" className="font-medium text-blue-600 hover:text-blue-500">
                View maintenance
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Applications */}
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Recent Applications
      </h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <ul className="divide-y divide-gray-200">
          {applications.length === 0 ? (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No applications submitted yet.
            </li>
          ) : (
            applications.slice(0, 5).map((application) => (
              <li key={application.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {application.studentName} (ID: {application.studentId})
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        application.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Building className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {application.roomType} - {application.preferredBlock}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {application.departmentName}, Year {application.year}
                      </p>
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
            ))
          )}
        </ul>
        {applications.length > 5 && (
          <div className="bg-gray-50 px-4 py-3 text-sm border-t border-gray-200 sm:px-6">
            <Link to="/admin/applications" className="font-medium text-blue-600 hover:text-blue-500">
              View all applications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;