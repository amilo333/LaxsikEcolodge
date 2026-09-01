'use client';

import { Footer, Header } from '@/components/layouts';
import Image from 'next/image';
import { useTourListApi } from './hooks';

const TRAVEL_NOTES = [
  {
    number: '01',
    title: 'Season-led routes',
    description:
      'Paths and views change with the rice season, rain and village activity, so every journey feels slightly different.',
  },
  {
    number: '02',
    title: 'Local perspective',
    description:
      'Experiences are shaped around people, traditions and everyday life rather than a checklist of attractions.',
  },
  {
    number: '03',
    title: 'A comfortable pace',
    description:
      'There is time to stop, talk, take photographs and enjoy the landscape without rushing from place to place.',
  },
] as const;

const PRACTICAL_NOTES = [
  'Wear shoes with reliable grip for terrace and village paths.',
  'Bring a light rain layer; mountain weather can change quickly.',
  'Ask before photographing people, homes or ceremonies.',
  'Routes may be adjusted to suit weather and trail conditions.',
] as const;

export function ToursModule() {
  const toursQuery = useTourListApi();
  const tours = toursQuery.data?.data ?? [];

  return (
    <div className="min-h-screen bg-[url('/images/bg-screen.jpg')] bg-[length:720px_720px] text-[#163E3B]">
      <main>
        <section className='relative min-h-[640px] overflow-hidden sm:min-h-[700px] lg:min-h-[780px]'>
          <Image
            src='/images/slider1.png'
            alt='Muong Hoa Valley rice terraces surrounded by mountains'
            fill
            priority
            sizes='100vw'
            className='object-cover object-center'
          />
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(3,37,36,0.62)_0%,rgba(3,37,36,0.12)_45%,rgba(3,37,36,0.72)_100%)]' />

          <div className='absolute inset-x-0 top-0 z-30'>
            <Header />
          </div>

          <div className='relative z-10 mx-auto flex min-h-[640px] max-w-6xl flex-col items-center justify-end px-5 pb-32 text-center text-white sm:min-h-[700px] sm:pb-36 lg:min-h-[780px] lg:pb-44'>
            <p className='text-xs font-bold tracking-[0.28em] text-white/80 uppercase sm:text-sm'>
              Journeys from Laxsik
            </p>
            <h1 className='font-lora mt-5 max-w-4xl text-4xl leading-[1.08] font-semibold text-balance sm:text-6xl lg:text-7xl'>
              Discover Sa Pa, one story at a time
            </h1>
            <p className='mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8'>
              Walk beyond the familiar views and spend time with the landscapes,
              traditions and people that give Muong Hoa Valley its rhythm.
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
              Ways to explore
            </p>
            <h2 className='font-lora mt-4 text-3xl font-semibold text-[#0D5653] sm:text-5xl'>
              Journeys shaped by the valley
            </h2>
            <p className='mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#60746F] sm:text-base sm:leading-8'>
              From a gentle village stroll to a full-day highland challenge,
              these routes reveal Sa Pa through forest paths, waterfalls, rice
              terraces and local communities.
            </p>
          </div>

          <div className='mx-auto mt-14 flex max-w-6xl flex-col gap-8 sm:mt-18 lg:gap-12'>
            {toursQuery.isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  aria-hidden='true'
                  className='grid animate-pulse overflow-hidden rounded-[28px] border border-[#DDE6E1] bg-white lg:grid-cols-2'>
                  <div className='min-h-[340px] bg-[#DDE8E4] sm:min-h-[440px] lg:min-h-[560px]' />
                  <div className='space-y-5 px-7 py-10 sm:px-12 sm:py-14 lg:px-16'>
                    <div className='h-14 w-14 rounded-2xl bg-[#E7EFEC]' />
                    <div className='h-9 w-3/4 rounded bg-[#E7EFEC]' />
                    <div className='h-24 rounded bg-[#EEF3F1]' />
                    <div className='h-20 rounded-2xl bg-[#EEF3F1]' />
                  </div>
                </div>
              ))}

            {toursQuery.isError && (
              <div className='rounded-[24px] border border-[#E7D8D8] bg-white px-6 py-12 text-center'>
                <p className='text-sm font-semibold text-[#8A4040]'>
                  We could not load the journeys right now.
                </p>
                <button
                  type='button'
                  onClick={() => void toursQuery.refetch()}
                  className='mt-5 rounded-full bg-[#0D4949] px-6 py-3 text-xs font-bold text-white'>
                  Try again
                </button>
              </div>
            )}

            {!toursQuery.isLoading &&
              !toursQuery.isError &&
              tours.length === 0 && (
                <div className='rounded-[24px] border border-[#DDE6E1] bg-white px-6 py-12 text-center text-sm leading-7 text-[#60746F]'>
                  New seasonal journeys are being prepared. Please ask our local
                  team for the best routes during your stay.
                </div>
              )}

            {tours.map((tour, index) => (
              <article
                key={tour._id}
                className='grid overflow-hidden rounded-[28px] border border-[#DDE6E1] bg-white shadow-[0_22px_70px_rgba(23,66,62,0.08)] lg:grid-cols-2'>
                <div
                  className={`relative min-h-[340px] sm:min-h-[440px] lg:min-h-[560px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Image
                    src={tour.thumbnail}
                    alt={tour.title}
                    fill
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes='(max-width: 1024px) 100vw, 50vw'
                    className='object-cover transition duration-700 hover:scale-[1.03]'
                  />
                  <div className='absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(4,44,42,0.32)_100%)]' />
                  <span className='absolute right-5 bottom-5 rounded-full border border-white/35 bg-[#0D4949]/75 px-4 py-2 text-[11px] font-bold tracking-[0.12em] text-white uppercase backdrop-blur-sm'>
                    {tour.eyebrow}
                  </span>
                </div>

                <div
                  className={`flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14 lg:px-16 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Image
                    src='/images/icon/ic_hiking.png'
                    alt=''
                    width={64}
                    height={64}
                    className='h-14 w-14 object-contain'
                  />
                  <h3 className='font-lora mt-6 text-3xl font-semibold text-[#103F3C] sm:text-4xl'>
                    {tour.title}
                  </h3>
                  <p className='mt-5 text-sm leading-7 text-[#60746F] sm:text-base sm:leading-8'>
                    {tour.description}
                  </p>

                  <dl className='mt-8 grid grid-cols-2 gap-3'>
                    <div className='rounded-2xl bg-[#EEF3F0] px-4 py-4'>
                      <dt className='text-[10px] font-bold tracking-[0.18em] text-[#70837E] uppercase'>
                        Duration
                      </dt>
                      <dd className='mt-2 text-sm font-semibold text-[#164B47]'>
                        {tour.duration}
                      </dd>
                    </div>
                    <div className='rounded-2xl bg-[#EEF3F0] px-4 py-4'>
                      <dt className='text-[10px] font-bold tracking-[0.18em] text-[#70837E] uppercase'>
                        Rhythm
                      </dt>
                      <dd className='mt-2 text-sm font-semibold text-[#164B47]'>
                        {tour.rhythm}
                      </dd>
                    </div>
                  </dl>

                  <ul className='mt-8 space-y-3 border-t border-[#E0E8E4] pt-7'>
                    {tour.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className='flex items-center gap-3 text-sm text-[#385B57]'>
                        <span
                          aria-hidden='true'
                          className='h-1.5 w-1.5 shrink-0 rounded-full bg-[#B68A4A]'
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className='px-5 py-20 sm:px-8 sm:py-24 lg:py-32'>
          <div className='mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20'>
            <div className='lg:sticky lg:top-10'>
              <p className='text-xs font-bold tracking-[0.2em] text-[#70837E] uppercase'>
                Travel slowly
              </p>
              <h2 className='font-lora mt-4 text-3xl font-semibold text-[#0D5653] sm:text-5xl'>
                A closer way to meet Sa Pa
              </h2>
              <p className='mt-6 text-sm leading-7 text-[#60746F] sm:text-base sm:leading-8'>
                The most memorable moments are often unscheduled: a conversation
                beside a field, tea shared in a family home or mist lifting from
                the terraces.
              </p>
            </div>

            <div className='divide-y divide-[#DDE6E1] border-y border-[#DDE6E1]'>
              {TRAVEL_NOTES.map((note) => (
                <article
                  key={note.number}
                  className='grid gap-4 py-8 sm:grid-cols-[72px_1fr] sm:py-10'>
                  <span className='font-lora text-2xl text-[#B68A4A]'>
                    {note.number}
                  </span>
                  <div>
                    <h3 className='font-lora text-2xl font-semibold text-[#163E3B]'>
                      {note.title}
                    </h3>
                    <p className='mt-3 text-sm leading-7 text-[#60746F]'>
                      {note.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className='px-5 py-20 sm:px-8 sm:py-24'>
          <div className='mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#0D4949] text-white'>
            <div className='grid lg:grid-cols-[1.05fr_0.95fr]'>
              <div className='px-7 py-12 sm:px-12 sm:py-16 lg:px-16'>
                <p className='text-xs font-bold tracking-[0.2em] text-white/60 uppercase'>
                  Before you set out
                </p>
                <h2 className='font-lora mt-4 text-3xl font-semibold sm:text-4xl'>
                  A few useful notes
                </h2>
                <ul className='mt-8 space-y-5'>
                  {PRACTICAL_NOTES.map((note) => (
                    <li
                      key={note}
                      className='flex gap-4 text-sm leading-7 text-white/78'>
                      <span
                        aria-hidden='true'
                        className='mt-3 h-px w-6 shrink-0 bg-[#D7B47A]'
                      />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='relative min-h-[340px] lg:min-h-full'>
                <Image
                  src='/images/slider2.png'
                  alt='Rice terraces and villages across Muong Hoa Valley'
                  fill
                  sizes='(max-width: 1024px) 100vw, 45vw'
                  className='object-cover'
                />
              </div>
            </div>
          </div>

          <p className='mx-auto mt-10 max-w-2xl text-center text-sm leading-7 text-[#6B7D78]'>
            Routes are introductions rather than fixed itineraries. Our local
            team can share the most suitable seasonal options during your stay.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
