'use client';

import { TUser, useGoogleLoginApi } from '@/modules/auth/common';
import axios from 'axios';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleAccountLinkForm } from './google-account-link-form';

type TGoogleCredentialResponse = {
  credential: string;
};

type TGoogleButtonOptions = {
  type: 'standard';
  theme: 'outline';
  size: 'large';
  text: 'signin_with';
  shape: 'pill';
  logo_alignment: 'left';
  locale: 'en';
  width: number;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: TGoogleCredentialResponse) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: TGoogleButtonOptions
          ) => void;
        };
      };
    };
  }
}

type TGoogleSignInButtonProps = {
  onSuccess: (user: TUser) => void;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton({ onSuccess }: TGoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const isGoogleInitializedRef = useRef(false);
  const [linkCredential, setLinkCredential] = useState<string | null>(null);
  const { mutate, isPending } = useGoogleLoginApi();

  const renderButton = useCallback(() => {
    if (!googleClientId || !window.google || !buttonRef.current) return;

    buttonRef.current.replaceChildren();
    if (!isGoogleInitializedRef.current) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        auto_select: false,
        callback: ({ credential }) => {
          mutate(
            { credential },
            {
              onSuccess: (response) => onSuccess(response.data.data),
              onError: (error) => {
                if (
                  axios.isAxiosError<{ code?: string }>(error) &&
                  error.response?.data?.code === 'ACCOUNT_LINK_REQUIRED'
                ) {
                  setLinkCredential(credential);
                }
              },
            }
          );
        },
      });
      isGoogleInitializedRef.current = true;
    }
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
      locale: 'en',
      width: Math.min(buttonRef.current.clientWidth || 400, 400),
    });
  }, [mutate, onSuccess]);

  useEffect(() => {
    if (!linkCredential) renderButton();
  }, [linkCredential, renderButton]);

  if (!googleClientId) {
    return (
      <p className='rounded-2xl bg-amber-50 px-4 py-3 text-center text-xs text-amber-800'>
        Google sign-in is not configured yet.
      </p>
    );
  }

  if (linkCredential) {
    return (
      <GoogleAccountLinkForm
        credential={linkCredential}
        onCancel={() => setLinkCredential(null)}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <>
      <Script
        src='https://accounts.google.com/gsi/client?hl=en'
        strategy='afterInteractive'
        onReady={renderButton}
      />
      <div
        className={isPending ? 'pointer-events-none opacity-60' : undefined}
        aria-busy={isPending}>
        <div ref={buttonRef} className='flex min-h-11 justify-center' />
      </div>
    </>
  );
}
