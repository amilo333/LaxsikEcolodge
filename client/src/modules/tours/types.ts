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
  translations?: {
    vi?: TTourTranslation;
    en?: TTourTranslation;
  };
};

export type TTourTranslation = {
  title: string;
  eyebrow: string;
  description: string;
  duration: string;
  rhythm: string;
  highlights: string[];
};
