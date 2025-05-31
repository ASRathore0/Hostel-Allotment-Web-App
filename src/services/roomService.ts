import { Room, RoomAvailability } from '../types/room';

// Mock rooms data
const mockRooms: Room[] = [
  // Block A - Single Rooms
  { id: '1', number: 'A-101', block: 'Block A', type: 'Single', capacity: 1, occupancy: 1, status: 'occupied' },
  { id: '2', number: 'A-102', block: 'Block A', type: 'Single', capacity: 1, occupancy: 0, status: 'available' },
  { id: '3', number: 'A-103', block: 'Block A', type: 'Single', capacity: 1, occupancy: 0, status: 'available' },
  { id: '4', number: 'A-104', block: 'Block A', type: 'Single', capacity: 1, occupancy: 1, status: 'occupied' },
  { id: '5', number: 'A-105', block: 'Block A', type: 'Single', capacity: 1, occupancy: 0, status: 'maintenance' },
  
  // Block A - Double Rooms
  { id: '6', number: 'A-201', block: 'Block A', type: 'Double', capacity: 2, occupancy: 1, status: 'available' },
  { id: '7', number: 'A-202', block: 'Block A', type: 'Double', capacity: 2, occupancy: 2, status: 'occupied' },
  { id: '8', number: 'A-203', block: 'Block A', type: 'Double', capacity: 2, occupancy: 0, status: 'available' },
  
  // Block B - Single Rooms
  { id: '9', number: 'B-101', block: 'Block B', type: 'Single', capacity: 1, occupancy: 0, status: 'available' },
  { id: '10', number: 'B-102', block: 'Block B', type: 'Single', capacity: 1, occupancy: 1, status: 'occupied' },
  
  // Block B - Double Rooms
  { id: '11', number: 'B-201', block: 'Block B', type: 'Double', capacity: 2, occupancy: 1, status: 'available' },
  { id: '12', number: 'B-202', block: 'Block B', type: 'Double', capacity: 2, occupancy: 0, status: 'available' },
  
  // Block C - Triple Rooms
  { id: '13', number: 'C-101', block: 'Block C', type: 'Triple', capacity: 3, occupancy: 2, status: 'available' },
  { id: '14', number: 'C-102', block: 'Block C', type: 'Triple', capacity: 3, occupancy: 3, status: 'occupied' },
  
  // Block D - Quad Rooms
  { id: '15', number: 'D-101', block: 'Block D', type: 'Quad', capacity: 4, occupancy: 2, status: 'available' },
  { id: '16', number: 'D-102', block: 'Block D', type: 'Quad', capacity: 4, occupancy: 4, status: 'occupied' },
];

// Get all rooms
export const getAllRooms = async (): Promise<Room[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockRooms;
};

// Get room availability summary
export const getRoomAvailability = async (): Promise<RoomAvailability[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const blocks = Array.from(new Set(mockRooms.map(room => room.block)));
  const roomTypes = Array.from(new Set(mockRooms.map(room => room.type)));
  
  const availability: RoomAvailability[] = [];
  
  blocks.forEach(block => {
    roomTypes.forEach(roomType => {
      const roomsInCategory = mockRooms.filter(
        room => room.block === block && room.type === roomType
      );
      
      if (roomsInCategory.length > 0) {
        const availableRooms = roomsInCategory.filter(
          room => room.status === 'available' || (room.status === 'occupied' && room.occupancy < room.capacity)
        );
        
        availability.push({
          block,
          roomType,
          total: roomsInCategory.length,
          available: availableRooms.length,
        });
      }
    });
  });
  
  return availability;
};

// Get rooms by block and type
export const getRoomsByBlockAndType = async (block: string, type: string): Promise<Room[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockRooms.filter(room => room.block === block && room.type === type);
};

// Add a new room
export const addRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRoom: Room = {
    id: `${mockRooms.length + 1}`,
    ...room,
  };
  
  mockRooms.push(newRoom);
  
  return newRoom;
};

// Update room status
export const updateRoomStatus = async (roomId: string, status: 'available' | 'occupied' | 'maintenance'): Promise<Room> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const roomIndex = mockRooms.findIndex(room => room.id === roomId);
  
  if (roomIndex === -1) {
    throw new Error('Room not found');
  }
  
  mockRooms[roomIndex].status = status;
  
  return mockRooms[roomIndex];
};

// Delete a room
export const deleteRoom = async (roomId: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const roomIndex = mockRooms.findIndex(room => room.id === roomId);
  
  if (roomIndex === -1) {
    throw new Error('Room not found');
  }
  
  mockRooms.splice(roomIndex, 1);
};