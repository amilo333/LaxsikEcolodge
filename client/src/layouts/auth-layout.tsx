import Image from 'next/image';

export function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='relative min-h-screen overflow-hidden bg-[#0D4949] px-4 py-8 sm:px-8 lg:flex lg:items-center lg:px-14 lg:py-10'>
      <Image
        src='/images/background-slider.png'
        alt='Laxsik Ecolodge mountain landscape'
        fill
        priority
        sizes='100vw'
        className='scale-[1.02] object-cover'
      />

      <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,40,39,0.9)_0%,rgba(8,48,47,0.68)_43%,rgba(4,31,30,0.24)_72%,rgba(4,25,24,0.42)_100%)]' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.28))]' />

      <div className='relative z-10 mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1380px] items-center gap-10 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,580px)] lg:gap-16'>
        <section className='hidden max-w-[660px] text-white lg:block'>
          <Image
            src='/images/logo/logo_2.png'
            alt='Laxsik Ecolodge'
            width={180}
            height={200}
            className='h-auto w-[150px] object-contain'
          />

          <p className='mt-8 text-xs font-bold text-white/70 uppercase'>
            A peaceful nature retreat
          </p>
          <h1 className='font-lora mt-4 max-w-[620px] text-5xl leading-[1.12] font-semibold xl:text-6xl'>
            Return to nature. Rest in comfort.
          </h1>
          <p className='mt-6 max-w-[540px] text-base leading-7 text-white/78'>
            Sign in to continue your booking and keep every detail of your Sapa
            stay in one place.
          </p>

          <div className='mt-9 flex flex-wrap gap-3 text-sm font-semibold'>
            {['Mountain views', 'Local experiences', 'Peaceful stays'].map(
              (item) => (
                <span
                  key={item}
                  className='rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm'>
                  {item}
                </span>
              )
            )}
          </div>
        </section>

        <section className='flex w-full items-center justify-center lg:justify-end'>
          {children}
        </section>
      </div>
    </main>
  );
}
