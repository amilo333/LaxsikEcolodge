'use client';

import Image from 'next/image';
import { useEffect, useId, useRef } from 'react';

export type TAdminDetailField = {
  label: string;
  value: string | number | null | undefined;
};

type TAdminItemDetailDialogProps = {
  category: string;
  title: string;
  image?: string;
  images?: string[];
  description?: string;
  fields: TAdminDetailField[];
  highlights?: string[];
  onClose: () => void;
};

export function AdminItemDetailDialog({
  category,
  title,
  image,
  images = [],
  description,
  fields,
  highlights = [],
  onClose,
}: TAdminItemDetailDialogProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  const gallery = images.filter((url) => url && url !== image);

  return (
    <div
      role='presentation'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#052D2D]/70 p-3 backdrop-blur-sm sm:p-5'>
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[20px] bg-[#F8FAF9] shadow-[0_30px_100px_rgba(0,0,0,0.3)]'>
        <header className='sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#DDE7E3] bg-white/95 px-5 py-4 backdrop-blur sm:px-7'>
          <div className='min-w-0'>
            <p className='text-[10px] font-extrabold tracking-[0.12em] text-[#71837D] uppercase'>
              Chi tiết {category}
            </p>
            <h2
              id={titleId}
              className='mt-1 font-[family-name:var(--font-lora)] text-xl font-bold text-[#0D4949] sm:text-2xl'>
              {title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            aria-label={`Đóng chi tiết ${category}`}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDF3F1] text-xl text-[#3A5A55] hover:bg-[#DFEAE6]'>
            ×
          </button>
        </header>

        <div className='space-y-6 p-5 sm:p-7'>
          {image && (
            <div className='relative h-52 overflow-hidden rounded-2xl bg-[#E7EEEB] sm:h-72'>
              <Image
                src={image}
                alt={title}
                fill
                sizes='(max-width: 768px) 100vw, 760px'
                className='object-cover'
              />
            </div>
          )}

          <dl className='grid gap-3 sm:grid-cols-2'>
            {fields.map(({ label, value }) => (
              <div
                key={label}
                className='rounded-xl border border-[#E1E9E6] bg-white px-4 py-3'>
                <dt className='text-[10px] font-bold text-[#788782]'>
                  {label}
                </dt>
                <dd className='mt-1 text-sm font-semibold break-words text-[#173F3D]'>
                  {value === null || value === undefined || value === ''
                    ? '—'
                    : value}
                </dd>
              </div>
            ))}
          </dl>

          {description && (
            <section>
              <h3 className='text-xs font-extrabold text-[#173F3D]'>Mô tả</h3>
              <p className='mt-2 text-sm leading-6 whitespace-pre-line text-[#52635F]'>
                {description}
              </p>
            </section>
          )}

          {highlights.length > 0 && (
            <section>
              <h3 className='text-xs font-extrabold text-[#173F3D]'>
                Điểm nổi bật
              </h3>
              <ul className='mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#52635F]'>
                {highlights.map((highlight, index) => (
                  <li key={`${highlight}-${index}`}>{highlight}</li>
                ))}
              </ul>
            </section>
          )}

          {gallery.length > 0 && (
            <section>
              <h3 className='text-xs font-extrabold text-[#173F3D]'>
                Hình ảnh
              </h3>
              <div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {gallery.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className='relative aspect-[4/3] overflow-hidden rounded-xl bg-[#E7EEEB]'>
                    <Image
                      src={url}
                      alt={`${title} ${index + 1}`}
                      fill
                      sizes='(max-width: 640px) 45vw, 230px'
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
