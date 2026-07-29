import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  getProfileApi,
  loginApi,
  logoutApi,
  registerApi,
  useAuthStore,
} from '..';

export const useRegisterApi = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useProfileApi = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: false,
  });
};

export const useLoginApi = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      setUser(response.data.data);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error('Something went wrong');
      }
    },
  });
};

export const useLogoutApi = () => {
  const { reset } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      reset();
    },
  });
};
