import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  getProfileApi,
  loginApi,
  logoutApi,
  registerApi,
  TUser,
  useAuthStore,
} from '..';

export const useRegisterApi = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export const useProfileApi = () => {
  return useQuery<TUser>({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: false,
  });
};

export const useLoginApi = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.setQueryData(['profile'], response.data.data);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      reset();
      queryClient.removeQueries({ queryKey: ['profile'] });
    },
  });
};
