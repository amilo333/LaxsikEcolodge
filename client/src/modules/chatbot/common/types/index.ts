export type TChatRole = 'user' | 'assistant';

export type TChatMessage = {
  id: string;
  role: TChatRole;
  content: string;
};

export type TChatApiMessage = Pick<TChatMessage, 'role' | 'content'>;

export type TChatResponse = {
  message: string;
  mode: 'fallback' | 'openai';
  model: string | null;
  toolsUsed: string[];
};
