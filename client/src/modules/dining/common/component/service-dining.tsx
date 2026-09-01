import Image from 'next/image';

type TServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type ServiceDiningProps = {
  title?: string;
  services?: TServiceItem[];
  className?: string;
};

export function ServiceDining({
  title = 'SERVICES',
  services = [],
  className = '',
}: ServiceDiningProps) {
  return (
    <section
      className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* Background Wave Pattern */}
      {/* <div
        className='pointer-events-none absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' fill='none' stroke='%230D4949' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      /> */}

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Title */}
        {title && (
          <h2 className='font-lora mb-10 text-center text-[32px] font-semibold text-[#0D4949] uppercase md:mb-16'>
            {title}
          </h2>
        )}

        {/* Services Grid */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-x-12 md:gap-y-10 lg:gap-x-16'>
          {services.map((item, index) => {
            const isFirstRow = index < 3;

            return (
              <div
                key={item.id || index}
                className={`flex items-center gap-5 ${
                  isFirstRow
                    ? 'border-b border-[#D8D4C7] pb-8 md:border-b md:border-[#D8D4C7]'
                    : 'border-b border-[#D8D4C7] pb-8 md:border-b-0 md:pb-0'
                } ${index === services.length - 1 ? 'border-b-0 pb-0' : ''}`}>
                {/* Service Icon */}
                <div className='relative flex h-14 w-14 shrink-0 items-center justify-center md:h-16 md:w-16'>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={64}
                    height={64}
                    className='h-auto max-h-full w-auto max-w-full object-contain'
                  />
                </div>

                {/* Service Details */}
                <div className='flex flex-col gap-1'>
                  <h3 className='font-montserrat text-sm font-bold text-[#1A1A1A] uppercase md:text-base'>
                    {item.title}
                  </h3>
                  <p className='font-montserrat text-xs text-[#555555] md:text-sm'>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
          {services.length === 0 && (
            <p className='font-montserrat py-8 text-center text-sm text-[#68726F] md:col-span-3'>
              Chưa có dịch vụ Dining đang hoạt động.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
