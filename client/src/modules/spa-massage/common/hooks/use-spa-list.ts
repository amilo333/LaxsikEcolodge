import { useQuery } from '@tanstack/react-query';
import { getSpaList, getSpaServices } from '../api';

export const useSpaListApi = () => {
  return useQuery({
    queryKey: ['spaList'],
    queryFn: getSpaList,
  });
};

export const useSpaServicesApi = () => {
  return useQuery({
    queryKey: ['spaServices'],
    queryFn: getSpaServices,
  });
};
