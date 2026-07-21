import { useMutation } from '@tanstack/react-query';
import { logoutApi } from '@/apis/auth.api';
import { useAuthStore } from '@/store/auth.store';

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      logout();
    },
  });
};
