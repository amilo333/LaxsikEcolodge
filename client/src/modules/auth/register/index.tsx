import { RegisterForm } from './components';
import Image from 'next/image';
import Link from 'next/link';

export function RegisterModule() {
  return (
    <div className='w-full max-w-[580px] rounded-[32px] border border-white/60 bg-white/94 p-6 shadow-[0_28px_90px_rgba(3,35,34,0.35)] backdrop-blur-xl sm:p-8 lg:p-9'>
      <div className='mb-5 flex items-center justify-between lg:hidden'>
        <Link href='/' aria-label='Back to Laxsik Ecolodge home'>
          <Image
            src='/images/logo/logo_1.png'
            alt='Laxsik Ecolodge'
            width={138}
            height={70}
            className='h-auto w-[124px]'
          />
        </Link>
        <span className='rounded-full bg-[#EAF1EF] px-3 py-1.5 text-[10px] font-bold text-[#0D4949] uppercase'>
          Join Laxsik
        </span>
      </div>

      <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
        Create your account
      </p>
      <h2 className='mt-1.5 text-3xl font-bold text-[#153F3D] sm:text-[36px]'>
        Begin your journey
      </h2>
      <p className='mt-2 mb-6 max-w-[470px] text-sm leading-6 text-[#61706C]'>
        Save your details and enjoy a smoother booking experience.
      </p>

      <RegisterForm />
    </div>
  );
}
