export interface Room {
  id: string;
  number: string;
  block: string;
  type: string;
  capacity: number;
  occupancy: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface RoomAvailability {
  block: string;
  roomType: string;
  total: number;
  available: number;
}