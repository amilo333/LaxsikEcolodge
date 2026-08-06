export type TPaginationProps = {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
};
