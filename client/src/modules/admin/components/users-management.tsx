'use client';

import { TUser } from '@/modules/auth/common';
import { Pagination } from '@/components/core';
import { useDeferredValue, useState } from 'react';
import {
  TAdminUser,
  useAdminUsersApi,
  useDeleteAdminUserApi,
  useUpdateAdminUserApi,
} from '../common';
import { UserFormModal } from './user-form-modal';

type TUsersManagementProps = {
  currentUser: TUser;
};

export function UsersManagement({ currentUser }: TUsersManagementProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<TAdminUser | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const usersQuery = useAdminUsersApi({
    page,
    limit: 8,
    ...(deferredSearch ? { search: deferredSearch } : {}),
  });
  const updateUser = useUpdateAdminUserApi();
  const deleteUser = useDeleteAdminUserApi();
  const users = usersQuery.data?.data ?? [];
  const pagination = usersQuery.data?.pagination;

  const handleDelete = (userId: string, fullName: string) => {
    if (
      window.confirm(
        `Xóa người dùng “${fullName}”? Tài khoản có lịch sử booking sẽ không thể xóa.`
      )
    ) {
      deleteUser.mutate(userId, {
        onSuccess: () => {
          if (users.length === 1 && page > 1) setPage(page - 1);
        },
      });
    }
  };

  return (
    <>
      <section className='overflow-hidden rounded-[16px] border border-[#DDE7E4] bg-white shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
        <div className='flex flex-col gap-4 border-b border-[#E5ECEA] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
          <div>
            <h2 className='text-lg font-extrabold text-[#163D3B]'>
              Quản lý người dùng
            </h2>
            <p className='mt-1 text-[11px] text-[#7A8682]'>
              Chỉnh sửa thông tin, phân quyền, khóa hoặc xóa tài khoản.
            </p>
          </div>
          <label className='relative block w-full sm:w-[280px]'>
            <span className='sr-only'>Tìm người dùng</span>
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
              placeholder='Tìm tên, email, số điện thoại'
              className='h-11 w-full rounded-full border border-[#DCE6E3] bg-[#F8FAF9] pr-4 pl-10 text-xs outline-none focus:border-[#0D4949] focus:ring-2 focus:ring-[#0D4949]/10'
            />
          </label>
        </div>

        {usersQuery.isError ? (
          <div className='p-10 text-center'>
            <p className='text-sm font-bold text-[#B33939]'>
              Không thể tải người dùng.
            </p>
            <button
              onClick={() => void usersQuery.refetch()}
              className='mt-4 rounded-full bg-[#0D4949] px-5 py-2.5 text-xs font-bold text-white'>
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[900px] text-left'>
                <thead className='bg-[#F7F9F8] text-[10px] text-[#71807B] uppercase'>
                  <tr>
                    <th className='px-6 py-3 font-bold'>Người dùng</th>
                    <th className='px-4 py-3 font-bold'>Số điện thoại</th>
                    <th className='px-4 py-3 font-bold'>Vai trò</th>
                    <th className='px-4 py-3 font-bold'>Trạng thái</th>
                    <th className='px-6 py-3 text-right font-bold'>Thao tác</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#E8EEEC] text-xs'>
                  {users.map((user) => {
                    const isCurrentUser = currentUser._id === user._id;

                    return (
                      <tr key={user._id} className='hover:bg-[#FAFCFB]'>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4F1] text-[11px] font-black text-[#0D4949]'>
                              {user.full_name.charAt(0).toUpperCase()}
                            </span>
                            <span className='min-w-0'>
                              <span className='block truncate font-extrabold text-[#263F3C]'>
                                {user.full_name}
                                {isCurrentUser && (
                                  <span className='ml-2 text-[9px] text-[#0D665A]'>
                                    Bạn
                                  </span>
                                )}
                              </span>
                              <span className='mt-1 block truncate text-[10px] text-[#74817D]'>
                                {user.email}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-4 text-[#52635F]'>
                          {user.phone}
                        </td>
                        <td className='px-4 py-4'>
                          <select
                            value={user.role}
                            disabled={isCurrentUser || updateUser.isPending}
                            onChange={(event) =>
                              updateUser.mutate({
                                userId: user._id,
                                data: { role: event.target.value },
                              })
                            }
                            className='h-9 rounded-full border border-[#DCE6E3] bg-white px-3 text-[11px] font-bold outline-none disabled:opacity-55'>
                            <option value='user'>User</option>
                            <option value='admin'>Admin</option>
                          </select>
                        </td>
                        <td className='px-4 py-4'>
                          <button
                            type='button'
                            disabled={isCurrentUser || updateUser.isPending}
                            onClick={() =>
                              updateUser.mutate({
                                userId: user._id,
                                data: { status: !user.status },
                              })
                            }
                            className={`rounded-full px-3 py-2 text-[10px] font-extrabold disabled:opacity-55 ${
                              user.status
                                ? 'bg-[#E7F3EF] text-[#0D665A]'
                                : 'bg-[#FCEBEC] text-[#A33A43]'
                            }`}>
                            {user.status ? 'Hoạt động' : 'Đã khóa'}
                          </button>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <div className='flex justify-end gap-2'>
                            <button
                              type='button'
                              disabled={
                                updateUser.isPending || deleteUser.isPending
                              }
                              onClick={() => setEditingUser(user)}
                              className='rounded-full border border-[#BFD3CD] px-3 py-2 text-[10px] font-bold text-[#0D665A] transition hover:bg-[#EAF4F1] disabled:cursor-not-allowed disabled:opacity-45'>
                              Chỉnh sửa
                            </button>
                            <button
                              type='button'
                              disabled={
                                isCurrentUser ||
                                user.role === 'admin' ||
                                deleteUser.isPending
                              }
                              onClick={() =>
                                handleDelete(user._id, user.full_name)
                              }
                              className='rounded-full border border-[#E8C7CA] px-3 py-2 text-[10px] font-bold text-[#A33A43] transition hover:bg-[#FCEBEC] disabled:cursor-not-allowed disabled:opacity-35'>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!usersQuery.isLoading && users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className='px-6 py-12 text-center text-[#7A8682]'>
                        Không tìm thấy người dùng.
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
      {editingUser && (
        <UserFormModal
          user={editingUser}
          isCurrentUser={editingUser._id === currentUser._id}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  );
}
