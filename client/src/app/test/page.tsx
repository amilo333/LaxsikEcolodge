import { Footer } from '@/components/layouts';

export default function Test() {
  return (
    <div>
      <Footer
        logo='/images/logo.png'
        title='Laxsik Ecolodge'
        address='Lao Chai, Sa Pa, Lao Cai, Vietnam'
        hotline='(+84) 214 3892 999'
        email='info@laxsik.com or laxsik.customercare@gmail.com'
        menus={[
          'Join Our Teams',
          'Become a Partner',
          'Privacy & policies',
          'Terms & Conditions',
        ]}
        socials={[
          { icon: '/images/icon/ic_twitter.png', alt: 'Twitter', href: '#' },
          { icon: '/images/icon/ic_linkedin.png', alt: 'Linkedin', href: '#' },
          { icon: '/images/icon/ic_facebook.png', alt: 'Facebook', href: '#' },
          {
            icon: '/images/icon/ic_instagram.png',
            alt: 'Instagram',
            href: '#',
          },
        ]}
        copyright='© 2026  Laxsik Ecolodge. All rights reserved.'
      />
    </div>
  );
}
