import { Button } from '@/components/core';
import Image from 'next/image';
import { MENUS } from '../contants';

export function Navbar() {
  return (
    <div className='bg-[#0D4949]/90 text-white'>
      <div className='flex h-[120px] w-full items-center justify-between px-[60px]'>
        <div className='flex items-center gap-8'>
          <Image
            src='/images/logo/logo_2.png'
            alt='logo'
            width={108}
            height={120}
          />

          <Image
            src='/images/serperate_line.png'
            alt='down'
            width={12}
            height={6}
            className='h-[68px] w-[1px]'
          />

          <div>
            <h1 className='font-["Times_New_Roman"] text-[26px] opacity-70'>
              Laxsik Ecolodge
            </h1>

            <ul className='mt-2 flex gap-6 text-sm font-bold'>
              {MENUS.map((item) => (
                <li key={item} className='flex items-center gap-[6px]'>
                  {item}{' '}
                  <Image
                    src='/images/chevron_down.png'
                    alt='down'
                    width={12}
                    height={6}
                    className='h-[6px] w-[12px]'
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mr-[40px] flex items-center gap-2'>
          <Image
            src='/images/flag_eng.png'
            alt='language'
            width={24}
            height={16}
            className='h-[16px] w-[24px]'
          />
          <span className='text-sm font-bold'>ENG</span>
          <Image
            src='/images/chevron_down.png'
            alt='down'
            width={12}
            height={6}
            className='h-[6px] w-[12px]'
          />

          <Button className='ml-[36px] h-[52px] w-[185px]! bg-white text-[#0D4949]!'>
            FIND NOW
          </Button>
        </div>
      </div>
    </div>
  );
}
