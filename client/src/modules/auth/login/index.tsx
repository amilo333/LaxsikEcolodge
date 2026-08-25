import { LoginForm } from './components';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginModule() {
  return (
    <div className='w-full max-w-[520px] rounded-[32px] border border-white/60 bg-white/94 p-6 shadow-[0_28px_90px_rgba(3,35,34,0.35)] backdrop-blur-xl sm:p-9 lg:p-10'>
      <div className='mb-7 flex items-center justify-between lg:hidden'>
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
          Welcome back
        </span>
      </div>

      <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
        Member access
      </p>
      <h2 className='mt-2 text-3xl font-bold text-[#153F3D] sm:text-[38px]'>
        Welcome back
      </h2>
      <p className='mt-3 mb-8 max-w-[420px] text-sm leading-6 text-[#61706C]'>
        Sign in to manage your stay and continue your booking at Laxsik
        Ecolodge.
      </p>

      <LoginForm />
    </div>
  );
}
