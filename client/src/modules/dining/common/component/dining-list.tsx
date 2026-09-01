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
      <div className='mx-auto flex w-[90%] max-w-7xl flex-col gap-16 px-4 sm:px-6 md:gap-24 lg:px-8'>
        {dining.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id || index}
              className={`flex items-center justify-between gap-10 lg:gap-16 ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
              {/* Text Content */}
              <div className='flex flex-col items-start gap-4 lg:w-5/12'>
                <h2 className='font-lora text-[32px] font-bold text-[#0D4949] uppercase'>
                  {item.title}
                </h2>
                <div className='h-[2px] w-16 bg-[#0D4949]' />
                <p className='font-montserrat text-[20px] leading-relaxed text-[#555555]'>
                  {item.description}
                </p>
              </div>

              {/* Images Container */}
              <div className='flex items-center justify-center gap-4 sm:gap-6 lg:w-6/12'>
                {/* Left/First Image */}
                <div
                  className={`relative overflow-hidden ${
                    isEven
                      ? 'h-[280px] w-[170px] sm:h-[360px] sm:w-[220px] md:h-[400px] md:w-[250px]'
                      : 'h-[340px] w-[200px] sm:h-[440px] sm:w-[270px] md:h-[490px] md:w-[300px]'
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
                      ? 'h-[340px] w-[200px] sm:h-[440px] sm:w-[270px] md:h-[490px] md:w-[300px]'
                      : 'h-[280px] w-[170px] sm:h-[360px] sm:w-[220px] md:h-[400px] md:w-[250px]'
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
