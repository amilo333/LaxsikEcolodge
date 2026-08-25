'use client';

import { Pagination } from '@/components/core';
import { TRoom } from '@/modules/rooms/common/types';
import { formatCurrency } from '@/utils';
import Image from 'next/image';
import { useDeferredValue, useState } from 'react';
import { useAdminRoomsApi, useDeleteAdminRoomApi } from '../common';
import { RoomFormModal } from './room-form-modal';

const ROOM_STATUS_LABELS = {
  available: 'Đang mở bán',
  maintenance: 'Bảo trì',
  inactive: 'Ngừng hoạt động',
};

export function RoomsManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search.trim());
  const roomsQuery = useAdminRoomsApi({
    page,
    limit: 8,
    ...(deferredSearch ? { search: deferredSearch } : {}),
  });
  const deleteRoom = useDeleteAdminRoomApi();
  const [editingRoom, setEditingRoom] = useState<TRoom | null | undefined>();
  const rooms = roomsQuery.data?.data ?? [];
  const pagination = roomsQuery.data?.pagination;

  const handleDelete = (room: TRoom) => {
    if (
      window.confirm(
        `Xóa phòng “${room.title}”? Phòng có lịch sử booking sẽ được hệ thống từ chối xóa.`
      )
    ) {
      deleteRoom.mutate(room._id, {
        onSuccess: () => {
          if (rooms.length === 1 && page > 1) setPage(page - 1);
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
              Quản lý phòng
            </h2>
            <p className='mt-1 text-[11px] text-[#7A8682]'>
              Tạo mới, chỉnh sửa giá, số lượng và trạng thái phòng.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <label className='relative block w-full sm:w-[260px]'>
              <span className='sr-only'>Tìm phòng</span>
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
                placeholder='Tìm tên phòng, loại giường'
                className='h-11 w-full rounded-full border border-[#DCE6E3] bg-[#F8FAF9] pr-4 pl-10 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
              />
            </label>
            <button
              type='button'
              onClick={() => setEditingRoom(null)}
              className='h-11 shrink-0 rounded-full bg-[#0D4949] px-6 text-xs font-extrabold text-white shadow-[0_9px_22px_rgba(13,73,73,0.2)]'>
              + Thêm phòng
            </button>
          </div>
        </div>

        {roomsQuery.isError ? (
          <div className='p-10 text-center'>
            <p className='text-sm font-bold text-[#B33939]'>
              Không thể tải phòng.
            </p>
            <button
              onClick={() => void roomsQuery.refetch()}
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
                    <th className='px-6 py-3 font-bold'>Phòng</th>
                    <th className='px-4 py-3 font-bold'>Giá/đêm</th>
                    <th className='px-4 py-3 font-bold'>Sức chứa</th>
                    <th className='px-4 py-3 font-bold'>Số lượng</th>
                    <th className='px-4 py-3 font-bold'>Trạng thái</th>
                    <th className='px-6 py-3 text-right font-bold'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#E8EEEC] text-xs'>
                  {rooms.map((room) => (
                    <tr key={room._id} className='hover:bg-[#FAFCFB]'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <Image
                            src={room.thumbnail}
                            alt={room.title}
                            width={56}
                            height={44}
                            className='h-11 w-14 rounded-xl object-cover'
                          />
                          <span className='min-w-0'>
                            <span className='block max-w-[260px] truncate font-extrabold text-[#263F3C]'>
                              {room.title}
                            </span>
                            <span className='mt-1 block text-[10px] text-[#74817D]'>
                              {room.bed} · {room.area} m²
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className='px-4 py-4 font-extrabold text-[#0D4949] tabular-nums'>
                        {formatCurrency(room.price)}
                      </td>
                      <td className='px-4 py-4'>{room.capacity} khách</td>
                      <td className='px-4 py-4 font-bold'>{room.quantity}</td>
                      <td className='px-4 py-4'>
                        <span
                          className={`rounded-full px-3 py-2 text-[10px] font-extrabold ${
                            room.status === 'available'
                              ? 'bg-[#E7F3EF] text-[#0D665A]'
                              : room.status === 'maintenance'
                                ? 'bg-[#FFF3DB] text-[#97610B]'
                                : 'bg-[#EEF0F1] text-[#65716E]'
                          }`}>
                          {ROOM_STATUS_LABELS[room.status]}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex justify-end gap-2'>
                          <button
                            type='button'
                            onClick={() => setEditingRoom(room)}
                            className='rounded-full border border-[#BFD3CD] px-3 py-2 text-[10px] font-bold text-[#0D665A] hover:bg-[#EAF4F1]'>
                            Chỉnh sửa
                          </button>
                          <button
                            type='button'
                            disabled={deleteRoom.isPending}
                            onClick={() => handleDelete(room)}
                            className='rounded-full border border-[#E8C7CA] px-3 py-2 text-[10px] font-bold text-[#A33A43] hover:bg-[#FCEBEC] disabled:opacity-45'>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!roomsQuery.isLoading && rooms.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-6 py-12 text-center text-[#7A8682]'>
                        Không tìm thấy phòng.
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

      {typeof editingRoom !== 'undefined' && (
        <RoomFormModal
          room={editingRoom}
          onClose={() => setEditingRoom(undefined)}
        />
      )}
    </>
  );
}
