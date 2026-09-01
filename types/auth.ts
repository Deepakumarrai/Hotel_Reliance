export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface BookingIntent {
  roomId?: string | null;
  roomSlug?: string | null;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  redirectUrl?: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  agreedToTerms?: boolean;
  isHumanVerified?: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserProfileUpdate {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}
