import { axiosInstance } from '@/apis/axios';
import { TChatApiMessage, TChatResponse } from '../types';

type TChatApiResponse = {
  data: TChatResponse;
};

export const sendChatMessageApi = async (messages: TChatApiMessage[]) => {
  const response = await axiosInstance.post<TChatApiResponse>('/chat', {
    messages,
  });
  return response.data.data;
};
