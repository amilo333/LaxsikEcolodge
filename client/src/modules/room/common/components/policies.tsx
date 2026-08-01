import Image from 'next/image';
import { POLICIES } from '../constants/policies';

export function Policies() {
  return (
    <section className='m-h-[480px] bg-[#F9F6F1] py-15'>
      <div className='mx-auto flex max-w-6xl gap-16 px-6'>
        {/* Left */}
        <div className='w-60 shrink-0 py-[32px]'>
          <h2 className='font-times text-[32px] font-semibold text-[#0D4949] uppercase'>
            Policies
          </h2>
        </div>

        {/* Right */}
        <div className='flex-1'>
          {POLICIES.map((item, index) => (
            <div
              key={item.id}
              className={`flex gap-8 py-8 ${
                index !== POLICIES.length - 1 ? 'border-b border-[#D8D8D8]' : ''
              }`}>
              {/* Icon */}
              <div className='w-12 shrink-0'>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={36}
                  height={36}
                  className='h-9 w-9'
                />
              </div>

              {/* Content */}
              <div>
                <h3 className='mb-2 text-lg font-semibold text-black uppercase'>
                  {item.title}
                </h3>

                <p className='leading-7 text-black'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
