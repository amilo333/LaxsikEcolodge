import { useQuery } from '@tanstack/react-query';
import { getSpaList } from '../api';

export const useSpaListApi = () => {
  return useQuery({
    queryKey: ['spaList'],
    queryFn: getSpaList,
  });
};
