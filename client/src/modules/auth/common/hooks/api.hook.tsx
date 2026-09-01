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

export const useRegisterApi = () => {
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
        toast.error('Something went wrong');
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

export const useGoogleLoginApi = () => {
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
        toast.error(error.response?.data?.message ?? 'Google sign-in failed.');
      } else {
        toast.error('Google sign-in failed.');
      }
    },
  });
};

export const useGoogleAccountLinkApi = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: linkGoogleAccountApi,
    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.setQueryData(['profile'], response.data.data);
      toast.success('Google sign-in has been linked to your account.');
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(
          error.response?.data?.message ?? 'Unable to link Google sign-in.'
        );
      } else {
        toast.error('Unable to link Google sign-in.');
      }
    },
  });
};

export const useForgotPasswordApi = () =>
  useMutation({
    mutationFn: forgotPasswordApi,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            'Unable to send the password reset email.'
        );
      } else {
        toast.error('Unable to send the password reset email.');
      }
    },
  });

export const useResetPasswordApi = () =>
  useMutation({
    mutationFn: resetPasswordApi,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? 'Unable to reset password.'
        );
      } else {
        toast.error('Unable to reset password.');
      }
    },
  });

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
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation<TUser, unknown, TUpdateProfilePayload>({
    mutationFn: updateProfileApi,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['profile'], user);
      toast.success('Profile updated successfully.');
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(
          error.response?.data?.message ?? 'Unable to update your profile.'
        );
      } else {
        toast.error('Unable to update your profile.');
      }
    },
  });
};
