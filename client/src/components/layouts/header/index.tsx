import React from 'react';
import Navbar from './Navbar';
import BookingBar from './BookingBar';

export default function Header() {
  return (
    <div className='relative'>
      <Navbar />
      <BookingBar />
    </div>
  );
}
