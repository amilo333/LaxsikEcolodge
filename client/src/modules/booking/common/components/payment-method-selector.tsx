import { TCheckoutPaymentMethod } from '../types';

const PAYMENT_METHODS: Array<{
  value: TCheckoutPaymentMethod;
  label: string;
  description: string;
}> = [
  {
    value: 'banking',
    label: 'Bank transfer',
    description: 'Complete the transfer using the booking reference.',
  },
  {
    value: 'vnpay',
    label: 'VNPAY',
    description: 'Pay through the VNPAY payment method.',
  },
];

type TPaymentMethodSelectorProps = {
  value: TCheckoutPaymentMethod;
  onChange: (value: TCheckoutPaymentMethod) => void;
  error?: string;
  isDisabled?: boolean;
};

export function PaymentMethodSelector({
  value,
  onChange,
  error,
  isDisabled = false,
}: TPaymentMethodSelectorProps) {
  return (
    <fieldset>
      <legend className='text-sm font-bold'>Payment method</legend>
      <div className='mt-3 grid gap-3 sm:grid-cols-2'>
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.value}
            className={`rounded-[16px] border p-4 transition ${
              isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            } ${
              value === method.value
                ? 'border-[#0D4949] bg-[#EEF5F3] ring-1 ring-[#0D4949]'
                : 'border-[#DCE4E1] bg-white hover:border-[#8EAAA2]'
            }`}>
            <span className='flex items-start gap-3'>
              <input
                type='radio'
                name='paymentMethod'
                value={method.value}
                checked={value === method.value}
                onChange={() => onChange(method.value)}
                disabled={isDisabled}
                className='mt-0.5 h-4 w-4 accent-[#0D4949]'
              />
              <span>
                <span className='block text-xs font-bold'>{method.label}</span>
                <span className='mt-1 block text-[10px] leading-4 text-[#68726E]'>
                  {method.description}
                </span>
              </span>
            </span>
          </label>
        ))}
      </div>
      {error && <p className='mt-2 text-xs text-[#B33939]'>{error}</p>}
    </fieldset>
  );
}
