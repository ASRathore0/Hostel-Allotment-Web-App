import React, { useState, useEffect } from 'react';
import { Building, Filter } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { RoomAvailability } from '../../types/room';
import { getRoomAvailability } from '../../services/roomService';

const RoomAvailabilityPage: React.FC = () => {
  const [availabilityData, setAvailabilityData] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    block: '',
    roomType: '',
  });
  
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await getRoomAvailability();
        setAvailabilityData(data);
      } catch (error) {
        console.error('Failed to fetch room availability:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, []);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredData = availabilityData.filter(item => {
    if (filter.block && item.block !== filter.block) return false;
    if (filter.roomType && item.roomType !== filter.roomType) return false;
    return true;
  });
  
  const blocks = Array.from(new Set(availabilityData.map(item => item.block)));
  const roomTypes = Array.from(new Set(availabilityData.map(item => item.roomType)));
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Room Availability
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Check current room availability across all blocks.
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="block" className="block text-sm font-medium text-gray-700">
              Block
            </label>
            <select
              id="block"
              name="block"
              value={filter.block}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Blocks</option>
              {blocks.map(block => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={filter.roomType}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Types</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Availability Summary */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredData.length === 0 ? (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No rooms matching your filters.
            </li>
          ) : (
            filteredData.map((item, index) => (
              <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150">
                <div className="flex items-center justify-between">
                  <div className="sm:flex sm:items-center sm:justify-start">
                    <div className="flex-shrink-0">
                      <Building className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                      <div className="text-sm font-medium text-blue-600">
                        {item.block}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.roomType} Rooms
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex flex-col items-end">
                    <div className="text-sm font-medium text-gray-900">
                      {item.available} / {item.total} Available
                    </div>
                    <div className="mt-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${(item.available / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        item.available === 0 
                          ? 'bg-red-500' 
                          : item.available < item.total / 3 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${(item.available / item.total) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-sm text-gray-500">
                    <div>
                      {item.available === 0 
                        ? 'No rooms available' 
                        : item.available === 1 
                          ? '1 room available' 
                          : `${item.available} rooms available`}
                    </div>
                    <div>
                      {item.total} total
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      {/* Legend */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2" />
            <span className="text-sm text-gray-700">Good availability</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2" />
            <span className="text-sm text-gray-700">Limited availability</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
            <span className="text-sm text-gray-700">No availability</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityPage;