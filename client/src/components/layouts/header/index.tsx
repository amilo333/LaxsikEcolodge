'use client';
import { useState } from 'react';
import { BookingBar, Navbar } from './components';

export function Header() {
  const [isShowBookingBar, setIsShowBookingBar] = useState(false);

  return (
    <header className='relative z-50 overflow-visible'>
      <Navbar
        isBookingBarVisible={isShowBookingBar}
        onClickFind={() => setIsShowBookingBar(true)}
      />
      {isShowBookingBar && (
        <BookingBar onClickHide={() => setIsShowBookingBar(false)} />
      )}
    </header>
  );
}
