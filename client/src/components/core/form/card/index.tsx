import { Button, Card as HeroCard } from '@heroui/react';
import { TCardProps } from './type';
import clsx from 'clsx';

export default function Card(props: TCardProps) {
  const { className = '', imageSrc, title, description } = props;

  return (
    <HeroCard className={clsx('w-full rounded-none p-0', className)}>
      <div className='relative h-[55%] w-full shrink-0 overflow-hidden'>
        <img
          alt='Room'
          className='pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none'
          loading='lazy'
          src={imageSrc}
        />
      </div>
      <div className='flex flex-col items-center px-[24px] py-[32px]'>
        <HeroCard.Header className='h-40.5 w-104 items-center gap-4'>
          <HeroCard.Title className='text-[24px] font-bold'>
            {title}
          </HeroCard.Title>
          <HeroCard.Description className='text-center text-[17px]'>
            {description}
          </HeroCard.Description>
        </HeroCard.Header>
        <HeroCard.Footer className='flex w-full flex-col items-center'>
          <Button className='h-[46px] w-[416px] rounded-none bg-[#0D4949]'>
            EXPLORE
          </Button>
        </HeroCard.Footer>
      </div>
    </HeroCard>
  );
}
