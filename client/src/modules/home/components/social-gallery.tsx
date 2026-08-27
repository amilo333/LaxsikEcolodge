import Image from 'next/image';
import { GALLERY_IMAGES } from '../constant';
import { SectionHeading } from './section-heading';

export function SocialGallery() {
  return (
    <section
      id='gallery'
      className='relative mb-[70px] min-h-[720px] w-full overflow-hidden px-4 py-20 sm:px-6 lg:py-28'>
      <Image
        src='/images/banner/banner-str.png'
        alt='Terraced rice fields in Sa Pa'
        fill
        sizes='100vw'
        className='object-cover'
      />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(5,48,46,0.22),rgba(5,48,46,0.8))]' />
      <Image
        src='/images/mask.png'
        alt=''
        aria-hidden='true'
        width={1920}
        height={109}
        className='pointer-events-none absolute inset-x-0 top-0 z-20 h-auto w-full rotate-180 object-fill'
      />

      <div className='relative z-10 mx-auto flex min-h-[560px] w-full max-w-[1500px] flex-col justify-end'>
        <div className='[&_h2]:text-[clamp(1.35rem,6vw,3rem)]'>
          <SectionHeading
            eyebrow='Stories from the valley'
            title='#LAXSIK_ECOLODGE_SAPA'
            description='A glimpse of the landscape, local culture and quiet moments around Laxsik Ecolodge.'
            light
          />
        </div>

        <div className='mx-auto mt-10 grid w-full max-w-[320px] grid-cols-2 gap-3 sm:max-w-[520px] sm:grid-cols-3 lg:max-w-[980px] lg:grid-cols-6 lg:gap-4'>
          {GALLERY_IMAGES.map((image, index) => (
            <div
              key={image}
              className='relative aspect-square overflow-hidden rounded-[16px] border border-white/25 bg-white/10'>
              <Image
                src={image}
                alt={`Laxsik Ecolodge gallery ${index + 1}`}
                fill
                sizes='(max-width: 639px) 154px, (max-width: 1023px) 166px, 150px'
                className='object-cover transition duration-500 hover:scale-105'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
