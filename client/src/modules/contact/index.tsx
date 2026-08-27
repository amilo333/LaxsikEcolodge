'use client';

import { Footer, Header } from '@/components/layouts';
import Image from 'next/image';

const MAP_EMBED_URL =
  'https://www.google.com/maps?q=Laxsik%20Ecolodge%20Lao%20Chai%20Sa%20Pa%20Vietnam&output=embed';
const DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=Laxsik%20Ecolodge%20Lao%20Chai%20Sa%20Pa%20Vietnam';

const CONTACT_COPY = {
  heroEyebrow: 'Lao Chai · Sa Pa · Vietnam',
  heroTitle: 'Contact Laxsik Ecolodge',
  heroDescription:
    'We are here to help with your stay, the journey to Lao Chai and any questions before you arrive.',
  heroAlt: 'Laxsik Ecolodge illuminated in the mountains at night',
  sectionEyebrow: 'Find your way to the valley',
  sectionTitle: 'We look forward to hearing from you',
  sectionDescription:
    'Laxsik Ecolodge is set among the rice terraces of Lao Chai. Use the map for directions or reach our team directly by phone and email.',
  mapTitle: 'Location of Laxsik Ecolodge on Google Maps',
  directions: 'Open directions',
  addressLabel: 'Address',
  address: 'Lao Chai, Sa Pa, Lao Cai, Vietnam',
  hotlineLabel: 'Hotline',
  emailLabel: 'Email',
  responseNote:
    'For the quickest response, please call our hotline. Email enquiries are welcomed at any time.',
} as const;

export function ContactModule() {
  const copy = CONTACT_COPY;

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#163E3B]">
      <Header />

      <main>
        <section className='relative min-h-[420px] overflow-hidden sm:min-h-[480px]'>
          <Image
            src='/images/contact_us_header.png'
            alt={copy.heroAlt}
            fill
            priority
            sizes='100vw'
            className='object-cover object-center'
          />
          <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(4,42,40,0.82)_0%,rgba(4,42,40,0.5)_48%,rgba(4,42,40,0.3)_100%)]' />

          <div className='relative z-10 mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center px-5 pb-14 text-white sm:min-h-[480px] sm:px-8'>
            <p className='text-xs font-bold tracking-[0.24em] text-white/72 uppercase sm:text-sm'>
              {copy.heroEyebrow}
            </p>
            <h1 className='font-lora mt-5 max-w-3xl text-4xl leading-tight font-semibold sm:text-6xl lg:text-7xl'>
              {copy.heroTitle}
            </h1>
            <p className='mt-6 max-w-2xl text-sm leading-7 text-white/82 sm:text-base sm:leading-8'>
              {copy.heroDescription}
            </p>
          </div>

          <Image
            src='/images/maskfix.png'
            alt=''
            aria-hidden='true'
            width={1920}
            height={109}
            className='pointer-events-none absolute inset-x-0 bottom-0 z-20 h-auto w-full object-fill'
          />
        </section>

        <section className='px-5 py-20 sm:px-8 sm:py-24 lg:py-32'>
          <div className='mx-auto max-w-6xl text-center'>
            <p className='text-xs font-bold tracking-[0.2em] text-[#70837E] uppercase'>
              {copy.sectionEyebrow}
            </p>
            <h2 className='font-lora mt-4 text-3xl font-semibold text-[#0D5653] sm:text-5xl'>
              {copy.sectionTitle}
            </h2>
            <p className='mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#60746F] sm:text-base sm:leading-8'>
              {copy.sectionDescription}
            </p>
          </div>

          <div className='mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px] border border-[#DCE5E1] bg-white shadow-[0_24px_80px_rgba(21,67,63,0.1)] sm:mt-16'>
            <div className='relative h-[380px] bg-[#E8EEEB] sm:h-[500px] lg:h-[560px]'>
              <iframe
                src={MAP_EMBED_URL}
                title={copy.mapTitle}
                loading='lazy'
                allowFullScreen
                referrerPolicy='no-referrer-when-downgrade'
                className='absolute inset-0 h-full w-full border-0'
              />

              <a
                href={DIRECTIONS_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='absolute top-5 right-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D5653] px-5 text-xs font-bold text-white shadow-[0_10px_30px_rgba(4,43,41,0.24)] transition hover:bg-[#083E3D] sm:top-7 sm:right-7'>
                <svg
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='h-4 w-4 fill-none stroke-current stroke-2'>
                  <path d='M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z' />
                  <circle cx='12' cy='9' r='2.5' />
                </svg>
                {copy.directions}
              </a>
            </div>

            <div className='grid divide-y divide-[#E1E9E5] lg:grid-cols-3 lg:divide-x lg:divide-y-0'>
              <article className='px-7 py-9 sm:px-10 sm:py-11'>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2EF] text-[#0D5653]'>
                  <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    className='h-5 w-5 fill-none stroke-current stroke-2'>
                    <path d='M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z' />
                    <circle cx='12' cy='9' r='2.5' />
                  </svg>
                </div>
                <h3 className='mt-5 text-xs font-bold tracking-[0.18em] text-[#70837E] uppercase'>
                  {copy.addressLabel}
                </h3>
                <p className='mt-3 text-sm leading-7 font-semibold text-[#183F3C]'>
                  {copy.address}
                </p>
              </article>

              <article className='px-7 py-9 sm:px-10 sm:py-11'>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2EF] text-[#0D5653]'>
                  <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    className='h-5 w-5 fill-none stroke-current stroke-2'>
                    <path d='M7.2 3.8 9.5 8 7.8 9.7c1.2 2.5 2.9 4.2 5.5 5.5l1.7-1.7 4.2 2.3v2.5c0 1.1-.9 2-2 2C9.8 20.3 3.7 14.2 3.7 6.8c0-1.1.9-2 2-2h1.5Z' />
                  </svg>
                </div>
                <h3 className='mt-5 text-xs font-bold tracking-[0.18em] text-[#70837E] uppercase'>
                  {copy.hotlineLabel}
                </h3>
                <a
                  href='tel:+842143892999'
                  className='mt-3 inline-block text-sm leading-7 font-semibold text-[#183F3C] transition hover:text-[#0D7771]'>
                  (+84) 214 3892 999
                </a>
              </article>

              <article className='px-7 py-9 sm:px-10 sm:py-11'>
                <div className='flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF2EF] text-[#0D5653]'>
                  <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    className='h-5 w-5 fill-none stroke-current stroke-2'>
                    <rect x='3' y='5' width='18' height='14' rx='2' />
                    <path d='m4 7 8 6 8-6' />
                  </svg>
                </div>
                <h3 className='mt-5 text-xs font-bold tracking-[0.18em] text-[#70837E] uppercase'>
                  {copy.emailLabel}
                </h3>
                <div className='mt-3 flex flex-col items-start gap-1 text-sm leading-7 font-semibold'>
                  <a
                    href='mailto:info@laxsik.com'
                    className='break-all text-[#1673C9] transition hover:text-[#0D5653]'>
                    info@laxsik.com
                  </a>
                  <a
                    href='mailto:laxsikcustomercare@gmail.com'
                    className='break-all text-[#1673C9] transition hover:text-[#0D5653]'>
                    laxsikcustomercare@gmail.com
                  </a>
                </div>
              </article>
            </div>
          </div>

          <p className='mx-auto mt-10 max-w-2xl text-center text-sm leading-7 text-[#667A75]'>
            {copy.responseNote}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
