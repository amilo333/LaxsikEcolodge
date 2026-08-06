import localFont from 'next/font/local';

export const lora = localFont({
  src: [
    {
      path: '../../public/fonts/Lora-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lora-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Lora-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});
