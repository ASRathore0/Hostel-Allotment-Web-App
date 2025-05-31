import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Building, Plus, Search, Filter, Edit, Trash, X, CheckCircle, 
  Users, AlertTriangle, Loader 
} from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Room } from '../../types/room';
import { 
  getAllRooms, 
  addRoom, 
  updateRoomStatus, 
  deleteRoom 
} from '../../services/roomService';
import { useToast } from '../../components/ui/Toaster';

const RoomsManagement: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // New room form state
  const [newRoom, setNewRoom] = useState({
    number: '',
    block: 'Block A',
    type: 'Single',
    capacity: 1,
    occupancy: 0,
    status: 'available' as const,
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: new URLSearchParams(location.search).get('status') || '',
    search: '',
    type: '',
    block: '',
  });
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        toast('Failed to load rooms', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
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
  
  const filteredRooms = rooms.filter(room => {
    // Filter by status
    if (filters.status && room.status !== filters.status) return false;
    
    // Filter by room type
    if (filters.type && room.type !== filters.type) return false;
    
    // Filter by block
    if (filters.block && room.block !== filters.block) return false;
    
    // Search by room number
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return room.number.toLowerCase().includes(searchLower);
    }
    
    return true;
  });
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'occupied':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'occupied':
      default:
        return <Users className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const handleNewRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'capacity' || name === 'occupancy') {
      setNewRoom(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      setNewRoom(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Update capacity based on room type
    if (name === 'type') {
      let capacity = 1;
      switch (value) {
        case 'Single':
          capacity = 1;
          break;
        case 'Double':
          capacity = 2;
          break;
        case 'Triple':
          capacity = 3;
          break;
        case 'Quad':
          capacity = 4;
          break;
      }
      setNewRoom(prev => ({ ...prev, capacity }));
    }
  };
  
  const validateRoom = () => {
    if (!newRoom.number.trim()) {
      toast('Room number is required', 'error');
      return false;
    }
    
    if (newRoom.occupancy > newRoom.capacity) {
      toast('Occupancy cannot be greater than capacity', 'error');
      return false;
    }
    
    return true;
  };
  
  const handleAddRoom = async () => {
    if (!validateRoom()) return;
    
    try {
      setProcessing(true);
      const addedRoom = await addRoom(newRoom);
      setRooms(prev => [...prev, addedRoom]);
      setIsAddModalOpen(false);
      setNewRoom({
        number: '',
        block: 'Block A',
        type: 'Single',
        capacity: 1,
        occupancy: 0,
        status: 'available',
      });
      toast('Room added successfully', 'success');
    } catch (error) {
      console.error('Failed to add room:', error);
      toast('Failed to add room', 'error');
    } finally {
      setProcessing(false);
    }
  };
  
  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };
  
  const handleUpdateRoomStatus = async (status: 'available' | 'occupied' | 'maintenance') => {
    if (!selectedRoom) return;
    
    try {
      setProcessing(true);
      const updatedRoom = await updateRoomStatus(selectedRoom.id, status);
      setRooms(prev => 
        prev.map(room => 
          room.id === selectedRoom.id ? updatedRoom : room
        )
      );
      setIsEditModalOpen(false);
      toast('Room status updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update room status:', error);
      toast('Failed to update room status', 'error');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    
    try {
      setProcessing(true);
      await deleteRoom(selectedRoom.id);
      setRooms(prev => prev.filter(room => room.id !== selectedRoom.id));
      setIsDeleteModalOpen(false);
      toast('Room deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete room:', error);
      toast('Failed to delete room', 'error');
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Rooms Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, and manage hostel rooms.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Room
          </button>
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
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
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
                placeholder="Room number"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Rooms List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredRooms.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No rooms found matching your filters.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRooms.map((room) => (
              <li key={room.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {room.number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {room.block} - {room.type}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(room.status)}`}>
                          <div className="flex items-center">
                            {getStatusIcon(room.status)}
                            <span className="ml-1 capitalize">{room.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        onClick={() => openEditModal(room)}
                        className="mr-2 inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(room)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Occupancy: {room.occupancy} / {room.capacity}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Add Room Modal */}
      {isAddModalOpen && (
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
                      Add New Room
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                          Room Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="number"
                            id="number"
                            value={newRoom.number}
                            onChange={handleNewRoomChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="e.g., A-101"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="block" className="block text-sm font-medium text-gray-700">
                          Block
                        </label>
                        <div className="mt-1">
                          <select
                            id="block"
                            name="block"
                            value={newRoom.block}
                            onChange={handleNewRoomChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="Block A">Block A</option>
                            <option value="Block B">Block B</option>
                            <option value="Block C">Block C</option>
                            <option value="Block D">Block D</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Room Type
                        </label>
                        <div className="mt-1">
                          <select
                            id="type"
                            name="type"
                            value={newRoom.type}
                            onChange={handleNewRoomChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Triple">Triple</option>
                            <option value="Quad">Quad</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                          Capacity
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="capacity"
                            id="capacity"
                            min="1"
                            max="4"
                            value={newRoom.capacity}
                            onChange={handleNewRoomChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="occupancy" className="block text-sm font-medium text-gray-700">
                          Current Occupancy
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="occupancy"
                            id="occupancy"
                            min="0"
                            max={newRoom.capacity}
                            value={newRoom.occupancy}
                            onChange={handleNewRoomChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="mt-1">
                          <select
                            id="status"
                            name="status"
                            value={newRoom.status}
                            onChange={handleNewRoomChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Under Maintenance</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddRoom}
                  disabled={processing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Adding...
                    </>
                  ) : (
                    'Add Room'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
      
      {/* Edit Room Modal */}
      {isEditModalOpen && selectedRoom && (
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
                      Edit Room Status
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Room Number</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedRoom.number}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Block</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedRoom.block}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Type</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedRoom.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Capacity</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedRoom.capacity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Occupancy</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedRoom.occupancy}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Current Status</p>
                          <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRoom.status}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      Update the status of this room:
                    </p>
                    
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={() => handleUpdateRoomStatus('available')}
                        disabled={processing || selectedRoom.status === 'available'}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                        Mark as Available
                      </button>
                      
                      <button
                        onClick={() => handleUpdateRoomStatus('occupied')}
                        disabled={processing || selectedRoom.status === 'occupied'}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Users className="-ml-1 mr-2 h-5 w-5" />
                        Mark as Occupied
                      </button>
                      
                      <button
                        onClick={() => handleUpdateRoomStatus('maintenance')}
                        disabled={processing || selectedRoom.status === 'maintenance'}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <AlertTriangle className="-ml-1 mr-2 h-5 w-5" />
                        Mark for Maintenance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Room Modal */}
      {isDeleteModalOpen && selectedRoom && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Room
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete room {selectedRoom.number}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteRoom}
                  disabled={processing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
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

export default RoomsManagement;