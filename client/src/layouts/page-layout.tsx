import Image from 'next/image';

type PageLayoutProps = {
  children: React.ReactNode;
  srcIBg: string;
};

export function PageLayout({ children, srcIBg }: Readonly<PageLayoutProps>) {
  return (
    <main className='relative min-h-screen'>
      <Image
        src={srcIBg}
        alt='Background'
        className='-z-10 object-cover'
        fill
      />

      <div className='relative z-10'>{children}</div>
    </main>
  );
}
