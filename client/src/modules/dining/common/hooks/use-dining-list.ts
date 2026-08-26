import { useQuery } from '@tanstack/react-query';
import { getDiningList, getDiningServices } from '../api';

export const useDiningListApi = () => {
  return useQuery({
    queryKey: ['diningList'],
    queryFn: getDiningList,
  });
};

export const useDiningServicesApi = () => {
  return useQuery({
    queryKey: ['diningServices'],
    queryFn: getDiningServices,
  });
};
