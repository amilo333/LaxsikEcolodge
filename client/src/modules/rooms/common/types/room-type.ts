export type TRoom = {
  _id: string;
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  bed: string;
  area: number;
  bathroom: string;
  fireplace: string;
  views: string;
  capacity: number;
  quantity: number;
  status: 'available' | 'maintenance' | 'inactive';
};
