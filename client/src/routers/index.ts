export const ROUTERS = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  ROOM: {
    LIST: "/rooms",
    DETAIL: (id: string) => `/rooms/${id}`,
  },
};
