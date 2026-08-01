import Image from 'next/image';

export function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='relative min-h-screen'>
      <Image
        src={'/images/bg-screen.jpg'}
        alt='Background'
        className='-z-10 object-cover'
        fill
      />

      <div className='relative z-10'>{children}</div>
    </main>
  );
}
