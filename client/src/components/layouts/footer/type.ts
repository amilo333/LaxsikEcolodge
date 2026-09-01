type TSocialItem = {
  icon: string;
  alt: string;
  href: string;
};

export type TFooterProps = {
  logo: string;
  title: string;
  address: string;
  hotline: string;
  email: string;
  menus: string[];
  socials: TSocialItem[];
  copyright?: string;
  className?: string;
};
