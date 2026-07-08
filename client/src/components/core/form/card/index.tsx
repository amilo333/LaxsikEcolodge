import { Button, Card as HeroCard } from '@heroui/react';
import { TCardProps } from './type';

export default function Card(props: TCardProps) {
  const { className = '', imageSrc, title, description } = props;

  return (
    <HeroCard className='w-full rounded-none p-0'>
      <div className='relative h-[340px] w-full shrink-0 overflow-hidden'>
        <img
          alt='Room'
          className='pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none'
          loading='lazy'
          src={imageSrc}
        />
      </div>
      <div className='flex flex-col gap-3 px-[16px] pb-[16px]'>
        <HeroCard.Header className='items-center gap-1'>
          <HeroCard.Title className='pr-8 font-bold'>{title}</HeroCard.Title>
          <HeroCard.Description className='text-center'>
            {description}
          </HeroCard.Description>
        </HeroCard.Header>
        <HeroCard.Footer className='flex w-full flex-col items-center gap-3'>
          <Button className='w-full rounded-none bg-[#0D4949]'>EXPLORE</Button>
        </HeroCard.Footer>
      </div>
    </HeroCard>
  );
}
