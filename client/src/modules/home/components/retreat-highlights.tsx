import Image from 'next/image';
import Link from 'next/link';
import { RETREAT_HIGHLIGHTS } from '../constant';
import { SectionHeading } from './section-heading';

export function RetreatHighlights() {
  return (
    <section className='px-4 py-16 sm:px-6 lg:py-24'>
      <div className='mx-auto max-w-7xl'>
        <SectionHeading eyebrow='More than a stay' title='Laxsik Ecolodge' />
        <div className='mt-12 grid gap-6 lg:grid-cols-2'>
          {RETREAT_HIGHLIGHTS.map((item) => (
            <article
              key={item.title}
              className='overflow-hidden rounded-[16px] bg-white shadow-[0_16px_50px_rgba(12,58,55,0.08)]'>
              <div className='relative aspect-[16/10] overflow-hidden'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover transition duration-500 hover:scale-[1.02]'
                />
              </div>
              <div className='px-6 py-7 text-center sm:px-10'>
                <h3 className='font-lora text-2xl font-semibold text-[#123F3C]'>
                  {item.title}
                </h3>
                <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-[#657A75]'>
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className='mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#0D5653] px-6 text-xs font-bold text-[#0D5653] transition hover:bg-[#0D5653] hover:text-white'>
                  {item.linkLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
