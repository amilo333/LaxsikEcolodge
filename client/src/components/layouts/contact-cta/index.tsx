import Link from 'next/link';
import type { TContactCtaProps } from './type';

export function ContactCta(props: TContactCtaProps) {
  const {
    title = 'We can help you with any questions or information.',
    phone = '+84 214 3892 999',
    phoneLabel = 'CALL',
    contactLabel = 'CONTACT',
    phoneHref = 'tel:+842143892999',
    contactHref = '/contact',
    className = '',
  } = props;

  return (
    <section
      className={`mx-auto my-30 flex h-30 w-[80%] max-w-[1600px] items-center rounded-full border border-white/10 bg-[#0D4949] px-3 py-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${className}`}>
      <div className='flex w-full items-center justify-around'>
        <div className='text-[18px] leading-[1.6] sm:text-[20px]'>{title}</div>

        <div className='flex gap-8'>
          <a
            href={phoneHref}
            className='font-Montserrat text-5 inline-flex min-w-[305px] items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white uppercase transition hover:bg-white/20 sm:text-base'>
            {phoneLabel} {phone}
          </a>

          <Link
            href={contactHref}
            className='text-5 font-Montserrat inline-flex min-w-[172px] items-center justify-center rounded-full border border-white bg-white px-6 py-3 font-semibold text-[#0D4949] uppercase transition hover:bg-[#F5F5F5]'>
            {contactLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
