'use client';
import { Pagination as HeroPagination } from '@heroui/react';
import { useCallback } from 'react';
import { TPaginationProps } from './type';

export function Pagination(props: TPaginationProps) {
  const { currentPage = 1, totalPages = 1, onChangePage } = props;

  const page = currentPage;

  const changePage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);

    onChangePage(safePage);
  };

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
              onPress={() => changePage(page - 1)}>
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
                  onPress={() => changePage(p)}>
                  {p}
                </HeroPagination.Link>
              </HeroPagination.Item>
            )
          )}
          <HeroPagination.Item>
            <HeroPagination.Next
              isDisabled={page === totalPages}
              onPress={() => changePage(page + 1)}>
              <HeroPagination.NextIcon />
            </HeroPagination.Next>
          </HeroPagination.Item>
        </HeroPagination.Content>
      </HeroPagination>
    </div>
  );
}
