'use client';

import { Pagination } from '@/components/core';
import Image from 'next/image';
import { useDeferredValue, useState } from 'react';

import {
  TAdminExperience,
  TAdminExperienceKind,
  TAdminExperienceService,
  useAdminExperiencesApi,
  useAdminExperienceServicesApi,
  useDeleteAdminExperienceApi,
  useDeleteAdminExperienceServiceApi,
} from '../common';
import { ExperienceFormModal } from './experience-form-modal';
import { ServiceFormModal } from './service-form-modal';

type TExperienceManagementProps = {
  kind: TAdminExperienceKind;
};

const getParentTitle = (
  kind: TAdminExperienceKind,
  service: TAdminExperienceService
) => {
  const parent = kind === 'dining' ? service.diningId : service.spaId;
  return typeof parent === 'string' ? '—' : (parent?.title ?? '—');
};

export function ExperienceManagement({ kind }: TExperienceManagementProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'services'>('content');
  const [contentPage, setContentPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [contentSearch, setContentSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const deferredContentSearch = useDeferredValue(contentSearch.trim());
  const deferredServiceSearch = useDeferredValue(serviceSearch.trim());
  const [editingItem, setEditingItem] = useState<
    TAdminExperience | null | undefined
  >();
  const [editingService, setEditingService] = useState<
    TAdminExperienceService | null | undefined
  >();
  const itemsQuery = useAdminExperiencesApi(kind, {
    page: contentPage,
    limit: 6,
    ...(deferredContentSearch ? { search: deferredContentSearch } : {}),
  });
  const parentsQuery = useAdminExperiencesApi(kind, {
    page: 1,
    limit: 100,
  });
  const servicesQuery = useAdminExperienceServicesApi(kind, {
    page: servicePage,
    limit: 8,
    ...(deferredServiceSearch ? { search: deferredServiceSearch } : {}),
  });
  const deleteItem = useDeleteAdminExperienceApi(kind);
  const deleteService = useDeleteAdminExperienceServiceApi(kind);
  const items = itemsQuery.data?.data ?? [];
  const services = servicesQuery.data?.data ?? [];
  const parents = parentsQuery.data?.data ?? [];
  const label = kind === 'dining' ? 'Dining' : 'Spa';

  const handleDeleteItem = (item: TAdminExperience) => {
    if (
      window.confirm(
        `Xóa “${item.title}”? Bạn cần xóa các dịch vụ trực thuộc trước.`
      )
    ) {
      deleteItem.mutate(item._id, {
        onSuccess: () => {
          if (items.length === 1 && contentPage > 1) {
            setContentPage(contentPage - 1);
          }
        },
      });
    }
  };

  const handleDeleteService = (service: TAdminExperienceService) => {
    if (window.confirm(`Xóa dịch vụ “${service.title}”?`)) {
      deleteService.mutate(service._id, {
        onSuccess: () => {
          if (services.length === 1 && servicePage > 1) {
            setServicePage(servicePage - 1);
          }
        },
      });
    }
  };

  return (
    <>
      <section className='overflow-hidden rounded-[16px] border border-[#DDE7E4] bg-white shadow-[0_12px_38px_rgba(13,73,73,0.06)]'>
        <div className='border-b border-[#E5ECEA] px-5 py-5 sm:px-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <h2 className='font-lora text-2xl font-semibold text-[#163D3B]'>
                Quản lý {label}
              </h2>
              <p className='mt-1 text-xs text-[#7A8682]'>
                Quản lý nội dung, hình ảnh và dịch vụ hiển thị trên website.
              </p>
            </div>

            <div className='flex rounded-full bg-[#EDF4F1] p-1'>
              <button
                type='button'
                onClick={() => setActiveTab('content')}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  activeTab === 'content'
                    ? 'bg-[#0D4949] text-white'
                    : 'text-[#52635F]'
                }`}>
                Nội dung {label}
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('services')}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  activeTab === 'services'
                    ? 'bg-[#0D4949] text-white'
                    : 'text-[#52635F]'
                }`}>
                Dịch vụ
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'content' ? (
          <div>
            <div className='flex flex-col gap-3 border-b border-[#E5ECEA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
              <input
                value={contentSearch}
                onChange={(event) => {
                  setContentSearch(event.target.value);
                  setContentPage(1);
                }}
                placeholder={`Tìm nội dung ${label}...`}
                className='h-11 w-full rounded-full border border-[#DCE6E3] bg-[#F8FAF9] px-5 text-xs outline-none focus:border-[#0D4949] sm:max-w-[320px]'
              />
              <button
                type='button'
                onClick={() => setEditingItem(null)}
                className='h-11 rounded-full bg-[#0D4949] px-6 text-xs font-extrabold text-white'>
                + Thêm {label}
              </button>
            </div>

            {itemsQuery.isLoading ? (
              <p className='px-6 py-16 text-center text-sm text-[#6E7C78]'>
                Đang tải dữ liệu…
              </p>
            ) : itemsQuery.isError ? (
              <div className='px-6 py-16 text-center'>
                <p className='text-sm font-bold text-[#B33939]'>
                  Không thể tải dữ liệu {label}.
                </p>
                <button
                  type='button'
                  onClick={() => void itemsQuery.refetch()}
                  className='mt-4 rounded-full bg-[#0D4949] px-5 py-2.5 text-xs font-bold text-white'>
                  Thử lại
                </button>
              </div>
            ) : (
              <div className='grid gap-4 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-3'>
                {items.map((item) => (
                  <article
                    key={item._id}
                    className='overflow-hidden rounded-[16px] border border-[#DCE6E3] bg-[#FAFCFB]'>
                    <div className='relative h-40 w-full'>
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes='(max-width: 768px) 100vw, 360px'
                        className='object-cover'
                      />
                    </div>
                    <div className='p-4'>
                      <div className='flex items-start justify-between gap-3'>
                        <h3 className='font-lora line-clamp-1 text-lg font-semibold text-[#183F3D]'>
                          {item.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                            item.status === 'active'
                              ? 'bg-[#E5F2ED] text-[#0D665A]'
                              : 'bg-[#F0F1F1] text-[#69736F]'
                          }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className='mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#65736F]'>
                        {item.description}
                      </p>
                      <div className='mt-4 flex gap-2 border-t border-[#E1E9E6] pt-4'>
                        <button
                          type='button'
                          onClick={() => setEditingItem(item)}
                          className='flex-1 rounded-full border border-[#BFD3CD] px-3 py-2 text-[10px] font-bold text-[#0D665A]'>
                          Chỉnh sửa
                        </button>
                        <button
                          type='button'
                          disabled={deleteItem.isPending}
                          onClick={() => handleDeleteItem(item)}
                          className='rounded-full border border-[#E8C7CA] px-3 py-2 text-[10px] font-bold text-[#A33A43] disabled:opacity-50'>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                {items.length === 0 && (
                  <p className='py-14 text-center text-sm text-[#7A8682] md:col-span-2 xl:col-span-3'>
                    Chưa có nội dung {label}.
                  </p>
                )}
              </div>
            )}

            {itemsQuery.data && itemsQuery.data.pagination.totalPages > 1 && (
              <div className='border-t border-[#E5ECEA] px-5 py-4 sm:px-6'>
                <Pagination
                  currentPage={contentPage}
                  totalPages={itemsQuery.data.pagination.totalPages}
                  onChangePage={setContentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className='flex flex-col gap-3 border-b border-[#E5ECEA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
              <input
                value={serviceSearch}
                onChange={(event) => {
                  setServiceSearch(event.target.value);
                  setServicePage(1);
                }}
                placeholder='Tìm dịch vụ...'
                className='h-11 w-full rounded-full border border-[#DCE6E3] bg-[#F8FAF9] px-5 text-xs outline-none focus:border-[#0D4949] sm:max-w-[320px]'
              />
              <button
                type='button'
                onClick={() => setEditingService(null)}
                disabled={parents.length === 0}
                className='h-11 rounded-full bg-[#0D4949] px-6 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45'>
                + Thêm dịch vụ
              </button>
            </div>

            {servicesQuery.isLoading ? (
              <p className='px-6 py-16 text-center text-sm text-[#6E7C78]'>
                Đang tải dịch vụ…
              </p>
            ) : servicesQuery.isError ? (
              <p className='px-6 py-16 text-center text-sm font-bold text-[#B33939]'>
                Không thể tải dịch vụ.
              </p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[850px] text-left'>
                  <thead className='bg-[#F7F9F8] text-[10px] text-[#71807B] uppercase'>
                    <tr>
                      <th className='px-6 py-3 font-bold'>Dịch vụ</th>
                      <th className='px-4 py-3 font-bold'>Thuộc {label}</th>
                      <th className='px-4 py-3 font-bold'>Trạng thái</th>
                      <th className='px-6 py-3 text-right font-bold'>
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[#E8EEEC] text-xs'>
                    {services.map((service) => (
                      <tr key={service._id} className='hover:bg-[#FAFCFB]'>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <Image
                              src={service.icon}
                              alt={service.title}
                              width={42}
                              height={42}
                              className='h-10 w-10 rounded-xl object-contain'
                            />
                            <span>
                              <span className='block font-bold text-[#263F3C]'>
                                {service.title}
                              </span>
                              <span className='mt-1 block max-w-[340px] truncate text-[10px] text-[#74817D]'>
                                {service.description}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-4 text-[#52635F]'>
                          {getParentTitle(kind, service)}
                        </td>
                        <td className='px-4 py-4'>
                          <span
                            className={`rounded-full px-3 py-2 text-[10px] font-bold ${
                              service.status === 'active'
                                ? 'bg-[#E7F3EF] text-[#0D665A]'
                                : 'bg-[#EEF0F1] text-[#65716E]'
                            }`}>
                            {service.status}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex justify-end gap-2'>
                            <button
                              type='button'
                              onClick={() => setEditingService(service)}
                              className='rounded-full border border-[#BFD3CD] px-3 py-2 text-[10px] font-bold text-[#0D665A]'>
                              Chỉnh sửa
                            </button>
                            <button
                              type='button'
                              disabled={deleteService.isPending}
                              onClick={() => handleDeleteService(service)}
                              className='rounded-full border border-[#E8C7CA] px-3 py-2 text-[10px] font-bold text-[#A33A43] disabled:opacity-50'>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className='px-6 py-14 text-center text-[#7A8682]'>
                          Chưa có dịch vụ {label}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {servicesQuery.data &&
              servicesQuery.data.pagination.totalPages > 1 && (
                <div className='border-t border-[#E5ECEA] px-5 py-4 sm:px-6'>
                  <Pagination
                    currentPage={servicePage}
                    totalPages={servicesQuery.data.pagination.totalPages}
                    onChangePage={setServicePage}
                  />
                </div>
              )}
          </div>
        )}
      </section>

      {typeof editingItem !== 'undefined' && (
        <ExperienceFormModal
          kind={kind}
          item={editingItem}
          onClose={() => setEditingItem(undefined)}
        />
      )}

      {typeof editingService !== 'undefined' && (
        <ServiceFormModal
          kind={kind}
          service={editingService}
          parents={parents}
          onClose={() => setEditingService(undefined)}
        />
      )}
    </>
  );
}
