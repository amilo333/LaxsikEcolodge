export const RETREAT_HIGHLIGHTS = [
  {
    title: 'Laxsik Wellness',
    description:
      'A quiet wellness space surrounded by rice terraces, created for movement, rest and unhurried moments in the mountain air.',
    image: '/images/view.png',
    href: '/spa-massage',
    linkLabel: 'Discover wellness',
  },
  {
    title: 'Muong Hoa Restaurant',
    description:
      'A warm dining room overlooking the valley, where each meal brings together local ingredients and the flavours of the Northwest.',
    image: '/images/restaurant.png',
    href: '/dining',
    linkLabel: 'Explore dining',
  },
] as const;

export const EXPERIENCES = [
  {
    title: "H'Mong cuisine with chef",
    description:
      "Cook alongside our local team and discover the ingredients, techniques and stories behind H'Mong cuisine.",
    image: '/images/img1.png',
    icon: '/images/icon/ic_chef.png',
    href: '/dining',
    linkLabel: 'Explore dining',
  },
  {
    title: 'Trekking tour',
    description:
      'Walk through Muong Hoa Valley, terraced fields and mountain villages with the landscape of Sa Pa unfolding around you.',
    image: '/images/img2.png',
    icon: '/images/icon/ic_hiking.png',
    href: '/tours',
    linkLabel: 'Explore Sa Pa',
  },
  {
    title: 'Po Mu Spa',
    description:
      'Slow down with restorative treatments inspired by Red Dao herbal traditions and the calm rhythm of the mountains.',
    image: '/images/img3.png',
    icon: '/images/icon/ic_spa.png',
    href: '/spa-massage',
    linkLabel: 'Explore spa',
  },
  {
    title: 'Wedding on the clouds',
    description:
      'Celebrate against a mountain panorama with an intimate setting shaped by flowers, local craft and the beauty of Sa Pa.',
    image: '/images/img4.png',
    icon: '/images/icon/ic_dance.png',
    href: 'mailto:info@laxsik.com',
    linkLabel: 'Plan your day',
  },
] as const;

export const GALLERY_IMAGES = Array.from(
  { length: 6 },
  (_, index) => `/images/collections/item${index + 1}.png`
);
