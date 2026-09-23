export const RETREAT_HIGHLIGHTS = [
  {
    id: 'wellness',
    image: '/images/view.png',
    href: '/spa-massage',
  },
  {
    id: 'restaurant',
    image: '/images/restaurant.png',
    href: '/dining',
  },
] as const;

export const EXPERIENCES = [
  {
    id: 'cuisine',
    image: '/images/img1.png',
    icon: '/images/icon/ic_chef.png',
    href: '/dining',
  },
  {
    id: 'trekking',
    image: '/images/img2.png',
    icon: '/images/icon/ic_hiking.png',
    href: '/tours',
  },
  {
    id: 'spa',
    image: '/images/img3.png',
    icon: '/images/icon/ic_spa.png',
    href: '/spa-massage',
  },
  {
    id: 'wedding',
    image: '/images/img4.png',
    icon: '/images/icon/ic_dance.png',
    href: 'mailto:info@laxsik.com',
  },
] as const;

export const GALLERY_IMAGES = Array.from(
  { length: 6 },
  (_, index) => `/images/collections/item${index + 1}.png`
);
