'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type TAdminSelectOption<TValue extends string | number> = {
  value: TValue;
  label: string;
  description?: string;
  dotClass?: string;
};

type TAdminSelectProps<TValue extends string | number> = {
  value: TValue;
  options: Array<TAdminSelectOption<TValue>>;
  onChange: (value: TValue) => void;
  ariaLabel: string;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  placement?: 'top' | 'bottom';
  rounded?: 'pill' | 'soft';
  className?: string;
};

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox='0 0 20 20'
      aria-hidden='true'
      className={`h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-200 ${
        isOpen ? 'rotate-180' : ''
      }`}>
      <path d='m5.5 7.5 4.5 4.5 4.5-4.5' strokeLinecap='round' />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox='0 0 20 20'
      aria-hidden='true'
      className='h-4 w-4 fill-none stroke-current stroke-2'>
      <path d='m4.5 10 3.2 3.2 7.8-7.5' strokeLinecap='round' />
    </svg>
  );
}

export function AdminSelect<TValue extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
  leadingIcon,
  placement = 'bottom',
  rounded = 'soft',
  className = '',
}: TAdminSelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type='button'
        aria-label={ariaLabel}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={`group flex h-11 w-full items-center gap-2.5 border bg-white px-3.5 text-left shadow-[0_5px_16px_rgba(13,73,73,0.05)] transition outline-none ${
          rounded === 'pill' ? 'rounded-full' : 'rounded-xl'
        } ${
          isOpen
            ? 'border-[#0D665A] ring-4 ring-[#0D665A]/10'
            : 'border-[#D7E3DF] hover:border-[#9CB9B1] hover:bg-[#FBFDFC]'
        } disabled:cursor-not-allowed disabled:opacity-55`}>
        {leadingIcon && (
          <span className='shrink-0 text-[#5E7771]'>{leadingIcon}</span>
        )}
        {selectedOption?.dotClass && (
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-current/10 ${selectedOption.dotClass}`}
          />
        )}
        <span className='min-w-0 flex-1'>
          <span className='block truncate text-xs font-extrabold text-[#274A46]'>
            {selectedOption?.label}
          </span>
          {selectedOption?.description && (
            <span className='mt-0.5 block truncate text-[9px] text-slate-400'>
              {selectedOption.description}
            </span>
          )}
        </span>
        <span className='shrink-0 text-[#6E817B] group-hover:text-[#0D665A]'>
          <ChevronDownIcon isOpen={isOpen} />
        </span>
      </button>

      {isOpen && !disabled && (
        <div
          id={listboxId}
          role='listbox'
          aria-label={ariaLabel}
          className={`absolute right-0 z-50 min-w-full overflow-hidden rounded-[14px] border border-[#D9E5E1] bg-white p-1.5 shadow-[0_20px_55px_rgba(7,55,53,0.2)] ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}>
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={String(option.value)}
                type='button'
                role='option'
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition ${
                  isSelected
                    ? 'bg-[#EAF3F0] text-[#0D665A]'
                    : 'text-slate-600 hover:bg-[#F4F7F6]'
                }`}>
                {option.dotClass && (
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${option.dotClass}`}
                  />
                )}
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-xs font-bold'>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className='mt-0.5 block truncate text-[9px] text-slate-400'>
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <span className='shrink-0 text-[#0D665A]'>
                    <CheckIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
