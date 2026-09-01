'use client';

import { Pagination } from '@/components/core';
import { TTour } from '@/modules/tours/types';
import Image from 'next/image';
import { useDeferredValue, useState } from 'react';

import { useAdminToursApi, useDeleteAdminTourApi } from '../common';
import { TourFormModal } from './tour-form-modal';

export function ToursManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const toursQuery = useAdminToursApi({
    page,
    limit: 8,
    ...(deferredSearch ? { search: deferredSearch } : {}),
  });
  const deleteTour = useDeleteAdminTourApi();
  const [editingTour, setEditingTour] = useState<TTour | null | undefined>();
  const tours = toursQuery.data?.data ?? [];
  const pagination = toursQuery.data?.pagination;

  const handleDelete = (tour: TTour) => {
    if (window.confirm(`Xóa tour “${tour.title}”?`)) {
      deleteTour.mutate(tour._id, {
        onSuccess: () => {
          if (tours.length === 1 && page > 1) setPage(page - 1);
        },
      });
    }
  };

  return (
    <>
      <section className='overflow-hidden rounded-[16px] border border-[#DDE7E4] bg-white shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
        <div className='flex flex-col gap-4 border-b border-[#E5ECEA] px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between'>
          <div>
            <h2 className='text-lg font-extrabold text-[#163D3B]'>
              Quản lý tour
            </h2>
            <p className='mt-1 text-[11px] text-[#7A8682]'>
              Tạo, chỉnh sửa, sắp xếp và ẩn hiện tour trên website.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <label className='relative block w-full sm:w-[280px]'>
              <span className='sr-only'>Tìm tour</span>
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
                placeholder='Tìm tên, thời lượng, độ khó'
                className='h-11 w-full rounded-full border border-[#DCE6E3] bg-[#F8FAF9] pr-4 pl-10 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
            </label>
            <button
              type='button'
              onClick={() => setEditingTour(null)}
              className='h-11 shrink-0 rounded-full bg-[#0D4949] px-6 text-xs font-extrabold text-white shadow-[0_9px_22px_rgba(13,73,73,0.2)]'>
              + Thêm tour
            </button>
          </div>
        </div>

        {toursQuery.isLoading ? (
          <p className='px-6 py-16 text-center text-sm text-[#6E7C78]'>
            Đang tải tour…
          </p>
        ) : toursQuery.isError ? (
          <div className='p-10 text-center'>
            <p className='text-sm font-bold text-[#B33939]'>
              Không thể tải danh sách tour.
            </p>
            <button
              type='button'
              onClick={() => void toursQuery.refetch()}
              className='mt-4 rounded-full bg-[#0D4949] px-5 py-2.5 text-xs font-bold text-white'>
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[960px] text-left'>
                <thead className='bg-[#F7F9F8] text-[10px] text-[#71807B] uppercase'>
                  <tr>
                    <th className='px-6 py-3 font-bold'>Tour</th>
                    <th className='px-4 py-3 font-bold'>Thời lượng</th>
                    <th className='px-4 py-3 font-bold'>Độ khó</th>
                    <th className='px-4 py-3 font-bold'>Thứ tự</th>
                    <th className='px-4 py-3 font-bold'>Trạng thái</th>
                    <th className='px-6 py-3 text-right font-bold'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#E8EEEC] text-xs'>
                  {tours.map((tour) => (
                    <tr key={tour._id} className='hover:bg-[#FAFCFB]'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <Image
                            src={tour.thumbnail}
                            alt={tour.title}
                            width={64}
                            height={48}
                            className='h-12 w-16 rounded-xl object-cover'
                          />
                          <span className='min-w-0'>
                            <span className='block max-w-[300px] truncate font-extrabold text-[#263F3C]'>
                              {tour.title}
                            </span>
                            <span className='mt-1 block max-w-[300px] truncate text-[10px] text-[#74817D]'>
                              {tour.eyebrow}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-4 font-bold text-[#35534F]'>
                        {tour.duration}
                      </td>
                      <td className='px-4 py-4'>{tour.rhythm}</td>
                      <td className='px-4 py-4 font-bold tabular-nums'>
                        {tour.sortOrder}
                      </td>
                      <td className='px-4 py-4'>
                        <span
                          className={`rounded-full px-3 py-2 text-[10px] font-extrabold ${
                            tour.status === 'active'
                              ? 'bg-[#E7F3EF] text-[#0D665A]'
                              : 'bg-[#EEF0F1] text-[#65716E]'
                          }`}>
                          {tour.status === 'active'
                            ? 'Đang hiển thị'
                            : 'Đang ẩn'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex justify-end gap-2'>
                          <button
                            type='button'
                            onClick={() => setEditingTour(tour)}
                            className='rounded-full border border-[#BFD3CD] px-3 py-2 text-[10px] font-bold text-[#0D665A] hover:bg-[#EAF4F1]'>
                            Chỉnh sửa
                          </button>
                          <button
                            type='button'
                            disabled={deleteTour.isPending}
                            onClick={() => handleDelete(tour)}
                            className='rounded-full border border-[#E8C7CA] px-3 py-2 text-[10px] font-bold text-[#A33A43] hover:bg-[#FCEBEC] disabled:opacity-45'>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tours.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-6 py-12 text-center text-[#7A8682]'>
                        Không tìm thấy tour.
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

      {typeof editingTour !== 'undefined' && (
        <TourFormModal
          tour={editingTour}
          onClose={() => setEditingTour(undefined)}
        />
      )}
    </>
  );
}
