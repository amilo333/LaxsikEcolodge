const BOOKING_STEPS = [
  { number: 1, label: 'Your plan' },
  { number: 2, label: 'Confirm your plan' },
  { number: 3, label: 'Finish booking' },
];

export function BookingProgress() {
  return (
    <div className='border-b border-[#0D4949]/10 bg-white/95'>
      <ol
        aria-label='Booking progress'
        className='mx-auto flex h-[76px] max-w-[840px] items-center px-5'>
        {BOOKING_STEPS.map((step, index) => (
          <li
            key={step.number}
            aria-current={step.number === 1 ? 'step' : undefined}
            className='flex min-w-0 flex-1 items-center last:flex-none'>
            <div className='flex shrink-0 items-center gap-2.5'>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step.number === 1
                    ? 'bg-[#0D4949] text-white'
                    : 'bg-[#EEF1F0] text-[#242424]'
                }`}>
                {step.number}
              </span>
              <span className='hidden text-xs font-semibold whitespace-nowrap sm:inline'>
                {step.label}
              </span>
            </div>

            {index < BOOKING_STEPS.length - 1 && (
              <span
                aria-hidden='true'
                className='mx-3 h-px min-w-4 flex-1 bg-[#DCE2E0] sm:mx-7'
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
