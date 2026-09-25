import { axiosInstance } from '@/apis/axios';
import { TChatApiMessage, TChatResponse } from '../types';

type TChatApiResponse = {
  data: TChatResponse;
};

export const sendChatMessageApi = async ({
  messages,
  locale,
}: {
  messages: TChatApiMessage[];
  locale: 'vi' | 'en';
}) => {
  const response = await axiosInstance.post<TChatApiResponse>('/chat', {
    messages,
    locale,
  });
  return response.data.data;
};
