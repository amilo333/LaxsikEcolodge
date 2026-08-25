import { Button } from '@/components/core';

type TBookingAuthStateProps = {
  error?: boolean;
  onRetry?: () => void;
};

export function BookingAuthState({
  error = false,
  onRetry,
}: TBookingAuthStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[url('/images/bg-screen.jpg')] px-4 text-center text-[#0D4949]">
      <div className='rounded-[16px] bg-white px-8 py-7 font-semibold shadow-lg'>
        {error ? (
          <>
            <p>Unable to verify your account.</p>
            <Button
              onClick={onRetry}
              className='mt-3 h-10! w-auto! rounded-full! border border-[#0D4949]! bg-white! px-5! text-sm! text-[#0D4949]!'>
              Try again
            </Button>
          </>
        ) : (
          'Checking your account…'
        )}
      </div>
    </main>
  );
}
