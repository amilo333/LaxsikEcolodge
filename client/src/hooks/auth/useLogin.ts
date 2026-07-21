import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/apis/auth.api';
import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';
import { toast } from 'sonner';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      login(response.data.data);
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
