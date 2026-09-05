type TChatRole = 'user' | 'assistant';

export type TChatRoom = {
  id: string;
  title: string;
  thumbnail: string | null;
  pricePerNight: number | null;
  capacity: number | null;
  views: string | null;
  stay: {
    checkInDate: string;
    checkOutDate: string;
    guests: number | null;
    roomCount: number | null;
    availableQuantity: number;
  } | null;
};

export type TChatMessage = {
  id: string;
  role: TChatRole;
  content: string;
  rooms?: TChatRoom[];
};

export type TChatApiMessage = Pick<TChatMessage, 'role' | 'content'>;

export type TChatResponse = {
  message: string;
  mode: 'fallback' | 'openai';
  model: string | null;
  toolsUsed: string[];
  rooms: TChatRoom[];
};
