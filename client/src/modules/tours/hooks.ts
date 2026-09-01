'use client';

import { useQuery } from '@tanstack/react-query';
import { getTourListApi } from './api';

export const useTourListApi = () =>
  useQuery({
    queryKey: ['tourList'],
    queryFn: getTourListApi,
  });
