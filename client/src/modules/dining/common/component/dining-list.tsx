import Image from 'next/image';

type TDiningItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
};

type DiningListProps = {
  dining?: TDiningItem[];
  className?: string;
};

export function DiningList(props: DiningListProps) {
  const { dining = [], className = '' } = props;

  return (
    <section className={`w-full py-10 select-none md:py-10 ${className}`}>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 sm:px-6 md:gap-24 lg:px-8'>
        {dining.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id || index}
              className={`flex flex-col items-center justify-between gap-8 lg:gap-16 ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
              {/* Text Content */}
              <div className='flex w-full flex-col items-start gap-4 lg:w-5/12'>
                <h2 className='font-lora text-2xl font-bold text-[#0D4949] uppercase sm:text-[32px]'>
                  {item.title}
                </h2>
                <div className='h-[2px] w-16 bg-[#0D4949]' />
                <p className='font-montserrat text-base leading-7 text-[#555555] sm:text-lg'>
                  {item.description}
                </p>
              </div>

              {/* Images Container */}
              <div className='grid w-full grid-cols-2 items-center gap-3 sm:gap-5 lg:w-6/12'>
                {/* Left/First Image */}
                <div
                  className={`relative overflow-hidden ${
                    isEven
                      ? 'aspect-[3/4] w-full'
                      : 'mt-8 aspect-[3/4] w-full sm:mt-12'
                  }`}>
                  <Image
                    src={isEven ? item.images[0] : item.thumbnail}
                    alt={item.title}
                    fill
                    className='object-cover shadow-md'
                    sizes='(max-width: 768px) 50vw, 300px'
                  />
                </div>

                {/* Right/Second Image */}
                <div
                  className={`relative overflow-hidden ${
                    isEven
                      ? 'mt-8 aspect-[3/4] w-full sm:mt-12'
                      : 'aspect-[3/4] w-full'
                  }`}>
                  <Image
                    src={isEven ? item.thumbnail : item.images[0]}
                    alt={item.title}
                    fill
                    className='object-cover shadow-md'
                    sizes='(max-width: 768px) 50vw, 300px'
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
