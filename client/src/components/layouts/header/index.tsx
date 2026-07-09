'use client';
import { useState } from 'react';
import { BookingBar, Navbar } from './components';

export function Header() {
  const [isShowBookingBar, setIsShowBookingBar] = useState(false);

  return (
    <div className='relative'>
      <Navbar onClickFind={() => setIsShowBookingBar(true)} />
      {isShowBookingBar && (
        <BookingBar onClickHide={() => setIsShowBookingBar(false)} />
      )}
    </div>
  );
}
