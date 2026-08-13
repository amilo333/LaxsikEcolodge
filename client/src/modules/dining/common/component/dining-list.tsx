import Image from 'next/image';

export type TDiningItem = {
  id: string;
  title: string;
  description: string;
  bigImage: string;
  smallImage: string;
};

const DEFAULT_DINING_LIST: TDiningItem[] = [
  {
    id: '1',
    title: 'ROMANCE DINING',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu dui lacus. Praesent at euismod neque. Vestibulum gravida et felis eget finibus. Ut nec mollis justo. Ut non ipsum id eros pharetra aliquet eget nec dolor. Sed ac nunc a dolor posuere facilisis. Donec blandit mattis ultrices. In vel posuere leo.',
    smallImage: '/images/dinning/dinning-even-small.png',
    bigImage: '/images/dinning/dinning-even-big.png',
  },
  {
    id: '2',
    title: "H'MONG FLAVOR",
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu dui lacus. Praesent at euismod neque. Vestibulum gravida et felis eget finibus. Ut nec mollis justo. Ut non ipsum id eros pharetra aliquet eget nec dolor. Sed ac nunc a dolor posuere facilisis. Donec blandit mattis ultrices. In vel posuere leo.',
    bigImage: '/images/dinning/dinning-odd-big.png',
    smallImage: '/images/dinning/dinning-odd-small.png',
  },
  {
    id: '3',
    title: "H'MONG FLAVOR",
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu dui lacus. Praesent at euismod neque. Vestibulum gravida et felis eget finibus. Ut nec mollis justo. Ut non ipsum id eros pharetra aliquet eget nec dolor. Sed ac nunc a dolor posuere facilisis. Donec blandit mattis ultrices. In vel posuere leo.',
    bigImage: '/images/dinning/dinning-odd-big.png',
    smallImage: '/images/dinning/dinning-odd-small.png',
  },
];

type DiningListProps = {
  data?: TDiningItem[];
  className?: string;
};

export function DiningList({
  data = DEFAULT_DINING_LIST,
  className = '',
}: DiningListProps) {
  return (
    <section className={`w-full py-12 select-none md:py-20 ${className}`}>
      <div className='mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 md:gap-24 lg:px-8'>
        {data.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id || index}
              className={`flex items-center justify-between gap-10 lg:gap-16 ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}>
              {/* Text Content */}
              <div className='flex flex-col items-start gap-4 lg:w-5/12'>
                <h2 className='font-lora text-2xl font-bold tracking-wider text-[#0D4949] uppercase md:text-3xl lg:text-[32px]'>
                  {item.title}
                </h2>
                <div className='h-[2px] w-16 bg-[#0D4949]' />
                <p className='font-montserrat text-sm leading-relaxed text-[#555555] md:text-base'>
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
                    src={isEven ? item.smallImage : item.bigImage}
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
                    src={isEven ? item.bigImage : item.smallImage}
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
