import Image from 'next/image';
import { TFooterProps } from './type';

export default function Footer(props: TFooterProps) {
  const {
    logo,
    title,
    address,
    hotline,
    email,
    menus,
    socials,
    copyright,
    className,
  } = props;

  return (
    <footer className={className}>
      <div className='flex flex-col items-center bg-[#F5F5F5] px-4 py-10'>
        <Image
          src={logo}
          alt={title}
          width={120}
          height={90}
          className='h-[160px] w-[234px] object-contain'
        />

        <p className='mt-4 text-center text-[17px] font-semibold'>{address}</p>

        <div className='flex flex-col items-center'>
          <p className='mt-3 text-[17px]'>Hotline: {hotline}</p>
          <p className='mt-1 text-[17px]'>Email: {email}</p>
        </div>

        <div className='mt-5 flex items-center gap-3'>
          {socials.map((social) => (
            <a
              key={social.alt}
              href={social.href}
              target='_blank'
              rel='noopener noreferrer'>
              <Image
                src={social.icon}
                alt={social.alt}
                width={48}
                height={48}
              />
            </a>
          ))}
        </div>

        <div className='text-uppercase mt-10 flex flex-wrap justify-center gap-10 text-[16px] font-semibold uppercase'>
          {menus.map((menu) => (
            <div key={menu}>{menu}</div>
          ))}
        </div>
      </div>

      <div className='bg-[#0D4949] py-2 text-center text-[16px] text-white'>
        {copyright}
      </div>
    </footer>
  );
}
