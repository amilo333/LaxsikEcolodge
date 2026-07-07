import { BookingBar, Navbar } from './components';

export function Header() {
  return (
    <div className='relative'>
      <Navbar />
      <BookingBar />
    </div>
  );
}
