import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  forgotPasswordApi,
  getProfileApi,
  googleLoginApi,
  loginApi,
  linkGoogleAccountApi,
  logoutApi,
  registerApi,
  resetPasswordApi,
  TUpdateProfilePayload,
  TUser,
  updateProfileApi,
  useAuthStore,
} from '..';
import { useTranslations } from 'next-intl';

export const useRegisterApi = () => {
  const t = useTranslations('Auth.api');
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerApi,

    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.setQueryData(['profile'], response.data.data);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(t('genericError'));
      }
    },
  });
};

export const useProfileApi = () => {
  return useQuery<TUser>({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLoginApi = () => {
  const t = useTranslations('Auth.api');
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
        toast.error(t('genericError'));
      }
    },
  });
};

export const useGoogleLoginApi = () => {
  const t = useTranslations('Auth.api');
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLoginApi,
    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.setQueryData(['profile'], response.data.data);
    },
    onError: (error) => {
      if (
        axios.isAxiosError<{ code?: string }>(error) &&
        error.response?.data?.code === 'ACCOUNT_LINK_REQUIRED'
      ) {
        return;
      }

      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? t('googleSignInFailed'));
      } else {
        toast.error(t('googleSignInFailed'));
      }
    },
  });
};

export const useGoogleAccountLinkApi = () => {
  const t = useTranslations('Auth.api');
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: linkGoogleAccountApi,
    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.setQueryData(['profile'], response.data.data);
      toast.success(t('googleLinked'));
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? t('googleLinkFailed'));
      } else {
        toast.error(t('googleLinkFailed'));
      }
    },
  });
};

export const useForgotPasswordApi = () => {
  const t = useTranslations('Auth.api');

  return useMutation({
    mutationFn: forgotPasswordApi,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? t('resetEmailFailed'));
      } else {
        toast.error(t('resetEmailFailed'));
      }
    },
  });
};

export const useResetPasswordApi = () => {
  const t = useTranslations('Auth.api');

  return useMutation({
    mutationFn: resetPasswordApi,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? t('resetFailed'));
      } else {
        toast.error(t('resetFailed'));
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

export const useUpdateProfileApi = () => {
  const t = useTranslations('Auth.api');
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation<TUser, unknown, TUpdateProfilePayload>({
    mutationFn: updateProfileApi,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['profile'], user);
      toast.success(t('profileUpdated'));
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message ?? t('profileUpdateFailed'));
      } else {
        toast.error(t('profileUpdateFailed'));
      }
    },
  });
};
