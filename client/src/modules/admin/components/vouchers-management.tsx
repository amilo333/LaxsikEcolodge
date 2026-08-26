'use client';

import { Pagination } from '@/components/core';
import { formatCurrency } from '@/utils';
import { useDeferredValue, useState } from 'react';

import {
  TAdminVoucher,
  useAdminVouchersApi,
  useDeleteAdminVoucherApi,
} from '../common';
import { VoucherFormModal } from './voucher-form-modal';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

const getVoucherState = (voucher: TAdminVoucher) => {
  const now = Date.now();

  if (voucher.status === 'inactive') {
    return { label: 'Đã tắt', className: 'bg-[#EEF0F1] text-[#65716E]' };
  }
  if (voucher.quantity === 0) {
    return { label: 'Hết lượt', className: 'bg-[#FCEBEC] text-[#A33A43]' };
  }
  if (now < new Date(voucher.startDate).getTime()) {
    return { label: 'Sắp diễn ra', className: 'bg-[#EAF1FB] text-[#245D9C]' };
  }
  if (now > new Date(voucher.endDate).getTime()) {
    return { label: 'Hết hạn', className: 'bg-[#FFF0E8] text-[#A75720]' };
  }
  return { label: 'Đang áp dụng', className: 'bg-[#E7F3EF] text-[#0D665A]' };
};

export function VouchersManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const [editingVoucher, setEditingVoucher] = useState<
    TAdminVoucher | null | undefined
  >();
  const vouchersQuery = useAdminVouchersApi({
    page,
    limit: 8,
    ...(deferredSearch ? { search: deferredSearch } : {}),
  });
  const deleteVoucher = useDeleteAdminVoucherApi();
  const vouchers = vouchersQuery.data?.data ?? [];
  const pagination = vouchersQuery.data?.pagination;

  const handleDelete = (voucher: TAdminVoucher) => {
    if (
      window.confirm(
        `Xóa voucher “${voucher.code}”? Voucher đã được dùng trong booking sẽ không thể xóa.`
      )
    ) {
      deleteVoucher.mutate(voucher._id, {
        onSuccess: () => {
          if (vouchers.length === 1 && page > 1) setPage(page - 1);
        },
      });
    }
  };

  return (
    <>
      <section className='overflow-hidden rounded-[16px] border border-[#DDE7E4] bg-white shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
        <div className='flex flex-col gap-4 border-b border-[#E5ECEA] px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between'>
          <div>
            <h2 className='font-lora text-xl font-semibold text-[#163D3B]'>
              Quản lý voucher
            </h2>
            <p className='mt-1 text-[11px] text-[#7A8682]'>
              Quản lý mã ưu đãi, thời gian áp dụng và số lượt còn lại.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <label className='relative block w-full sm:w-[260px]'>
              <span className='sr-only'>Tìm voucher</span>
              <svg
                viewBox='0 0 24 24'
                aria-hidden='true'
                className='absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 fill-none stroke-[#7A8783] stroke-2'>
                <circle cx='11' cy='11' r='7' />
                <path d='m20 20-4-4' />
              </svg>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder='Tìm theo mã voucher'
                className='h-11 w-full rounded-full border border-[#DCE6E3] bg-[#F8FAF9] pr-4 pl-10 text-xs uppercase outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
            </label>
            <button
              type='button'
              onClick={() => setEditingVoucher(null)}
              className='h-11 shrink-0 rounded-full bg-[#0D4949] px-6 text-xs font-extrabold text-white shadow-[0_9px_22px_rgba(13,73,73,0.2)]'>
              + Thêm voucher
            </button>
          </div>
        </div>

        {vouchersQuery.isError ? (
          <div className='p-10 text-center'>
            <p className='text-sm font-bold text-[#B33939]'>
              Không thể tải danh sách voucher.
            </p>
            <button
              type='button'
              onClick={() => void vouchersQuery.refetch()}
              className='mt-4 rounded-full bg-[#0D4949] px-5 py-2.5 text-xs font-bold text-white'>
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[980px] text-left'>
                <thead className='bg-[#F7F9F8] text-[10px] text-[#71807B] uppercase'>
                  <tr>
                    <th className='px-6 py-3 font-bold'>Mã voucher</th>
                    <th className='px-4 py-3 font-bold'>Mức giảm</th>
                    <th className='px-4 py-3 font-bold'>Còn lại</th>
                    <th className='px-4 py-3 font-bold'>Thời gian áp dụng</th>
                    <th className='px-4 py-3 font-bold'>Trạng thái</th>
                    <th className='px-6 py-3 text-right font-bold'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#E8EEEC] text-xs'>
                  {vouchers.map((voucher) => {
                    const state = getVoucherState(voucher);

                    return (
                      <tr key={voucher._id} className='hover:bg-[#FAFCFB]'>
                        <td className='px-6 py-4'>
                          <span className='inline-flex rounded-full border border-dashed border-[#8EB8AD] bg-[#F0F7F4] px-4 py-2 font-extrabold text-[#0D5A56]'>
                            {voucher.code}
                          </span>
                        </td>
                        <td className='px-4 py-4 font-extrabold text-[#173F3D]'>
                          {voucher.discountType === 'percent'
                            ? `${voucher.discountValue}%`
                            : formatCurrency(voucher.discountValue)}
                        </td>
                        <td className='px-4 py-4 font-bold tabular-nums'>
                          {voucher.quantity.toLocaleString('vi-VN')} lượt
                        </td>
                        <td className='px-4 py-4 text-[#5E6E69]'>
                          <span className='block'>
                            {formatDate(voucher.startDate)}
                          </span>
                          <span className='mt-1 block text-[10px] text-[#8A9692]'>
                            đến {formatDate(voucher.endDate)}
                          </span>
                        </td>
                        <td className='px-4 py-4'>
                          <span
                            className={`rounded-full px-3 py-2 text-[10px] font-extrabold ${state.className}`}>
                            {state.label}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex justify-end gap-2'>
                            <button
                              type='button'
                              onClick={() => setEditingVoucher(voucher)}
                              className='rounded-full border border-[#BFD3CD] px-3 py-2 text-[10px] font-bold text-[#0D665A] hover:bg-[#EAF4F1]'>
                              Chỉnh sửa
                            </button>
                            <button
                              type='button'
                              disabled={deleteVoucher.isPending}
                              onClick={() => handleDelete(voucher)}
                              className='rounded-full border border-[#E8C7CA] px-3 py-2 text-[10px] font-bold text-[#A33A43] hover:bg-[#FCEBEC] disabled:opacity-45'>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!vouchersQuery.isLoading && vouchers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-6 py-12 text-center text-[#7A8682]'>
                        Không tìm thấy voucher.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className='border-t border-[#E5ECEA] px-5 py-4 sm:px-6'>
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onChangePage={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>

      {typeof editingVoucher !== 'undefined' && (
        <VoucherFormModal
          voucher={editingVoucher}
          onClose={() => setEditingVoucher(undefined)}
        />
      )}
    </>
  );
}
