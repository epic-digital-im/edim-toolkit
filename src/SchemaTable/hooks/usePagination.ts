import { useState } from 'react';

interface UsePaginationState {
  previousPage: () => void;
  canPreviousPage: boolean;
  gotoPage: (page: number) => void;
  page: number;
  pageSize: number;
  pageIndex: number;
  count: number;
  nextPage: () => void;
  canNextPage: boolean;
  setCount: (count: number) => void;
  setPageSize: (pageSize: number) => void;
}

export const usePagination = (): UsePaginationState => {
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(count / pageSize);

  const nextPage = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const gotoPage = (page: number) => {
    console.log(page);
    if (page > 0 && page <= pageCount) {
      setPage(page);
    }
  };

  const canPreviousPage = page > 1;
  const canNextPage = page < pageCount;

  return {
    previousPage,
    canPreviousPage,
    gotoPage,
    page,
    pageSize,
    pageIndex: page - 1,
    nextPage,
    count,
    setCount,
    canNextPage,
    setPageSize,
  }
}

export default usePagination;