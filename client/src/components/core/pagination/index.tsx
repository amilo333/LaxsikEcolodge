'use client';
import { Pagination as HeroPagination } from '@heroui/react';
import { useCallback, useState } from 'react';
import { TPaginationProps } from './type';

export function Pagination(props: TPaginationProps) {
  const { currentPage = 1, totalPages = 1, onChangePage } = props;

  const [page, setPage] = useState(currentPage);

  const getPageNumbers = useCallback(() => {
    if (totalPages <= 1) {
      return [1];
    }

    const pages: (number | 'ellipsis')[] = [];
    const uniquePages = new Set<number>();

    pages.push(1);
    uniquePages.add(1);

    if (page > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      if (!uniquePages.has(i)) {
        pages.push(i);
        uniquePages.add(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (!uniquePages.has(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  return (
    <div className='w-full max-w-2xs overflow-x-auto sm:max-w-full'>
      <HeroPagination className='justify-center'>
        <HeroPagination.Content>
          <HeroPagination.Item>
            <HeroPagination.Previous
              isDisabled={page === 1}
              onPress={() => {
                const newPage = page - 1;
                setPage(newPage);
                onChangePage(newPage);
              }}>
              <HeroPagination.PreviousIcon />
            </HeroPagination.Previous>
          </HeroPagination.Item>
          {getPageNumbers().map((p, i) =>
            p === 'ellipsis' ? (
              <HeroPagination.Item key={`ellipsis-${i}`}>
                <HeroPagination.Ellipsis />
              </HeroPagination.Item>
            ) : (
              <HeroPagination.Item key={p}>
                <HeroPagination.Link
                  isActive={p === page}
                  onPress={() => setPage(p)}>
                  {p}
                </HeroPagination.Link>
              </HeroPagination.Item>
            )
          )}
          <HeroPagination.Item>
            <HeroPagination.Next
              isDisabled={page === totalPages}
              onPress={() => {
                const newPage = page + 1;
                setPage(newPage);
                onChangePage(newPage);
              }}>
              <HeroPagination.NextIcon />
            </HeroPagination.Next>
          </HeroPagination.Item>
        </HeroPagination.Content>
      </HeroPagination>
    </div>
  );
}
