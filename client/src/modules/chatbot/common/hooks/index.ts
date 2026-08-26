'use client';

import { useMutation } from '@tanstack/react-query';
import { sendChatMessageApi } from '../apis';

export const useSendChatMessageApi = () =>
  useMutation({ mutationFn: sendChatMessageApi });
