export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  full_name: string;
  username: string;
  email: string;
  password: string;
  birth_date: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
