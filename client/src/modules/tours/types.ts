export type TTour = {
  _id: string;
  title: string;
  eyebrow: string;
  description: string;
  thumbnail: string;
  duration: string;
  rhythm: string;
  highlights: string[];
  sortOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};
