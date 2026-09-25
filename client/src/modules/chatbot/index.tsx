'use client';

import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { TChatMessage, TChatResponse, useSendChatMessageApi } from './common';
import { ChatRoomCard } from './common/components/chat-room-card';
import { useLocale, useTranslations } from 'next-intl';

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function StandingRobotIcon({
  className = 'h-14 w-14',
  isWorking = false,
}: {
  className?: string;
  isWorking?: boolean;
}) {
  return (
    <span
      aria-hidden='true'
      className={`laxsik-pet-icon inline-flex items-center justify-center ${isWorking ? 'laxsik-pet-working' : ''} ${className}`}>
      <span className='relative block h-full' style={{ aspectRatio: '3 / 4' }}>
        <Image
          src='/images/chatbot5.png'
          width={1440}
          height={1920}
          alt=''
          draggable={false}
          className='laxsik-pet-frame laxsik-pet-frame-primary pointer-events-none h-full w-full object-contain select-none'
        />
        <Image
          src='/images/chatbotsl.png'
          width={2250}
          height={3000}
          alt=''
          draggable={false}
          className='laxsik-pet-frame laxsik-pet-frame-secondary pointer-events-none h-full w-full object-contain select-none'
        />
      </span>
    </span>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className='h-5 w-5 fill-none stroke-current stroke-2'>
      <path d='m4 4 17 8-17 8 3-8-3-8Z' />
      <path d='M7 12h14' />
    </svg>
  );
}

export function ChatbotWidget() {
  const t = useTranslations('Chatbot');
  const locale = useLocale() as 'vi' | 'en';
  const welcomeMessage: TChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: t('welcome'),
  };
  const quickPrompts = [
    t('quick.findForTwo'),
    t('quick.prices'),
    t('quick.bestView'),
  ];
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<TChatMessage[]>([welcomeMessage]);
  const [chatMeta, setChatMeta] = useState<TChatResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendChatMessageApi();

  useEffect(() => {
    if (isOpen) {
      const latestMessage = messages.at(-1);
      if (!sendMessage.isPending && latestMessage?.rooms?.length) {
        latestMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isOpen, messages, sendMessage.isPending]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return null;
  }

  const submitMessage = (content: string) => {
    const normalizedContent = content.trim().slice(0, 600);
    if (!normalizedContent || sendMessage.isPending) return;

    const userMessage: TChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: normalizedContent,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setErrorMessage('');

    sendMessage.mutate(
      {
        locale,
        messages: nextMessages.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
      },
      {
        onSuccess: (response) => {
          setChatMeta(response);
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: createMessageId(),
              role: 'assistant',
              content: response.message,
              rooms: response.rooms ?? [],
            },
          ]);
        },
        onError: (error) => {
          const message = axios.isAxiosError<{ message?: string }>(error)
            ? (error.response?.data?.message ?? t('sendError'))
            : t('sendError');
          setErrorMessage(message);
        },
      }
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(input);
  };

  const clearConversation = () => {
    setMessages([welcomeMessage]);
    setChatMeta(null);
    setErrorMessage('');
    setInput('');
  };

  return (
    <div className='fixed right-3 bottom-4 z-[45] sm:right-6 sm:bottom-6'>
      {isOpen && (
        <section
          role='dialog'
          aria-label={t('label')}
          className='mb-3 flex h-[min(570px,calc(100vh-100px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-[16px] border border-white/40 bg-[#F7FAF8] shadow-[0_24px_80px_rgba(4,45,45,0.3)]'>
          <header className="relative overflow-hidden bg-[linear-gradient(rgba(8,61,61,0.9),rgba(8,61,61,0.9)),url('/images/banner/bg_header.png')] bg-cover bg-center px-5 py-4 text-white">
            <div className='flex items-center justify-between gap-3'>
              <div className='flex min-w-0 items-center gap-3'>
                <span className='flex h-12 w-11 shrink-0 items-center justify-center'>
                  <StandingRobotIcon
                    className='h-11 w-11'
                    isWorking={sendMessage.isPending}
                  />
                </span>
                <span className='min-w-0'>
                  <span className='font-lora block truncate text-base font-semibold'>
                    Laxsik Assistant
                  </span>
                  <span className='mt-0.5 flex items-center gap-1.5 text-[10px] text-white/75'>
                    <span className='h-2 w-2 rounded-full bg-[#8EE0B8]' />
                    {t('subtitle')}
                  </span>
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <button
                  type='button'
                  onClick={clearConversation}
                  disabled={sendMessage.isPending}
                  title={t('clear')}
                  aria-label={t('clear')}
                  className='flex h-9 w-9 items-center justify-center rounded-full text-lg text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40'>
                  ↻
                </button>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  aria-label={t('close')}
                  className='flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/75 transition hover:bg-white/10 hover:text-white'>
                  ×
                </button>
              </div>
            </div>
          </header>

          <div className='flex-1 space-y-4 overflow-y-auto px-4 py-5'>
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? latestMessageRef : null}
                className={`flex min-w-0 flex-col gap-3 ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                <div
                  className={`max-w-[84%] px-4 py-3 text-xs leading-5 break-words whitespace-pre-wrap shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-[16px_16px_4px_16px] bg-[#0D5653] text-white'
                      : 'rounded-[16px_16px_16px_4px] border border-[#E0E9E6] bg-white text-[#314B47]'
                  }`}>
                  {message.content}
                </div>
                {message.role === 'assistant' && !!message.rooms?.length && (
                  <ul
                    aria-label={t('matchingRooms')}
                    className='w-full space-y-2'>
                    {message.rooms.map((room) => (
                      <li key={room.id}>
                        <ChatRoomCard
                          room={room}
                          onNavigate={() => setIsOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className='flex flex-wrap gap-2'>
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type='button'
                    onClick={() => submitMessage(prompt)}
                    className='rounded-full border border-[#C9DBD6] bg-white px-3 py-2 text-[10px] font-bold text-[#0D5653] transition hover:bg-[#EAF3F0]'>
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {sendMessage.isPending && (
              <div className='flex justify-start'>
                <div className='flex items-center gap-1.5 rounded-full border border-[#E0E9E6] bg-white px-4 py-3'>
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className='h-1.5 w-1.5 animate-pulse rounded-full bg-[#5F7772]'
                      style={{ animationDelay: `${index * 140}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className='rounded-[16px] bg-[#FCEBEC] px-4 py-3 text-[11px] font-bold text-[#A33A43]'>
                {errorMessage}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className='border-t border-[#DFE8E5] bg-white p-3'>
            <form onSubmit={handleSubmit} className='flex items-end gap-2'>
              <label className='flex-1'>
                <span className='sr-only'>{t('inputLabel')}</span>
                <textarea
                  rows={1}
                  value={input}
                  maxLength={600}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submitMessage(input);
                    }
                  }}
                  placeholder={t('placeholder')}
                  className='max-h-24 min-h-11 w-full resize-none rounded-[16px] border border-[#D5E2DE] bg-[#F7FAF8] px-4 py-3 text-xs outline-none focus:border-[#0D5653] focus:ring-2 focus:ring-[#0D5653]/10'
                />
              </label>
              <button
                type='submit'
                disabled={!input.trim() || sendMessage.isPending}
                aria-label={t('send')}
                className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0D5653] text-white transition hover:bg-[#083E3D] disabled:cursor-not-allowed disabled:opacity-40'>
                <SendIcon />
              </button>
            </form>
            <p className='mt-2 text-center text-[9px] text-[#85928E]'>
              {!chatMeta
                ? t('footer.default')
                : chatMeta.mode === 'openai'
                  ? t('footer.live')
                  : t('footer.basic')}
            </p>
          </footer>
        </section>
      )}

      <button
        type='button'
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? t('close') : t('open')}
        aria-expanded={isOpen}
        className='chatbot-launcher relative ml-auto flex h-20 w-16 items-center justify-center bg-transparent drop-shadow-[0_10px_9px_rgba(4,45,45,0.42)] transition hover:-translate-y-1 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5653]'>
        <StandingRobotIcon
          className='h-20 w-16'
          isWorking={sendMessage.isPending}
        />
      </button>
    </div>
  );
}
