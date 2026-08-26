import Image from 'next/image';

export type TServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type ServiceSpaProps = {
  title?: string;
  services?: TServiceItem[];
  className?: string;
};

export function ServiceSpa({
  title = 'SPA SERVICES',
  services = [],
  className = '',
}: ServiceSpaProps) {
  return (
    <section
      className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* Background */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage: "url('/images/background/bg-wave.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover',
        }}
      />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Title */}
        {title && (
          <h2 className='font-lora mb-10 text-center text-[28px] font-semibold text-[#0D4949] uppercase md:mb-12 md:text-[32px]'>
            {title}
          </h2>
        )}

        {/* Services */}
        <div className='grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3 lg:gap-x-16'>
          {services.map((item, index) => {
            const isFirstRow = index < 3;

            return (
              <div
                key={item.id}
                className={`flex items-center gap-5 ${
                  isFirstRow ? 'border-b border-[#D8D4C7] pb-8' : 'pb-0'
                }`}>
                {/* Icon */}
                <div className='relative flex h-14 w-14 shrink-0 items-center justify-center md:h-16 md:w-16'>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={64}
                    height={64}
                    className='h-auto max-h-full w-auto max-w-full object-contain'
                  />
                </div>

                {/* Content */}
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
              Chưa có dịch vụ Spa đang hoạt động.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
