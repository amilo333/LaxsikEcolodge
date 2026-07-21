import { useMutation } from '@tanstack/react-query';
import { registerApi } from '@/apis/auth.api';

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};
