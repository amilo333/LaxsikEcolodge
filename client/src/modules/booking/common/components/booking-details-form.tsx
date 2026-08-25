'use client';

import { Button, Field, Textarea, Textfield } from '@/components/core';
import { TUser } from '@/modules/auth/common';
import {
  getPaymentErrorMessage,
  useStartVnpayPayment,
} from '@/modules/payment/common';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateBookingApi } from '../hooks';
import { bookingDetailsSchema } from '../schemas';
import { useBookingStore } from '../stores';
import {
  TAvailableRoom,
  TBookingDetailsForm,
  TCreateBookingPayload,
} from '../types';
import { PaymentMethodSelector } from './payment-method-selector';

type TBookingDetailsFormProps = {
  profile: TUser;
  rooms: TAvailableRoom[];
  checkInDate: string;
  checkOutDate: string;
  onBack: () => void;
  onBookingCreated: (bookingId: string) => void;
};

const getBookingErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'Unable to create your booking.';
  }

  return 'Unable to create your booking.';
};

export function BookingDetailsForm({
  profile,
  rooms,
  checkInDate,
  checkOutDate,
  onBack,
  onBookingCreated,
}: TBookingDetailsFormProps) {
  const quantities = useBookingStore((state) => state.quantities);
  const appliedVoucher = useBookingStore((state) => state.appliedVoucher);
  const savedCustomerInfo = useBookingStore((state) => state.customerInfo);
  const savedPaymentMethod = useBookingStore((state) => state.paymentMethod);
  const setBookingDetails = useBookingStore((state) => state.setBookingDetails);
  const setCreatedBookingId = useBookingStore(
    (state) => state.setCreatedBookingId
  );
  const createBooking = useCreateBookingApi();
  const vnpayPayment = useStartVnpayPayment();
  const [paymentRetryBookingId, setPaymentRetryBookingId] = useState<
    string | null
  >(null);
  const [paymentError, setPaymentError] = useState('');
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TBookingDetailsForm>({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: {
      fullNameContact: savedCustomerInfo?.fullNameContact ?? profile.full_name,
      emailContact: savedCustomerInfo?.emailContact ?? profile.email,
      phoneContact: savedCustomerInfo?.phoneContact ?? profile.phone,
      note: savedCustomerInfo?.note ?? '',
      paymentMethod: savedPaymentMethod,
      acceptTerms: false,
    },
  });

  const onSubmit = async (form: TBookingDetailsForm) => {
    setPaymentError('');

    if (paymentRetryBookingId) {
      try {
        await vnpayPayment.startPayment(paymentRetryBookingId);
      } catch (error) {
        setPaymentError(getPaymentErrorMessage(error));
      }

      return;
    }

    const bookingItems = rooms
      .map((room) => ({
        roomId: room._id,
        quantity: quantities[room._id] ?? 0,
      }))
      .filter((item) => item.quantity > 0);
    const customerInfo = {
      fullNameContact: form.fullNameContact.trim(),
      phoneContact: form.phoneContact.trim(),
      emailContact: form.emailContact.trim(),
      note: form.note.trim(),
    };
    const payload: TCreateBookingPayload = {
      bookingItems,
      checkInDate,
      checkOutDate,
      ...(appliedVoucher ? { voucherCode: appliedVoucher.code } : {}),
      paymentMethod: form.paymentMethod,
      customerInfo,
    };

    setBookingDetails(customerInfo, form.paymentMethod);
    let booking;

    try {
      booking = await createBooking.mutateAsync(payload);
    } catch {
      return;
    }

    setCreatedBookingId(booking._id);

    if (form.paymentMethod === 'vnpay') {
      setPaymentRetryBookingId(booking._id);

      try {
        await vnpayPayment.startPayment(booking._id);
      } catch (error) {
        setPaymentError(getPaymentErrorMessage(error));
      }

      return;
    }

    onBookingCreated(booking._id);
  };

  const isSubmitting = createBooking.isPending || vnpayPayment.isPending;

  return (
    <div>
      <div>
        <p className='text-[11px] font-bold text-[#0D4949]/60 uppercase'>
          Step 2 of 3
        </p>
        <h1 className='mt-1 text-xl font-bold uppercase sm:text-2xl'>
          Enter your details
        </h1>
        <p className='mt-2 text-xs leading-5 text-[#68726E]'>
          Your account information is loaded from your profile. You can update
          the contact details for this booking below.
        </p>
      </div>

      <div className='mt-6 grid gap-5 sm:grid-cols-2'>
        <Field
          control={control}
          name='fullNameContact'
          label='Full name'
          required>
          <Textfield
            label='Full name'
            placeholder='Guest full name'
            autoComplete='name'
            inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.fullNameContact?.message}
          />
        </Field>

        <Field
          control={control}
          name='emailContact'
          label='Email address'
          required>
          <Textfield
            label='Email address'
            type='email'
            placeholder='you@example.com'
            autoComplete='email'
            inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
            error={errors.emailContact?.message}
          />
        </Field>

        <div className='sm:col-span-2'>
          <Field
            control={control}
            name='phoneContact'
            label='Telephone'
            required>
            <Textfield
              label='Telephone'
              type='tel'
              placeholder='Your phone number'
              autoComplete='tel'
              inputClassName='h-[50px]! rounded-[16px]! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_input]:px-4!'
              error={errors.phoneContact?.message}
            />
          </Field>
        </div>

        <div className='sm:col-span-2'>
          <Field control={control} name='note' label='Special requests'>
            <Textarea
              label='Special requests'
              placeholder='Tell us about any requests for your stay'
              inputClassName='h-32! rounded-[16px]! border-0! bg-[#F7F9F8]! shadow-none! ring-1 ring-[#DDE6E3] focus-within:ring-2 focus-within:ring-[#0D4949]/45 [&_textarea]:px-4! [&_textarea]:py-3!'
              error={errors.note?.message}
            />
          </Field>
        </div>
      </div>

      <div className='mt-7 border-t border-[#E3E9E7] pt-6'>
        <Field control={control} name='paymentMethod'>
          {({ field }) => (
            <PaymentMethodSelector
              value={field?.value ?? 'banking'}
              onChange={(value) => field?.onChange(value)}
              error={errors.paymentMethod?.message}
              isDisabled={isSubmitting || Boolean(paymentRetryBookingId)}
            />
          )}
        </Field>
      </div>

      <label className='mt-6 flex cursor-pointer items-start gap-3 rounded-[16px] bg-[#F5F7F6] p-4 text-xs leading-5'>
        <input
          type='checkbox'
          {...register('acceptTerms')}
          className='mt-0.5 h-4 w-4 shrink-0 accent-[#0D4949]'
        />
        <span>
          I have read and accept the Terms &amp; Conditions and consent to the
          processing of my booking information.
        </span>
      </label>
      {errors.acceptTerms && (
        <p className='mt-2 text-xs text-[#B33939]' role='alert'>
          {errors.acceptTerms.message}
        </p>
      )}

      {createBooking.isError && (
        <p
          className='mt-4 rounded-[16px] bg-[#FFF0F0] px-4 py-3 text-xs font-medium text-[#B33939]'
          role='alert'>
          {getBookingErrorMessage(createBooking.error)}
        </p>
      )}

      {paymentError && (
        <div
          className='mt-4 rounded-[16px] border border-[#E7B8B8] bg-[#FFF0F0] px-4 py-3 text-xs text-[#8F2F2F]'
          role='alert'>
          <p className='font-bold'>Your booking was created.</p>
          <p className='mt-1'>{paymentError}</p>
          <p className='mt-1'>Retrying will not create another booking.</p>
        </div>
      )}

      <div className='mt-7 flex flex-col-reverse justify-end gap-3 border-t border-[#E3E9E7] pt-6 sm:flex-row'>
        <Button
          onClick={() =>
            paymentRetryBookingId
              ? onBookingCreated(paymentRetryBookingId)
              : onBack()
          }
          isDisabled={isSubmitting}
          className='h-12! w-auto! min-w-[130px]! rounded-full! border border-[#0D4949]! bg-white! px-7! text-sm! text-[#0D4949]!'>
          {paymentRetryBookingId ? 'View booking' : 'Back'}
        </Button>
        <Button
          type='submit'
          isDisabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className='h-12! w-auto! min-w-[190px]! rounded-full! px-8! text-sm! uppercase'>
          {createBooking.isPending
            ? 'Creating booking…'
            : vnpayPayment.isPending
              ? 'Opening VNPAY…'
              : paymentRetryBookingId
                ? 'Retry payment'
                : 'Confirm & book'}
        </Button>
      </div>
    </div>
  );
}
