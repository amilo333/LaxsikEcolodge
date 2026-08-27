import Image from 'next/image';
import Link from 'next/link';
import { EXPERIENCES } from '../constant';
import { SectionHeading } from './section-heading';

export function ExperiencesSection() {
  return (
    <section className='bg-white py-16 lg:py-24'>
      <div className='px-4 sm:px-6'>
        <SectionHeading
          eyebrow='Culture, landscape and wellbeing'
          title='Exploring Sa Pa'
        />
      </div>

      <div className='mt-12 w-full overflow-hidden rounded-[16px] bg-[#EEF3F1]'>
        {EXPERIENCES.map((item, index) => (
          <article key={item.title} className='grid w-full md:grid-cols-2'>
            <div
              className={`relative min-h-[360px] md:min-h-[520px] ${index % 2 === 1 ? 'md:order-2' : ''}`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover'
              />
            </div>

            <div
              className={`flex min-h-[360px] flex-col items-center justify-center px-7 py-12 text-center sm:px-12 lg:min-h-[520px] lg:px-24 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
              <Image
                src={item.icon}
                alt=''
                width={68}
                height={68}
                className='h-14 w-14 object-contain'
              />
              <h3 className='font-lora mt-5 text-2xl font-semibold text-[#123F3C] uppercase sm:text-3xl'>
                {item.title}
              </h3>
              <p className='mt-4 max-w-lg text-sm leading-7 text-[#60746F]'>
                {item.description}
              </p>
              <Link
                href={item.href}
                className='mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0D5653] px-6 text-xs font-bold text-white uppercase transition hover:bg-[#083E3D]'>
                {item.linkLabel}
                <span aria-hidden='true' className='ml-2 text-base'>
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
