export type TUser = {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
};

export type TUpdateProfilePayload = {
  full_name: string;
  email: string;
  phone: string;
};
