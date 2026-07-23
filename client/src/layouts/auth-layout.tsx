import Image from 'next/image';

export function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='relative flex min-h-screen items-center justify-end overflow-hidden'>
      <Image
        src='/images/background-slider.png'
        alt='Background'
        fill
        priority
        className='scale-105 object-cover'
      />

      <div className='absolute inset-0 bg-white/10' />

      <section className='mr-30'>{children}</section>
    </main>
  );
}
