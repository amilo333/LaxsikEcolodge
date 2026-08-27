import Image from 'next/image';
import { POLICIES } from '../constants/policies';

export function Policies() {
  return (
    <section className='min-h-[480px] bg-[#F9F6F1] py-10 sm:py-15'>
      <div className='mx-auto flex max-w-6xl flex-col gap-2 px-5 lg:flex-row lg:gap-16 lg:px-6'>
        {/* Left */}
        <div className='shrink-0 pt-2 pb-3 lg:w-60 lg:py-[32px]'>
          <h2 className='font-times text-2xl font-semibold text-[#0D4949] uppercase sm:text-[32px]'>
            Policies
          </h2>
        </div>

        {/* Right */}
        <div className='flex-1'>
          {POLICIES.map((item, index) => (
            <div
              key={item.id}
              className={`flex gap-4 py-6 sm:gap-6 sm:py-8 ${
                index !== POLICIES.length - 1 ? 'border-b border-[#D8D8D8]' : ''
              }`}>
              {/* Icon */}
              <div className='w-9 shrink-0 sm:w-12'>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={36}
                  height={36}
                  className='h-8 w-8 object-contain sm:h-9 sm:w-9'
                />
              </div>

              {/* Content */}
              <div className='min-w-0'>
                <h3 className='mb-2 text-sm font-semibold text-black uppercase sm:text-base'>
                  {item.title}
                </h3>

                <p className='text-xs leading-6 text-black/80 sm:text-sm'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
