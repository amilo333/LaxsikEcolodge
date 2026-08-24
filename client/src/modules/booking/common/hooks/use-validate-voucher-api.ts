import { useMutation } from '@tanstack/react-query';
import { validateVoucherApi } from '../apis';

export const useValidateVoucherApi = () =>
  useMutation({ mutationFn: validateVoucherApi });
