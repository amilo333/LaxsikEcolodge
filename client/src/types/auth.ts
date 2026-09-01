export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface GoogleAccountLinkRequest extends GoogleLoginRequest {
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
