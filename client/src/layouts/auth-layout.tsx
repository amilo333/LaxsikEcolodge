import Image from 'next/image';

export function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='relative min-h-dvh overflow-x-hidden overflow-y-auto bg-[#0D4949] px-4 py-4 sm:px-7 sm:py-6 lg:flex lg:h-dvh lg:items-center lg:px-10 lg:py-6 xl:px-14'>
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

      <div className='relative z-10 mx-auto grid min-h-[calc(100dvh-32px)] w-full max-w-[1380px] items-center gap-8 sm:min-h-[calc(100dvh-48px)] lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(400px,540px)] lg:gap-10 xl:gap-16'>
        <section className='hidden max-w-[660px] text-white lg:block'>
          <Image
            src='/images/logo/logo_2.png'
            alt='Laxsik Ecolodge'
            width={180}
            height={200}
            className='h-auto w-[120px] object-contain xl:w-[140px]'
          />

          <p className='mt-5 text-[11px] font-bold text-white/70 uppercase xl:mt-7 xl:text-xs'>
            A peaceful nature retreat
          </p>
          <h1 className='font-lora mt-3 max-w-[620px] text-4xl leading-[1.1] font-semibold xl:mt-4 xl:text-5xl 2xl:text-6xl'>
            Return to nature. Rest in comfort.
          </h1>
          <p className='mt-4 max-w-[540px] text-sm leading-6 text-white/78 xl:mt-5 xl:text-base xl:leading-7'>
            Sign in to continue your booking and keep every detail of your Sapa
            stay in one place.
          </p>

          <div className='mt-6 flex flex-wrap gap-2.5 text-xs font-semibold xl:mt-8 xl:gap-3 xl:text-sm'>
            {['Mountain views', 'Local experiences', 'Peaceful stays'].map(
              (item) => (
                <span
                  key={item}
                  className='rounded-full border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-sm xl:px-4 xl:py-2.5'>
                  {item}
                </span>
              )
            )}
          </div>
        </section>

        <section className='flex min-h-0 w-full items-center justify-center lg:h-full lg:justify-end'>
          {children}
        </section>
      </div>
    </main>
  );
}
