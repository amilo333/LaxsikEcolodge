import { Header } from '@/components/layouts';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className='relative min-h-[680px] overflow-hidden sm:min-h-[760px] lg:min-h-[860px]'>
      <Image
        src='/images/banner/banner-home.png'
        alt='Laxsik Ecolodge among the rice terraces of Lao Chai, Sa Pa'
        fill
        priority
        sizes='100vw'
        className='object-cover object-center'
      />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,38,37,0.36)_0%,rgba(4,38,37,0.04)_45%,rgba(4,38,37,0.58)_100%)]' />

      <div className='absolute inset-x-0 top-0 z-20'>
        <Header />
      </div>

      <div className='relative z-10 flex min-h-[680px] flex-col items-center justify-center px-5 pt-100 text-center text-white sm:min-h-[760px] lg:min-h-[860px]'>
        <Image
          src='/images/banner/title.png'
          alt='Laxsik Ecolodge'
          width={400}
          height={100}
          priority
          sizes='100vw'
          className='object-cover object-center'
        />
        <p className='mt-8 text-xs font-semibold uppercase drop-shadow-md sm:text-sm lg:text-base'>
          Lao Chai, Sa Pa, Lao Cai, Vietnam
        </p>
      </div>
    </section>
  );
}
