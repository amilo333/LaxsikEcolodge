import { useQuery } from '@tanstack/react-query';
import { getDiningList } from '../api';

export const useDiningListApi = () => {
  return useQuery({
    queryKey: ['diningList'],
    queryFn: getDiningList,
  });
};
