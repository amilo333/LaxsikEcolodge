export type TRoom = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  bed: string;
  area: number;
  capacity: number;
  quantity: number;
  status: 'available' | 'maintenance' | 'inactive';
};
